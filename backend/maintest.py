import os
import hashlib
import requests
import time
from flask import Flask, request, jsonify, render_template
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

# Load API key from .env
load_dotenv()
API_KEY = os.getenv("VIRUSTOTAL_API_KEY")

app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = "uploads"
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

# Safe folder for clean files
SAFE_FOLDER = "uploadsafe"
os.makedirs(SAFE_FOLDER, exist_ok=True)

def calculate_file_hash(file_path):
    """Calculate SHA-256 hash of a file."""
    sha256 = hashlib.sha256()
    with open(file_path, "rb") as f:
        while chunk := f.read(8192):
            sha256.update(chunk)
    return sha256.hexdigest()

def get_file_report(file_hash):
    """Get file report from VirusTotal using its hash."""
    headers = {"x-apikey": API_KEY}
    url = f"https://www.virustotal.com/api/v3/files/{file_hash}"
    response = requests.get(url, headers=headers)
    return response

def upload_file_to_virustotal(file_path):
    """Upload a file to VirusTotal for analysis."""
    url = "https://www.virustotal.com/api/v3/files"
    headers = {"x-apikey": API_KEY}
    with open(file_path, "rb") as f:
        files = {"file": (os.path.basename(file_path), f)}
        response = requests.post(url, headers=headers, files=files)
    return response

def check_file_malicious(file_path):
    """Check if a file is malicious using VirusTotal."""
    file_hash = calculate_file_hash(file_path)
    response = get_file_report(file_hash)

    if response.status_code == 200:
        data = response.json()
        stats = data["data"]["attributes"]["last_analysis_stats"]
        return {
            "is_malicious": stats["malicious"] > 0,
            "detections": stats["malicious"],
            "total_engines": sum(stats.values()),
            "results": stats,
        }
    elif response.status_code == 404:
        # File not found, upload it for analysis
        upload_response = upload_file_to_virustotal(file_path)
        if upload_response.status_code == 200:
            upload_data = upload_response.json()
            analysis_id = upload_data["data"]["id"]

            # Poll analysis result (wait for completion)
            analysis_url = f"https://www.virustotal.com/api/v3/analyses/{analysis_id}"
            headers = {"x-apikey": API_KEY}
            for _ in range(10):
                analysis_response = requests.get(analysis_url, headers=headers)
                analysis_data = analysis_response.json()
                status = analysis_data["data"]["attributes"]["status"]
                if status == "completed":
                    stats = analysis_data["data"]["attributes"]["stats"]
                    return {
                        "is_malicious": stats["malicious"] > 0,
                        "detections": stats["malicious"],
                        "total_engines": sum(stats.values()),
                        "results": stats,
                    }
                time.sleep(2)
            return {"error": "Scan timed out waiting for completion."}
        else:
            return {"error": f"Upload failed: {upload_response.status_code}"}
    else:
        return {"error": f"API Error: {response.status_code}"}

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/scan", methods=["POST"])
def scan():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(filepath)

    result = check_file_malicious(filepath)

    # Move to safe folder if clean, otherwise delete
    if result.get("is_malicious"):
        os.remove(filepath)
    else:
        os.rename(filepath, os.path.join(SAFE_FOLDER, filename))

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
