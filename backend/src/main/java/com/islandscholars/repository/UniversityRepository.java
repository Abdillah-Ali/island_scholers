package com.islandscholars.repository;

import com.islandscholars.model.University;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UniversityRepository extends JpaRepository<University, Long> {
    Optional<University> findByUserId(Long userId);
    Optional<University> findByName(String name);
    List<University> findByNameContainingIgnoreCase(String name);
}