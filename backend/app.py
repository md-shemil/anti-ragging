from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash
import traceback

app = Flask(__name__)
CORS(app)

# MySQL DB Config
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="2005",
    database="complaints_db"
)

# Recreate cursor for each request to avoid stale connections
def get_cursor():
    if not db.is_connected():
        db.reconnect()
    return db.cursor(dictionary=True)

# ---------- ROUTES ----------

@app.route('/register', methods=['POST'])
def register():
    cursor = get_cursor()
    data = request.json
    name = data['name']
    email = data['email']
    password = generate_password_hash(data['password'])
    role = data['role']
    student_id = data.get('studentId', '')
    department = data['department']
    
    # Check if user already exists
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    if cursor.fetchone():
        cursor.close()
        return jsonify({"success": False, "message": "User already exists!"}), 400
    
    # Insert new user
    query = "INSERT INTO users (name, email, password, role, student_id, department) VALUES (%s, %s, %s, %s, %s, %s)"
    cursor.execute(query, (name, email, password, role, student_id, department))
    db.commit()
    cursor.close()
    return jsonify({"success": True, "message": "Registration successful!"})


@app.route('/login', methods=['POST'])
def login():
    cursor = get_cursor()
    data = request.json
    email = data['email']
    password = data['password']
    
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    cursor.close()
    
    if user and check_password_hash(user['password'], password):
        return jsonify({
            "success": True,
            "message": "Login successful",
            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "role": user["role"],
                "studentId": user["student_id"],
                "department": user["department"]
            }
        })
    else:
        return jsonify({"success": False, "message": "Invalid email or password"}), 401


@app.route('/submit-complaint', methods=['POST'])
def submit_complaint():
    cursor = get_cursor()
    try:
        # Debug: Print what we've received
        print("Form data:", request.form)
        print("Files:", request.files)
        
        # Extract basic form fields
        user_id = request.form.get('user_id')
        subject = request.form.get('subject')
        description = request.form.get('description')
        date = request.form.get('date')
        location = request.form.get('location')
        witnesses = request.form.get('witnesses', '')
        
        # Simple version - store everything as complaint_text
        complaint_text = f"Subject: {subject}\nDate: {date}\nLocation: {location}\nDescription: {description}\nWitnesses: {witnesses}"
        
        # Check if we have a file
        file_data = None
        file_name = None
        
        if 'file' in request.files and request.files['file'].filename:
            file = request.files['file']
            file_data = file.read()
            file_name = file.filename
        
        # Insert into database
        if file_data:
            # First make sure your database has these columns
            cursor.execute("""
                INSERT INTO complaints 
                (user_id, complaint_text, file_name, file_data) 
                VALUES (%s, %s, %s, %s)
            """, (user_id, complaint_text, file_name, file_data))
        else:
            cursor.execute("""
                INSERT INTO complaints 
                (user_id, complaint_text) 
                VALUES (%s, %s)
            """, (user_id, complaint_text))
        
        db.commit()
        cursor.close()
        return jsonify({"success": True, "message": "Complaint submitted successfully!"})
    
    except Exception as e:
        db.rollback()
        print("Error in submit_complaint:", str(e))
        print(traceback.format_exc())  # Print full traceback
        cursor.close()
        return jsonify({"success": False, "message": f"Error submitting complaint: {str(e)}"}), 500


@app.route('/user-complaints/<int:user_id>', methods=['GET'])
def get_user_complaints(user_id):
    cursor = get_cursor()
    cursor.execute("SELECT * FROM complaints WHERE user_id = %s", (user_id,))
    complaints = cursor.fetchall()
    
    # Convert datetime objects to strings for JSON serialization
    for complaint in complaints:
        if 'created_at' in complaint and complaint['created_at']:
            complaint['created_at'] = complaint['created_at'].isoformat()
    
    cursor.close()
    return jsonify(complaints)


# ---------- MAIN ----------
if __name__ == '__main__':
    app.run(debug=True)