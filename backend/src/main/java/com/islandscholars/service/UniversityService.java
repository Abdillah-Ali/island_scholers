package com.islandscholars.service;

import com.islandscholars.model.University;
import com.islandscholars.repository.UniversityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UniversityService {

    @Autowired
    private UniversityRepository universityRepository;

    public List<University> getAllUniversities() {
        return universityRepository.findAll();
    }

    public Optional<University> getUniversityById(Long id) {
        return universityRepository.findById(id);
    }

    public Optional<University> getUniversityByName(String name) {
        return universityRepository.findByName(name);
    }

    public University createUniversity(University university) {
        return universityRepository.save(university);
    }

    public University updateUniversity(Long id, University universityDetails) {
        University university = universityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("University not found"));

        university.setName(universityDetails.getName());
        university.setDescription(universityDetails.getDescription());
        university.setWebsite(universityDetails.getWebsite());
        university.setEstablishedYear(universityDetails.getEstablishedYear());
        university.setStudentCount(universityDetails.getStudentCount());
        university.setFacultyCount(universityDetails.getFacultyCount());
        university.setPrograms(universityDetails.getPrograms());

        return universityRepository.save(university);
    }

    public void deleteUniversity(Long id) {
        universityRepository.deleteById(id);
    }

    public List<University> searchUniversities(String name) {
        return universityRepository.findByNameContainingIgnoreCase(name);
    }
}