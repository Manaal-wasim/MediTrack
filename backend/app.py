from flask import Flask, request, jsonify, session
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
import bcrypt
from datetime import datetime
import os

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'  # Change this to a random secret key
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False  # Set to True in production with HTTPS
app.config['SESSION_COOKIE_HTTPONLY'] = True
CORS(app, origins=["http://localhost:5500", "http://127.0.0.1:5500","http://localhost:3000", "http://127.0.0.1:3000"], supports_credentials=True, allow_headers=["Content-Type", "Authorization", "User-id"], methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])  # Enable CORS for all routes

# Database configuration
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'azka.123',
    'database': 'SmartHealthReminder'
}

def get_db_connection():
    try:
        connection = mysql.connector.connect(**db_config)
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

# Helper function to hash passwords
def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

# Helper function to check password
def check_password(hashed_password, user_password):
    return bcrypt.checkpw(user_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_authenticated_user_id():
    """Get user ID from session or from Authorization header"""
    # First try session (for traditional login)
    if 'user_id' in session:
        print(f"✅ Authenticated via session: user_id {session['user_id']}")
        return session['user_id']
    
    # Fallback to header (for API calls)
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        try:
            user_id = int(auth_header.replace('Bearer ', ''))
            print(f"✅ Authenticated via header: user_id {user_id}")
            return int(auth_header.replace('Bearer ', ''))
        except ValueError:
            print("❌ Invalid user ID in Authorization header")
            pass
    print("❌ No authentication found")
    return None
@app.route('/')
def home():
    return jsonify({"message": "MediTrack Backend is running!"})

@app.route('/api/debug-session', methods=['GET'])
def debug_session():
    return jsonify({
        'user_id_in_session': session.get('user_id'),
        'session_keys': list(session.keys()),
        'authenticated': 'user_id' in session
    }), 200

# Signup endpoint
@app.route('/signup', methods=['POST'])
def signup():
    print("=== SIGNUP REQUEST RECEIVED ===")  # Debug line
    data = request.json
    print(f"Received data: {data}")  # Debug line
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'client')  # Default to 'client'
    print(f"Processing: {name}, {email}")  # Debug line
    
    
    # Additional client fields
    age = data.get('age')
    gender = data.get('gender')
    contact = data.get('contact')
    
    if not name or not email or not password:
        return jsonify({"error": "Name, email, and password are required"}), 400
    
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cursor = connection.cursor()
        
        # Check if email already exists
        cursor.execute("SELECT email FROM User WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({"error": "Email already exists"}), 400
        
        # Hash password
        hashed_password = hash_password(password)
        
        # Insert into User table
        cursor.execute(
            "INSERT INTO User (name, email, password, role) VALUES (%s, %s, %s, %s)",
            (name, email, hashed_password, role)
        )
        user_id = cursor.lastrowid
        
        # If user is client, insert into Client table
        if role == 'client' and user_id:
            cursor.execute(
                "INSERT INTO Client (client_id, age, gender, contact) VALUES (%s, %s, %s, %s)",
                (user_id, age, gender, contact)
            )
        
        connection.commit()
        
        return jsonify({
            "message": "User created successfully",
            "user_id": user_id,
            "role": role
        }), 201
        
    except Error as e:
        connection.rollback()
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        cursor.close()
        connection.close()

# Login endpoint
@app.route('/login', methods=['POST'])
def login():
    print("=== LOGIN REQUEST RECEIVED ===")
    data = request.json
    print(f"Login data: {data}")
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        
        # Get user from database
        cursor.execute("""
            SELECT user_id, name, email, password, role 
            FROM User 
            WHERE email = %s
        """, (email,))
        
        user = cursor.fetchone()
        
        if not user:
            return jsonify({"error": "Invalid email or password"}), 401
        
        # Check password
        if not check_password(user['password'], password):
            return jsonify({"error": "Invalid email or password"}), 401
        
        # Update last login for admin
        if user['role'] == 'admin':
            cursor.execute(
                "UPDATE Admin SET last_login = %s WHERE admin_id = %s",
                (datetime.now(), user['user_id'])
            )
            connection.commit()
        
        # Store user info in session
        session['user_id'] = user['user_id']
        session['email'] = user['email']
        session['role'] = user['role']
        session['name'] = user['name']
        
        return jsonify({
            "message": "Login successful",
            "user": {
                "user_id": user['user_id'],
                "name": user['name'],
                "email": user['email'],
                "role": user['role']
            }
        }), 200
        
    except Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        cursor.close()
        connection.close()

# Logout endpoint
@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"message": "Logout successful"}), 200

