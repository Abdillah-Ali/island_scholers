package com.islandscholars.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.islandscholars.model.Application;
import com.islandscholars.model.ApplicationStatus;
import com.islandscholars.model.User;
import com.islandscholars.repository.InternshipRepository;
import com.islandscholars.repository.UserRepository;
import com.islandscholars.security.services.UserDetailsImpl;
import com.islandscholars.service.ApplicationService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InternshipRepository internshipRepository;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Application> createApplication(@Valid @RequestBody Application application,
                                                         Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User student = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        application.setStudent(student);
        Application savedApplication = applicationService.createApplication(application);
        return ResponseEntity.ok(savedApplication);
    }

    @GetMapping("/my-applications")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Application>> getMyApplications(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User student = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Application> applications = applicationService.getApplicationsByStudent(student);
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/received")
    @PreAuthorize("hasRole('ORGANIZATION')")
    public ResponseEntity<List<Application>> getReceivedApplications(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User organization = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Application> applications = applicationService.getApplicationsByOrganization(organization);
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ORGANIZATION')")
    public ResponseEntity<?> getApplicationById(@PathVariable Long id, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return applicationService.getApplicationById(id)
                .map(application -> {
                    boolean isStudent = application.getStudent().getId().equals(userDetails.getId());
                    boolean isOrganization = application.getInternship().getOrganization().getId().equals(userDetails.getId());

                    if (isStudent || isOrganization) {
                        return ResponseEntity.ok().body(application);
                    } else {
                        return new ResponseEntity<>("You are not authorized to view this application.", HttpStatus.FORBIDDEN);
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ORGANIZATION')")
    public ResponseEntity<Application> updateApplicationStatus(@PathVariable Long id,
                                                                @RequestBody Map<String, Object> statusUpdate,
                                                                Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        Application application = applicationService.getApplicationById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        // Verify that the application belongs to the authenticated organization
        if (!application.getInternship().getOrganization().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        ApplicationStatus status = ApplicationStatus.valueOf((String) statusUpdate.get("status"));
        String reviewerNotes = (String) statusUpdate.get("reviewerNotes");

        Application updatedApplication = applicationService.updateApplicationStatus(id, status, reviewerNotes);
        return ResponseEntity.ok(updatedApplication);
    }

    @PutMapping("/{id}/withdraw")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Application> withdrawApplication(@PathVariable Long id, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User student = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Application withdrawnApplication = applicationService.withdrawApplication(id, student);
        return ResponseEntity.ok(withdrawnApplication);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ORGANIZATION')")
    public ResponseEntity<?> deleteApplication(@PathVariable Long id, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        Application application = applicationService.getApplicationById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        // Check if user has permission to delete this application
        boolean isStudent = application.getStudent().getId().equals(userDetails.getId());
        boolean isOrganization = application.getInternship().getOrganization().getId().equals(userDetails.getId());

        if (!isStudent && !isOrganization) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        applicationService.deleteApplication(id);
        return ResponseEntity.ok().build();
    }
}
