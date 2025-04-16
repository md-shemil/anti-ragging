from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os
import traceback

# ------------------ Config ------------------

app = Flask(__name__)
CORS(app)

# Uploads folder setup
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
ALLOWED_EXTENSIONS = {"pdf"}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ------------------ Database ------------------

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="2005",
    database="complaints_db"
)

def get_cursor():
    if not db.is_connected():
        db.reconnect()
    return db.cursor(dictionary=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ------------------ Routes ------------------

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

    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    if cursor.fetchone():
        cursor.close()
        return jsonify({"success": False, "message": "User already exists!"}), 400

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
        # Extract fields
        user_id = request.form.get('user_id')
        subject = request.form.get('subject')
        description = request.form.get('description')
        date = request.form.get('date')
        location = request.form.get('location')
        witnesses = request.form.get('witnesses', '')

        complaint_text = f"Subject: {subject}\nDate: {date}\nLocation: {location}\nDescription: {description}\nWitnesses: {witnesses}"

        file = request.files.get('file')
        saved_filename = None

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            saved_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(saved_path)
            saved_filename = filename
            print(f"[INFO] File saved to: {saved_path}")
        else:
            print("[INFO] No valid file uploaded.")

        # Insert into complaints table
        cursor.execute("""
            INSERT INTO complaints (user_id, complaint_text)
            VALUES (%s, %s)
        """, (user_id, complaint_text))

        db.commit()
        cursor.close()
        return jsonify({"success": True, "message": "Complaint submitted and file saved!"})

    except Exception as e:
        db.rollback()
        print("Error:", str(e))
        print(traceback.format_exc())
        cursor.close()
        return jsonify({"success": False, "message": f"Error submitting complaint: {str(e)}"}), 500


@app.route('/user-complaints/<int:user_id>', methods=['GET'])
def get_user_complaints(user_id):
    cursor = get_cursor()
    cursor.execute("SELECT * FROM complaints WHERE user_id = %s", (user_id,))
    complaints = cursor.fetchall()

    for complaint in complaints:
        if 'created_at' in complaint and complaint['created_at']:
            complaint['created_at'] = complaint['created_at'].isoformat()

    cursor.close()
    return jsonify(complaints)


# ------------------ Main ------------------

if __name__ == '__main__':
    app.run(debug=False)
