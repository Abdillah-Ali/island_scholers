package com.islandscholars.controller;

import com.islandscholars.model.Industry;
import com.islandscholars.model.OrganizationProfile;
import com.islandscholars.repository.OrganizationProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/organizations")
public class OrganizationController {

    @Autowired
    private OrganizationProfileRepository organizationProfileRepository;

    @GetMapping
    public ResponseEntity<List<OrganizationProfile>> getAllOrganizations(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Industry industry) {
        
        List<OrganizationProfile> organizations;
        
        if (search != null && !search.isEmpty()) {
            organizations = organizationProfileRepository.findByCompanyNameContainingIgnoreCase(search);
        } else if (industry != null) {
            organizations = organizationProfileRepository.findByIndustry(industry);
        } else {
            organizations = organizationProfileRepository.findAll();
        }
        
        return ResponseEntity.ok(organizations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrganizationProfile> getOrganizationById(@PathVariable Long id) {
        return organizationProfileRepository.findById(id)
                .map(organization -> ResponseEntity.ok().body(organization))
                .orElse(ResponseEntity.notFound().build());
    }
}