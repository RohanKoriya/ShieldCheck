package com.passwordtool.password_security_tool.service;

import org.springframework.stereotype.Service;

@Service
public class PasswordService {

    /**
     * Calculates a password strength score (0-10) based on multiple factors:
     * length, uppercase, lowercase, digits, special characters.
     */
    public int calculateScore(String password) {
        int score = 0;

        // Length scoring
        if (password.length() >= 8)  score += 2;
        if (password.length() >= 12) score += 1;
        if (password.length() >= 16) score += 1;

        // Character variety scoring
        if (password.matches(".*[A-Z].*"))           score += 1; // uppercase
        if (password.matches(".*[a-z].*"))           score += 1; // lowercase
        if (password.matches(".*[0-9].*"))           score += 2; // digits
        if (password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{}|;:',.<>?/`~].*")) score += 2; // special

        return Math.min(score, 10);
    }

    /**
     * Returns a human-readable strength label based on the score.
     */
    public String getStrength(int score) {
        if (score <= 3)  return "Weak";
        if (score <= 5)  return "Fair";
        if (score <= 7)  return "Moderate";
        if (score <= 9)  return "Strong";
        return "Very Strong";
    }

    /**
     * Calculates entropy in bits based on actual character set used.
     * Entropy = length * log2(charsetSize)
     */
    public int calculateEntropy(String password) {
        int charsetSize = 0;
        if (password.matches(".*[a-z].*"))         charsetSize += 26;
        if (password.matches(".*[A-Z].*"))         charsetSize += 26;
        if (password.matches(".*[0-9].*"))         charsetSize += 10;
        if (password.matches(".*[^a-zA-Z0-9].*")) charsetSize += 32;

        if (charsetSize == 0) return 0;

        double entropy = password.length() * (Math.log(charsetSize) / Math.log(2));
        return (int) Math.floor(entropy);
    }

    /**
     * Estimates crack time (brute force at 1 billion guesses/second).
     * Returns a human-readable string.
     */
    public String estimateCrackTime(int entropyBits) {
        if (entropyBits <= 0) return "Instantly";

        double combinations     = Math.pow(2, entropyBits);
        double guessesPerSecond = 1_000_000_000.0;
        double seconds          = combinations / guessesPerSecond;

        if (seconds < 1)           return "Instantly";
        if (seconds < 60)          return String.format("%.0f seconds", seconds);
        if (seconds < 3600)        return String.format("%.0f minutes", seconds / 60);
        if (seconds < 86400)       return String.format("%.0f hours", seconds / 3600);
        if (seconds < 2592000)     return String.format("%.0f days", seconds / 86400);
        if (seconds < 31536000)    return String.format("%.0f months", seconds / 2592000);

        double years = seconds / 31536000;
        if (years < 1_000)         return String.format("%.0f years", years);
        if (years < 1_000_000)     return String.format("%.0fK years", years / 1_000);
        if (years < 1_000_000_000) return String.format("%.0fM years", years / 1_000_000);
        return "Billions of years";
    }

    /**
     * Generates a detailed security report.
     * NOTE: Raw password is NOT included in report output to prevent exposure.
     */
    public String generateReport(String password, int score, String strength,
                                 int entropy, String crackTime, boolean breached) {
        StringBuilder report = new StringBuilder();

        report.append("=== ShieldCheck Security Report ===\n\n");
        report.append("Strength Level : ").append(strength).append("\n");
        report.append("Score          : ").append(score).append(" / 10\n");
        report.append("Entropy        : ").append(entropy).append(" bits\n");
        report.append("Est. Crack Time: ").append(crackTime).append("\n");
        report.append("Breach Status  : ")
              .append(breached ? "FOUND IN BREACH DATABASE" : "Not found in breach database")
              .append("\n\n");

        report.append("--- Checklist ---\n");
        report.append(password.length() >= 8  ? "[PASS]" : "[FAIL]")
              .append(" Minimum 8 characters (length: ").append(password.length()).append(")\n");
        report.append(password.length() >= 12 ? "[PASS]" : "[FAIL]")
              .append(" Recommended 12+ characters\n");
        report.append(password.matches(".*[A-Z].*") ? "[PASS]" : "[FAIL]")
              .append(" Contains uppercase letters\n");
        report.append(password.matches(".*[a-z].*") ? "[PASS]" : "[FAIL]")
              .append(" Contains lowercase letters\n");
        report.append(password.matches(".*[0-9].*") ? "[PASS]" : "[FAIL]")
              .append(" Contains numbers\n");
        report.append(password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{}|;:',.<>?/`~].*")
              ? "[PASS]" : "[FAIL]").append(" Contains special characters\n\n");

        report.append("--- Recommendations ---\n");
        boolean allGood = true;
        if (password.length() < 12) {
            report.append("• Increase length to at least 12 characters\n"); allGood = false;
        }
        if (!password.matches(".*[A-Z].*")) {
            report.append("• Add uppercase letters (A-Z)\n"); allGood = false;
        }
        if (!password.matches(".*[0-9].*")) {
            report.append("• Add numbers (0-9)\n"); allGood = false;
        }
        if (!password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{}|;:',.<>?/`~].*")) {
            report.append("• Add special characters (!@#$%^&*)\n"); allGood = false;
        }
        if (breached) {
            report.append("• This password appeared in known data breaches — change it immediately\n");
            allGood = false;
        }
        if (allGood) {
            report.append("• Password meets all recommended security criteria.\n");
        }

        return report.toString();
    }
}