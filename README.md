ShieldCheck | Password Security Pro

ShieldCheck is a modern, professional, and enterprise-grade password security analyzer. It allows users to evaluate password strength, calculate entropy, estimate crack times, detect breaches using SHA-1 hashed passwords, and generate secure passwords. Built with HTML, CSS, JavaScript, and optionally backed by Spring Boot for API support, ShieldCheck is designed for both personal and professional use.

🔹 Features

Password Strength Analysis
Real-time evaluation of password strength with visual feedback and a dynamic strength bar.

Entropy Calculation
Calculates password entropy in bits, giving a measure of unpredictability.

Crack Time Estimation
Shows estimated time to crack the password using brute-force methods.

Breach Detection
Checks the password against Have I Been Pwned (SHA-1) database for known leaks.

Password Generator
Generates strong, secure passwords with a single click.

Security Suggestions
Provides recommendations like length, uppercase, numbers, and symbols.

Audit Report
Generates a detailed, downloadable report for each password assessment.

Professional UI/UX
Modern, gradient-based UI with animations, icons, and responsive design.

🔹 Tech Stack

Frontend: HTML5, CSS3 (with modern gradients and glassmorphism), JavaScript ES6+, Font Awesome for icons

Backend (Optional): Spring Boot (for advanced API handling, logging, and secure endpoints)

External APIs: Have I Been Pwned Pwned Passwords API (SHA-1 breach detection)

🔹 Installation & Setup

1. Clone the Repository
   git clone https://github.com/your-username/shieldcheck.git
   cd shieldcheck
2. Open Locally

Simply open index.html in any modern browser.

No backend required for local usage.

3. Optional: Spring Boot Backend

If you want to integrate with a backend for logging or advanced features:

Open the project in IntelliJ IDEA / Eclipse.

Make sure Java 17+ and Maven are installed.

Run:

mvn clean install
mvn spring-boot:run

Update script.js to fetch your Spring Boot API endpoints for password checking.

🔹 Usage

Enter a Password
Type a password into the input field. Strength, entropy, and crack time are calculated in real-time.

Generate a Password
Click the “Generate” button to create a strong, random password.

Analyze Password
Press the “Analyze” button to:

Display a visual strength bar

Show breach status

List security suggestions

Generate a detailed audit report

Download Audit Report
Click the download button in the report section to save the report as a .txt file.

Copy Password
Click the copy icon to copy the password to the clipboard.

🔹 Detailed Audit Report Includes

Timestamp of analysis

Password (optional)

Strength level (Critical / Moderate / Secure)

Entropy (bits)

Estimated crack time

Breach detection result

Security suggestions

Detailed audit log

This helps users understand vulnerabilities and improve password hygiene.

🔹 Folder Structure
password-security-tool
│
├── src
│
│ ├── main
│ │
│ │ ├── java/com/passwordtool
│ │ │
│ │ │ ├── controller
│ │ │ │ PasswordController.java
│ │ │ │
│ │ │ ├── service
│ │ │ │ PasswordService.java
│ │ │ │ BreachService.java
│ │ │ │
│ │ │ ├── model
│ │ │ │ PasswordRequest.java
│ │ │ │ PasswordResponse.java
│ │ │ │
│ │ │ └── PasswordSecurityToolApplication.java
│ │
│ │ ├── resources
│ │ │
│ │ │ ├── static
│ │ │ │ index.html
│ │ │ │ style.css
│ │ │ │ script.js
│ │ │ │
│ │ │ ├── breached_passwords.txt
│ │ │ └── application.properties
│
└── pom.xml
└── README.md # Documentation

🔹 Contributing

Fork the repository

Create a feature branch: git checkout -b feature-name

Commit changes: git commit -m "Add feature"

Push branch: git push origin feature-name

Open a pull request

🔹 Future Enhancements

Multi-language support

Advanced password analysis using AI-based heuristics

Dark mode toggle

API rate-limiting handling and caching

Export reports as PDF

🔹 License

MIT License © 2026
See LICENSE
for details.

🔹 Contact

Developer: Rohan Koriya
GitHub: https://github.com/RohanKoriya
