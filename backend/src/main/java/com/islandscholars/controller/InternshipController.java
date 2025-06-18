package com.islandscholars.controller;

import com.islandscholars.model.Duration;
import com.islandscholars.model.Internship;
import com.islandscholars.model.Role;
import com.islandscholars.model.User;
import com.islandscholars.repository.UserRepository;
import com.islandscholars.security.services.UserDetailsImpl;
import com.islandscholars.service.InternshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/internships")
public class InternshipController {

    @Autowired
    private InternshipService internshipService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Internship>> getAllInternships(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Duration duration,
            @RequestParam(required = false) Boolean isRemote) {
        
        List<Internship> internships;
        if (title != null || location != null || duration != null || isRemote != null) {
            internships = internshipService.searchInternships(title, location, duration, isRemote);
        } else {
            internships = internshipService.getAllActiveInternships();
        }
        return ResponseEntity.ok(internships);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Internship> getInternshipById(@PathVariable Long id) {
        return internshipService.getInternshipById(id)
                .map(internship -> ResponseEntity.ok().body(internship))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ORGANIZATION')")
    public ResponseEntity<Internship> createInternship(@Valid @RequestBody Internship internship, 
                                                      Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User organization = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        internship.setOrganization(organization);
        Internship savedInternship = internshipService.createInternship(internship);
        return ResponseEntity.ok(savedInternship);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ORGANIZATION')")
    public ResponseEntity<Internship> updateInternship(@PathVariable Long id, 
                                                      @Valid @RequestBody Internship internshipDetails,
                                                      Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        // Verify that the internship belongs to the authenticated organization
        Internship existingInternship = internshipService.getInternshipById(id)
                .orElseThrow(() -> new RuntimeException("Internship not found"));
        
        if (!existingInternship.getOrganization().getId().equals(userDetails.getId())) {
            return ResponseEntity.forbiddenBuild();
        }
        
        Internship updatedInternship = internshipService.updateInternship(id, internshipDetails);
        return ResponseEntity.ok(updatedInternship);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ORGANIZATION')")
    public ResponseEntity<?> deleteInternship(@PathVariable Long id, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        // Verify that the internship belongs to the authenticated organization
        Internship existingInternship = internshipService.getInternshipById(id)
                .orElseThrow(() -> new RuntimeException("Internship not found"));
        
        if (!existingInternship.getOrganization().getId().equals(userDetails.getId())) {
            return ResponseEntity.forbiddenBuild();
        }
        
        internshipService.deleteInternship(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/my-internships")
    @PreAuthorize("hasRole('ORGANIZATION')")
    public ResponseEntity<List<Internship>> getMyInternships(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User organization = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Internship> internships = internshipService.getInternshipsByOrganization(organization);
        return ResponseEntity.ok(internships);
    }
}