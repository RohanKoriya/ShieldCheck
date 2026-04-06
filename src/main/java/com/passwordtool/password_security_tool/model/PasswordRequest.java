package com.passwordtool.password_security_tool.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class PasswordRequest {

    @NotBlank(message = "Password must not be blank")
    @Size(min = 1, max = 128, message = "Password must be between 1 and 128 characters")
    private String password;

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}