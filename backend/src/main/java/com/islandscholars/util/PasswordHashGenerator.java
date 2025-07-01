package com.islandscholars.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashGenerator {
    public static void main(String[] args) {
        // Create a BCrypt password encoder
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        // Raw password to hash
        String rawPassword = "8Characters**";

        // Generate hashed password
        String encodedPassword = encoder.encode(rawPassword);

        // Print the hashed password
        System.out.println("BCrypt hashed password:");
        System.out.println(encodedPassword);
    }
}
