package com.islandscholars.repository;

import com.islandscholars.model.Application;
import com.islandscholars.model.ApplicationStatus;
import com.islandscholars.model.Internship;
import com.islandscholars.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudent(User student);
    List<Application> findByInternship(Internship internship);
    List<Application> findByInternshipOrganization(User organization);
    List<Application> findByStatus(ApplicationStatus status);
    Optional<Application> findByStudentAndInternship(User student, Internship internship);
    List<Application> findByStudentAndStatus(User student, ApplicationStatus status);
    List<Application> findByInternshipOrganizationAndStatus(User organization, ApplicationStatus status);
}