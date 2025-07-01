package com.islandscholars.service;

import com.islandscholars.model.Application;
import com.islandscholars.model.ApplicationStatus;
import com.islandscholars.model.Internship;
import com.islandscholars.model.User;
import com.islandscholars.repository.ApplicationRepository;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    public List<Application> getApplicationsByStudent(User student) {
        return applicationRepository.findByStudent(student);
    }

    public List<Application> getApplicationsByOrganization(User organization) {
        return applicationRepository.findByInternshipOrganization(organization);
    }

    public Optional<Application> getApplicationById(Long id) {
        return applicationRepository.findById(id);
    }

    public Application createApplication(Application application) {
        // Check if student already applied for this internship
        Optional<Application> existingApplication = applicationRepository
                .findByStudentAndInternship(application.getStudent(), application.getInternship());

        if (existingApplication.isPresent()) {
            throw new RuntimeException("You have already applied for this internship");
        }

        // Check if application deadline has passed
        if (application.getInternship().getApplicationDeadline().isBefore(java.time.LocalDate.now())) {
            throw new RuntimeException("Application deadline has passed");
        }

        OkHttpClient client = new OkHttpClient();

        MediaType mediaType = MediaType.parse("application/json");
        RequestBody body = RequestBody.create(mediaType, "{}");
        Request request = new Request.Builder()
                .url("http://localhost:3000/new-application")
                .post(body)
                .build();

        try {
            Response response = client.newCall(request).execute();
            System.out.println("Frontend call response: " + response.body().string());
        } catch (IOException e) {
            e.printStackTrace();
        }

        return applicationRepository.save(application);
    }

    public Application updateApplicationStatus(Long id, ApplicationStatus status, String reviewerNotes) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setStatus(status);
        application.setReviewerNotes(reviewerNotes);

        if (status == ApplicationStatus.ACCEPTED || status == ApplicationStatus.REJECTED) {
            application.setReviewedAt(LocalDateTime.now());
        }

        return applicationRepository.save(application);
    }

    public Application withdrawApplication(Long id, User student) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!application.getStudent().getId().equals(student.getId())) {
            throw new RuntimeException("You can only withdraw your own applications");
        }

        if (application.getStatus() != ApplicationStatus.PENDING &&
                application.getStatus() != ApplicationStatus.UNDER_REVIEW) {
            throw new RuntimeException("Cannot withdraw application with current status");
        }

        application.setStatus(ApplicationStatus.WITHDRAWN);
        return applicationRepository.save(application);
    }

    public void deleteApplication(Long id) {
        applicationRepository.deleteById(id);
    }
}
