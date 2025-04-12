CREATE DATABASE IF NOT EXISTS complaints_db;
USE complaints_db;

-- users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role VARCHAR(50),
  student_id VARCHAR(50),
  department VARCHAR(50)
);

-- complaints table
CREATE TABLE complaints (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  complaint_text TEXT,
  pdf_file LONGBLOB, -- if storing PDF as binary
  FOREIGN KEY (user_id) REFERENCES users(id)
);
