import os
import requests
from dotenv import load_dotenv

# Load API key from .env
load_dotenv()
API_KEY = os.getenv("VIRUSTOTAL_API_KEY")

def calculate_file_hash(file_path):
    """Calculate SHA-256 hash of a file."""
    import hashlib
    sha256 = hashlib.sha256()
    with open(file_path, "rb") as f:
        while chunk := f.read(8192):
            sha256.update(chunk)
    return sha256.hexdigest()

def check_file_malicious(file_path):
    """Check if a file is malicious using VirusTotal."""
    if not os.path.exists(file_path):
        return {"error": "File not found."}

    file_hash = calculate_file_hash(file_path)
    headers = {"x-apikey": API_KEY}
    url = f"https://www.virustotal.com/api/v3/files/{file_hash}"

    try:
        response = requests.get(url, headers=headers)
        data = response.json()

        if response.status_code == 200:
            stats = data["data"]["attributes"]["last_analysis_stats"]
            is_malicious = stats["malicious"] > 0
            return {
                "is_malicious": is_malicious,
                "detections": stats["malicious"],
                "total_engines": sum(stats.values()),
                "scan_results": data["data"]["attributes"]["last_analysis_results"],
            }
        elif response.status_code == 404:
            return {"error": "File not found in VirusTotal database."}
        else:
            return {"error": f"API Error: {response.status_code}"}
    except Exception as e:
        return {"error": f"Failed to scan: {str(e)}"}

if __name__ == "__main__":
    file_path = r"C:\Users\shemil\OneDrive\Desktop\eicar_test.pdf"
  # Replace with your file path
    result = check_file_malicious(file_path)
    # Rest of the code...
    
    if "error" in result:
        print(f"❌ Error: {result['error']}")
    else:
        if result["is_malicious"]:
            print(f"🚨 MALICIOUS! Detected by {result['detections']}/{result['total_engines']} engines.")
        else:
            print(f"✅ CLEAN! 0/{result['total_engines']} engines flagged this file.")