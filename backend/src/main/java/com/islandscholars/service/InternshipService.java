package com.islandscholars.service;

import com.islandscholars.model.Duration;
import com.islandscholars.model.Internship;
import com.islandscholars.model.User;
import com.islandscholars.repository.InternshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class InternshipService {

    @Autowired
    private InternshipRepository internshipRepository;

    public List<Internship> getAllActiveInternships() {
        return internshipRepository.findByIsActiveTrueAndApplicationDeadlineAfter(LocalDate.now());
    }

    public List<Internship> getInternshipsByOrganization(User organization) {
        return internshipRepository.findByOrganization(organization);
    }

    public Optional<Internship> getInternshipById(Long id) {
        return internshipRepository.findById(id);
    }

    public Internship createInternship(Internship internship) {
        return internshipRepository.save(internship);
    }

    public Internship updateInternship(Long id, Internship internshipDetails) {
        Internship internship = internshipRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Internship not found"));

        internship.setTitle(internshipDetails.getTitle());
        internship.setDescription(internshipDetails.getDescription());
        internship.setRequirements(internshipDetails.getRequirements());
        internship.setDuration(internshipDetails.getDuration());
        internship.setLocation(internshipDetails.getLocation());
        internship.setRemote(internshipDetails.isRemote());
        internship.setStipendAmount(internshipDetails.getStipendAmount());
        internship.setSkillsRequired(internshipDetails.getSkillsRequired());
        internship.setApplicationDeadline(internshipDetails.getApplicationDeadline());
        internship.setStartDate(internshipDetails.getStartDate());
        internship.setEndDate(internshipDetails.getEndDate());
        internship.setMaxApplicants(internshipDetails.getMaxApplicants());
        internship.setActive(internshipDetails.isActive());

        return internshipRepository.save(internship);
    }

    public void deleteInternship(Long id) {
        internshipRepository.deleteById(id);
    }

    public List<Internship> searchInternships(String title, String location, Duration duration, Boolean isRemote) {
        return internshipRepository.findInternshipsWithFilters(title, location, duration, isRemote);
    }
}