package com.islandscholars.repository;

import com.islandscholars.model.StudentProfile;
import com.islandscholars.model.University;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {
    Optional<StudentProfile> findByUserId(Long userId);
    List<StudentProfile> findByUniversity(University university);
    List<StudentProfile> findByFieldOfStudy(String fieldOfStudy);
    List<StudentProfile> findByYearOfStudy(Integer yearOfStudy);
}