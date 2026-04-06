package com.passwordtool.password_security_tool;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class PasswordSecurityToolApplication {

    public static void main(String[] args) {
        SpringApplication.run(PasswordSecurityToolApplication.class, args);
    }
}