package com.passwordtool.password_security_tool.controller;

import com.passwordtool.password_security_tool.model.PasswordRequest;
import com.passwordtool.password_security_tool.model.PasswordResponse;
import com.passwordtool.password_security_tool.service.PasswordService;
import com.passwordtool.password_security_tool.service.BreachService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/password")
@CrossOrigin(origins = "*") // Restrict to your frontend URL in production
public class PasswordController {

    @Autowired
    private PasswordService passwordService;

    @Autowired
    private BreachService breachService;

    @PostMapping("/check")
    public ResponseEntity<PasswordResponse> checkPassword(@Valid @RequestBody PasswordRequest request) {
        String password = request.getPassword();

        int score           = passwordService.calculateScore(password);
        String strength     = passwordService.getStrength(score);
        int entropy         = passwordService.calculateEntropy(password);
        String crackTime    = passwordService.estimateCrackTime(entropy);
        boolean breached    = breachService.isBreached(password);
        String report       = passwordService.generateReport(password, score, strength, entropy, crackTime, breached);

        PasswordResponse response = new PasswordResponse(score, strength, entropy, crackTime, breached, report);
        return ResponseEntity.ok(response);
    }
}