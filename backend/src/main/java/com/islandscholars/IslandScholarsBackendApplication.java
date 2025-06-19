package com.islandscholars;

import com.islandscholars.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class IslandScholarsBackendApplication implements CommandLineRunner {

    @Autowired
    private AuthService authService;

    public static void main(String[] args) {
        SpringApplication.run(IslandScholarsBackendApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        // Create admin user on startup
        authService.createAdminUser();
    }
}
</invoke>