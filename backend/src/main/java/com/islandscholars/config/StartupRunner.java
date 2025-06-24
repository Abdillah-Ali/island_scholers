package com.islandscholars.config;

import com.islandscholars.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class StartupRunner implements CommandLineRunner {

    @Autowired
    private AuthService authService;

    @Override
    public void run(String... args) throws Exception {
        authService.createAdminUser();
        System.out.println("Checked and created admin user if not existing.");
    }
}
