package com.passwordtool.password_security_tool.service;

import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class BreachService {

    /**
     * Simulated local breach database (satisfies "simulated breach database" deliverable).
     * Contains commonly known weak/breached passwords.
     */
    private static final Set<String> KNOWN_BREACHED_PASSWORDS = Set.of(
        "password", "123456", "123456789", "qwerty", "abc123",
        "password1", "letmein", "admin", "welcome", "monkey",
        "dragon", "master", "sunshine", "princess", "football",
        "shadow", "superman", "batman", "trustno1", "iloveyou",
        "passw0rd", "hello123", "123qwe", "qwerty123", "admin123"
    );

    /**
     * Checks if the given password is in the simulated local breach database.
     * Case-insensitive comparison.
     *
     * NOTE: For real production breach checking, use the HIBP k-anonymity
     * API in the frontend (already implemented in script.js) to avoid
     * sending the plaintext password to any server.
     *
     * @param password The password to check
     * @return true if found in the breach database
     */
    public boolean isBreached(String password) {
        return KNOWN_BREACHED_PASSWORDS.contains(password.toLowerCase());
    }
}