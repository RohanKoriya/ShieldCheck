# ShieldCheck | Password Security Pro

A production-style password security analyzer built with:

- HTML5
- CSS3
- JavaScript (ES6+)
- Spring Boot (Optional)
- Have I Been Pwned API

ShieldCheck helps users analyze password strength, calculate entropy, estimate crack times, detect breached passwords, and generate highly secure passwords using modern security practices.

---

# Features

## Password Analysis

- Real-Time Password Strength Checker
- Dynamic Strength Meter
- Entropy Calculation
- Crack Time Estimation
- Security Suggestions

## Security Features

- SHA-1 Breach Detection
- Have I Been Pwned API Integration
- Secure Password Generation
- Password Audit Reports

## UI/UX

- Responsive Design
- Modern Glassmorphism UI
- Gradient Styling
- Smooth Animations
- Mobile Friendly Interface

---

# Tech Stack

## Frontend

- HTML5
- CSS3
- JavaScript (ES6+)
- Font Awesome

## Backend (Optional)

- Spring Boot
- Java 17+
- Maven

## APIs

- Have I Been Pwned Passwords API

---

# Folder Structure

```bash
password-security-tool
|
├── src
│
├── main
│   │
│   ├── java/com/passwordtool
│   │   │
│   │   ├── controller
│   │   │   └── PasswordController.java
│   │   │
│   │   ├── service
│   │   │   ├── PasswordService.java
│   │   │   └── BreachService.java
│   │   │
│   │   ├── model
│   │   │   ├── PasswordRequest.java
│   │   │   └── PasswordResponse.java
│   │   │
│   │   └── PasswordSecurityToolApplication.java
│   │
│   ├── resources
│   │   │
│   │   ├── static
│   │   │   ├── index.html
│   │   │   ├── style.css
│   │   │   └── script.js
│   │   │
│   │   ├── breached_passwords.txt
│   │   └── application.properties
│
├── pom.xml
│
└── README.md
```

---

# Installation

## 1. Clone Repository

```bash
git clone https://github.com/your-username/shieldcheck.git
```

---

## 2. Navigate To Project

```bash
cd shieldcheck
```

---

# Run Frontend

Simply open:

```bash
index.html
```

in any modern browser.

---

# Run Backend (Optional)

## Requirements

- Java 17+
- Maven

## Start Backend

```bash
mvn clean install

mvn spring-boot:run
```

---

# Usage

## Analyze Password

- Enter a password
- View strength analysis
- Check entropy
- Estimate crack time
- Detect breaches

---

## Generate Password

Click the Generate button to create a secure random password.

---

## Download Report

Generate and download a password audit report in `.txt` format.

---

# Audit Report Includes

- Timestamp
- Password Strength
- Entropy Score
- Crack Time Estimation
- Breach Detection Status
- Security Suggestions
- Detailed Audit Logs

---

# Future Improvements

- Dark Mode
- AI-Based Password Analysis
- PDF Report Export
- Multi-Language Support
- API Rate Limiting
- Advanced Security Analytics

---

# Contributing

## Steps

```bash
git checkout -b feature-name
```

```bash
git commit -m "Add feature"
```

```bash
git push origin feature-name
```

Then open a Pull Request.

---

# License

MIT License

---

# Author

Rohan Koriya

GitHub:
https://github.com/RohanKoriya
