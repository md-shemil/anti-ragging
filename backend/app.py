import os
import shutil
import traceback
import hashlib
import requests
import mysql.connector
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from io import BytesIO

# ------------------ Config ------------------
app = Flask(__name__)
CORS(app)

SAFE_FOLDER = os.path.join(os.getcwd(), "uploadsafe")
os.makedirs(SAFE_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {"pdf"}

# ------------------ VirusTotal ------------------
VIRUSTOTAL_API_KEY = "d44b856bb4dcd383004d119afe4204acadabfd52947bee7550533bc8332658b4"
VIRUSTOTAL_API_URL = "https://www.virustotal.com/api/v3/files/"

def allowed_file(filename):
    """Check if file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def calculate_file_hash(file_bytes):
    """Calculate SHA-256 hash of the file."""
    file_hash = hashlib.sha256()
    file_hash.update(file_bytes)
    return file_hash.hexdigest()

def scan_file_with_virustotal(file_bytes):
    """Scan a file with VirusTotal."""
    file_hash = calculate_file_hash(file_bytes)
    headers = {"x-apikey": VIRUSTOTAL_API_KEY}
    response = requests.get(f"{VIRUSTOTAL_API_URL}{file_hash}", headers=headers)

    if response.status_code == 200:
        result = response.json()
        scan_results = result.get("data", {}).get("attributes", {}).get("last_analysis_results", {})
        return scan_results
    elif response.status_code == 404:
        return {"error": "File not found in VirusTotal database."}
    else:
        return {"error": f"VirusTotal error: {response.status_code}"}

# ------------------ Database ------------------
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="2005",
    database="complaints_db"
)

def get_cursor():
    """Get MySQL cursor."""
    if not db.is_connected():
        db.reconnect()
    return db.cursor(dictionary=True)

# ------------------ Routes ------------------
@app.route('/submit-complaint', methods=['POST'])
def submit_complaint():
    cursor = get_cursor()
    try:
        # Extract complaint data from the form
        user_id = request.form.get('user_id')
        subject = request.form.get('subject')
        description = request.form.get('description')
        date = request.form.get('date') or 'N/A'
        location = request.form.get('location') or 'N/A'
        witnesses = request.form.get('witnesses') or 'N/A'

        if not user_id or not subject or not description:
            return jsonify({"success": False, "message": "Missing required fields"}), 400

        complaint_text = (
            f"Subject: {subject}\n"
            f"Date: {date}\n"
            f"Location: {location}\n"
            f"Description: {description}\n"
            f"Witnesses: {witnesses}"
        )

        file = request.files.get('file')
        pdf_path = None

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_bytes = file.read()

            # VirusTotal Scan
            scan_result = scan_file_with_virustotal(file_bytes)
            if "error" in scan_result:
                return jsonify({"success": False, "message": scan_result["error"]}), 400

            malicious_count = sum(
                1 for engine in scan_result.values()
                if engine.get("category") == "malicious"
            )

            if malicious_count > 0:
                return jsonify({
                    "success": False,
                    "message": f"🚨 MALICIOUS FILE! Detected by {malicious_count} engines."
                }), 400

            # Save file only if clean
            safe_path = os.path.join(SAFE_FOLDER, filename)
            with open(safe_path, 'wb') as f:
                f.write(file_bytes)
            pdf_path = safe_path
            print(f"[INFO] Clean file saved to: {safe_path}")

        elif file:
            return jsonify({"success": False, "message": "Invalid file format. Only PDF allowed."}), 400

        # Insert complaint data into the database
        cursor.execute("""
            INSERT INTO complaints (user_id, complaint_text, pdf_path)
            VALUES (%s, %s, %s)
        """, (user_id, complaint_text, pdf_path))

        db.commit()
        cursor.close()
        return jsonify({"success": True, "message": "Complaint submitted successfully."})

    except Exception as e:
        db.rollback()
        print("Error:", str(e))
        print(traceback.format_exc())
        cursor.close()
        return jsonify({"success": False, "message": "An error occurred while submitting your complaint."}), 500

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
    app.run(debug=True)