# Check authentication status
@app.route('/check-auth', methods=['GET'])
def check_auth():
    if 'user_id' in session:
        return jsonify({
            "authenticated": True,
            "user": {
                "user_id": session['user_id'],
                "name": session['name'],
                "email": session['email'],
                "role": session['role']
            }
        }), 200
    else:
        return jsonify({"authenticated": False}), 200
# Medication Schedule Endpoints
@app.route('/api/medications/today', methods=['GET'])
def get_today_medications():
    user_id = get_authenticated_user_id()
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401
    
    print(f"🔍 Fetching today's medications for user {user_id}")
    
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        
        cursor.execute("""
            SELECT m.medicine_id, m.name, m.dosage, m.note as notes,
                   r.reminder_time as schedule_time, r.status
            FROM Medicine m
            LEFT JOIN Reminder r ON m.medicine_id = r.medicine_id
            WHERE m.client_id = %s 
            AND DATE(r.reminder_time) = CURDATE()
            ORDER BY r.reminder_time
        """, (user_id,))
        
        medications = cursor.fetchall()
        print(f"📦 Found {len(medications)} medications for today")
        
        formatted_medications = []
        for med in medications:
            if med['schedule_time']:
                formatted_medications.append({
                    'id': med['medicine_id'],
                    'name': med['name'],
                    'dosage': med['dosage'],
                    'notes': med['notes'] or '',
                    'time': str(med['schedule_time']),
                    'status': med['status'] or 'Pending'
                })
        
        print(f"✅ Returning {len(formatted_medications)} formatted medications")
        return jsonify({"medications": formatted_medications}), 200
        
    except Error as e:
        print(f"💥 Database error: {str(e)}")
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/api/medications', methods=['GET'])
def get_medications():
    user_id = get_authenticated_user_id()
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401
    
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        
        cursor.execute("""
            SELECT m.medicine_id, m.name, m.dosage, m.note as notes,
                   r.reminder_time as schedule_time, r.status
            FROM Medicine m
            LEFT JOIN Reminder r ON m.medicine_id = r.medicine_id
            WHERE m.client_id = %s
            ORDER BY r.reminder_time
        """, (user_id,))
        
        medications = cursor.fetchall()
        
        formatted_medications = []
        for med in medications:
            if med['schedule_time']:
                formatted_medications.append({
                    'id': med['medicine_id'],
                    'name': med['name'],
                    'dosage': med['dosage'],
                    'notes': med['notes'] or '',
                    'time': str(med['schedule_time']),
                    'status': med['status'] or 'Pending'
                })
        
        return jsonify({"medications": formatted_medications}), 200
        
    except Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/api/medications/monthly', methods=['GET'])
def get_monthly_medications():
    user_id = get_authenticated_user_id()
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401
    
    year = request.args.get('year')
    month = request.args.get('month')
    
    if not year or not month:
        return jsonify({"error": "Year and month parameters are required"}), 400
    
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        
        cursor.execute("""
            SELECT DAY(r.reminder_time) as day, 
                   m.name, m.dosage, r.reminder_time as schedule_time, m.note as notes
            FROM Medicine m
            JOIN Reminder r ON m.medicine_id = r.medicine_id
            WHERE m.client_id = %s 
            AND YEAR(r.reminder_time) = %s 
            AND MONTH(r.reminder_time) = %s
            ORDER BY r.reminder_time
        """, (user_id, year, month))
        
        medications = cursor.fetchall()
        
        monthly_data = {}
        for med in medications:
            day = med['day']
            time_str = str(med['schedule_time'])
            
            hour = int(time_str.split(' ')[1].split(':')[0])
            if 6 <= hour < 12:
                time_period = 'morning'
            elif 12 <= hour < 18:
                time_period = 'afternoon'
            elif 18 <= hour < 22:
                time_period = 'evening'
            else:
                time_period = 'night'
            
            if day not in monthly_data:
                monthly_data[day] = []
            
            monthly_data[day].append({
                'name': med['name'],
                'time': time_period,
                'dosage': med['dosage'],
                'icon': get_medication_icon(med['name'])
            })
        
        return jsonify({"medications": monthly_data}), 200
        
    except Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        cursor.close()
        connection.close()
def get_medication_icon(medication_name):
    """Helper function to determine icon based on medication name"""
    name_lower = medication_name.lower()
    if 'vitamin' in name_lower:
        return 'fa-apple-alt'
    elif 'aspirin' in name_lower or 'pain' in name_lower:
        return 'fa-pills'
    elif 'blood' in name_lower or 'pressure' in name_lower:
        return 'fa-heartbeat'
    elif 'allergy' in name_lower:
        return 'fa-wind'
    elif 'antibiotic' in name_lower:
        return 'fa-bacteria'
    elif 'sleep' in name_lower:
        return 'fa-moon'
    elif 'calcium' in name_lower or 'bone' in name_lower:
        return 'fa-bone'
    else:
        return 'fa-capsules'
