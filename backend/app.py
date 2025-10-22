from flask import Flask, request, jsonify, session
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
import bcrypt
from datetime import datetime
import os

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'  # Change this to a random secret key
CORS(app, origins=["http://localhost:5500", "http://127.0.0.1:5500"], supports_credentials=True)  # Enable CORS for all routes

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

@app.route('/')
def home():
    return jsonify({"message": "MediTrack Backend is running!"})

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

if __name__ == '__main__':
    app.run(debug=True, port=5000)