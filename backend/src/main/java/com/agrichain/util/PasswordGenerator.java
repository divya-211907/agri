package com.agrichain.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = "password";
        String storedHash = "$2a$10$8.eN4g1QGjT.X7L5k7kO2eRzE4G5P1rJ3bWJly6dM2bN5t85lFfWy";
        
        boolean matches = encoder.matches(password, storedHash);
        System.out.println("Stored Hash Matches: " + matches);
        
        String newHash = encoder.encode(password);
        System.out.println("New Generated Hash: " + newHash);
    }
}