@app.route('/api/medications', methods=['POST'])
def add_medication():
    user_id = get_authenticated_user_id()  # Get user ID from header
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401
    
    data = request.json
    
    name = data.get('name')
    dosage = data.get('dosage')
    schedule_time = data.get('time')
    notes = data.get('notes')
    
    if not name or not dosage or not schedule_time:
        return jsonify({"error": "Name, dosage, and time are required"}), 400
    
    print(f"🔍 Adding medication for user {user_id}: {name}, {dosage}, {schedule_time}")
    
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cursor = connection.cursor()
        
        # First insert into Medicine table
        cursor.execute("""
            INSERT INTO Medicine (client_id, name, dosage, note)
            VALUES (%s, %s, %s, %s)
        """, (user_id, name, dosage, notes))
        
        medicine_id = cursor.lastrowid
        
        # Then insert into Reminder table
        cursor.execute("""
            INSERT INTO Reminder (medicine_id, reminder_time, status)
            VALUES (%s, %s, 'Pending')
        """, (medicine_id, schedule_time))
        
        connection.commit()
        
        print(f"✅ Medication added successfully with ID: {medicine_id}")
        
        return jsonify({
            "message": "Medication added successfully",
            "medicine_id": medicine_id
        }), 201
        
    except Error as e:
        connection.rollback()
        print(f"💥 Database error: {str(e)}")
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        cursor.close()
        connection.close()
        
@app.route('/api/medications/<int:medicine_id>', methods=['PUT'])
def update_medication(medicine_id):
    user_id = get_authenticated_user_id()  # CHANGED THIS LINE
    if 'user_id' not in session:
        return jsonify({"error": "Not authenticated"}), 401
    
    data = request.json
    
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cursor = connection.cursor()
        
        # Check if medication belongs to user
        cursor.execute("SELECT client_id FROM Medicine WHERE medicine_id = %s", (medicine_id,))
        medicine = cursor.fetchone()
        
        if not medicine or medicine[0] != session['user_id']:
            return jsonify({"error": "Medicine not found or access denied"}), 404
        
        # Update medicine
        cursor.execute("""
            UPDATE Medicine 
            SET name = %s, dosage = %s, note = %s
            WHERE medicine_id = %s
        """, (
            data.get('name'),
            data.get('dosage'),
            data.get('notes'),
            medicine_id
        ))
        
        # Update reminder time if provided
        if data.get('time'):
            cursor.execute("""
                UPDATE Reminder 
                SET reminder_time = %s
                WHERE medicine_id = %s
            """, (data.get('time'), medicine_id))
        
        connection.commit()
        
        return jsonify({"message": "Medication updated successfully"}), 200
        
    except Error as e:
        connection.rollback()
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/api/medications/<int:medicine_id>', methods=['DELETE'])
def delete_medication(medicine_id):
    user_id = get_authenticated_user_id()  # CHANGED THIS LINE
    if 'user_id' not in session:
        return jsonify({"error": "Not authenticated"}), 401
    
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cursor = connection.cursor()
        
        # Check if medication belongs to user
        cursor.execute("SELECT client_id FROM Medicine WHERE medicine_id = %s", (medicine_id,))
        medicine = cursor.fetchone()
        
        if not medicine or medicine[0] != session['user_id']:
            return jsonify({"error": "Medicine not found or access denied"}), 404
        
        # Delete from Medicine (cascades to Reminder and Log due to foreign key)
        cursor.execute("DELETE FROM Medicine WHERE medicine_id = %s", (medicine_id,))
        connection.commit()
        
        return jsonify({"message": "Medication deleted successfully"}), 200
        
    except Error as e:
        connection.rollback()
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/api/medications/<int:medicine_id>/status', methods=['PUT'])
def update_medication_status(medicine_id):
    user_id = get_authenticated_user_id()  # CHANGED THIS LINE
    if 'user_id' not in session:
        return jsonify({"error": "Not authenticated"}), 401
    
    data = request.json
    status = data.get('status')
    
    # Map frontend status to database status
    status_map = {
        'taken': 'Completed',
        'upcoming': 'Pending', 
        'missed': 'Pending'  # You might want to handle missed differently
    }
    
    db_status = status_map.get(status, 'Pending')
    
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cursor = connection.cursor()
        
        # Check if medication belongs to user
        cursor.execute("SELECT client_id FROM Medicine WHERE medicine_id = %s", (medicine_id,))
        medicine = cursor.fetchone()
        
        if not medicine or medicine[0] != session['user_id']:
            return jsonify({"error": "Medicine not found or access denied"}), 404
        
        # Update reminder status
        cursor.execute("""
            UPDATE Reminder 
            SET status = %s
            WHERE medicine_id = %s
        """, (db_status, medicine_id))
        
        # Log the action if taken
        if status == 'taken':
            cursor.execute("""
                INSERT INTO Log (reminder_id, action)
                SELECT reminder_id, 'Taken' 
                FROM Reminder 
                WHERE medicine_id = %s
            """, (medicine_id,))
        
        connection.commit()
        
        return jsonify({"message": "Medication status updated successfully"}), 200
        
    except Error as e:
        connection.rollback()
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        cursor.close()
        connection.close()

