package com.islandscholars.controller;

import com.islandscholars.model.University;
import com.islandscholars.service.UniversityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/universities")
public class UniversityController {

    @Autowired
    private UniversityService universityService;

    @GetMapping
    public ResponseEntity<List<University>> getAllUniversities(@RequestParam(required = false) String search) {
        List<University> universities;
        if (search != null && !search.isEmpty()) {
            universities = universityService.searchUniversities(search);
        } else {
            universities = universityService.getAllUniversities();
        }
        return ResponseEntity.ok(universities);
    }

    @GetMapping("/{id}")
    public ResponseEntity<University> getUniversityById(@PathVariable Long id) {
        return universityService.getUniversityById(id)
                .map(university -> ResponseEntity.ok().body(university))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/by-name/{name}")
    public ResponseEntity<University> getUniversityByName(@PathVariable String name) {
        return universityService.getUniversityByName(name)
                .map(university -> ResponseEntity.ok().body(university))
                .orElse(ResponseEntity.notFound().build());
    }
}