# My Medications API Endpoints
@app.route('/api/my-medications', methods=['GET'])
def get_my_medications():
    user_id = get_authenticated_user_id()
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401
    
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        
        # Get all medications for the user with reminder details
        cursor.execute("""
            SELECT 
                m.medicine_id as id,
                m.name,
                m.dosage,
                m.note as notes,
                r.reminder_time as time,
                r.status,
                d.name as prescriber,
                d.specialization as purpose
            FROM Medicine m
            LEFT JOIN Reminder r ON m.medicine_id = r.medicine_id
            LEFT JOIN Doctor d ON m.client_id = d.client_id
            WHERE m.client_id = %s
            ORDER BY m.name, r.reminder_time
        """, (user_id,))
        
        medications = cursor.fetchall()
        
        # Format the medications data
        formatted_medications = []
        for med in medications:
            # Calculate refills based on some logic (you might want to adjust this)
            refills = 3  # Default value, adjust based on your business logic
            
            formatted_medications.append({
                'id': med['id'],
                'name': med['name'],
                'dosage': med['dosage'],
                'frequency': 'Once daily',  # You might want to calculate this from reminder times
                'purpose': med['purpose'] or 'General Health',
                'prescriber': med['prescriber'] or 'Dr. Unknown',
                'startDate': med['time'].strftime('%Y-%m-%d') if med['time'] else datetime.now().strftime('%Y-%m-%d'),
                'refills': refills,
                'notes': med['notes'] or '',
                'status': med['status'] or 'Pending'
            })
        
        return jsonify({"medications": formatted_medications}), 200
        
    except Error as e:
        print(f"Database error: {str(e)}")
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/api/my-medications/search', methods=['GET'])
def search_my_medications():
    user_id = get_authenticated_user_id()
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401
    
    search_term = request.args.get('q', '')
    
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        
        # Search medications by name for the current user
        cursor.execute("""
            SELECT 
                m.medicine_id as id,
                m.name,
                m.dosage,
                m.note as notes,
                r.reminder_time as time,
                r.status,
                d.name as prescriber,
                d.specialization as purpose
            FROM Medicine m
            LEFT JOIN Reminder r ON m.medicine_id = r.medicine_id
            LEFT JOIN Doctor d ON m.client_id = d.client_id
            WHERE m.client_id = %s AND m.name LIKE %s
            ORDER BY m.name, r.reminder_time
        """, (user_id, f'%{search_term}%'))
        
        medications = cursor.fetchall()
        
        # Format the medications data (same as above)
        formatted_medications = []
        for med in medications:
            refills = 3  # Default value
            
            formatted_medications.append({
                'id': med['id'],
                'name': med['name'],
                'dosage': med['dosage'],
                'frequency': 'Once daily',
                'purpose': med['purpose'] or 'General Health',
                'prescriber': med['prescriber'] or 'Dr. Unknown',
                'startDate': med['time'].strftime('%Y-%m-%d') if med['time'] else datetime.now().strftime('%Y-%m-%d'),
                'refills': refills,
                'notes': med['notes'] or '',
                'status': med['status'] or 'Pending'
            })
        
        return jsonify({"medications": formatted_medications}), 200
        
    except Error as e:
        print(f"Database error: {str(e)}")
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        cursor.close()
        connection.close()

# Fix the authentication issue in existing endpoints
def get_authenticated_user_id():
    """Get user ID from session or from Authorization header"""
    # First try session (for traditional login)
    if 'user_id' in session:
        print(f"✅ Authenticated via session: user_id {session['user_id']}")
        return session['user_id']
    
    # Fallback to header (for API calls)
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        try:
            user_id = int(auth_header.replace('Bearer ', ''))
            print(f"✅ Authenticated via header: user_id {user_id}")
            return user_id
        except ValueError:
            print("❌ Invalid user ID in Authorization header")
            pass
    
    # Also check for user_id in request headers directly
    user_id_header = request.headers.get('User-Id')
    if user_id_header:
        try:
            user_id = int(user_id_header)
            print(f"✅ Authenticated via User-Id header: user_id {user_id}")
            return user_id
        except ValueError:
            print("❌ Invalid user ID in User-Id header")
            pass
    
    print("❌ No authentication found")
    return None

if __name__ == '__main__':
    app.run(debug=True, port=5000)