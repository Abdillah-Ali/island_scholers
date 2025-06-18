package com.islandscholars.repository;

import com.islandscholars.model.Duration;
import com.islandscholars.model.Internship;
import com.islandscholars.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface InternshipRepository extends JpaRepository<Internship, Long> {
    List<Internship> findByOrganization(User organization);
    List<Internship> findByIsActiveTrue();
    List<Internship> findByIsActiveTrueAndApplicationDeadlineAfter(LocalDate date);
    List<Internship> findByLocationContainingIgnoreCase(String location);
    List<Internship> findByDuration(Duration duration);
    List<Internship> findByIsRemote(boolean isRemote);
    
    @Query("SELECT i FROM Internship i WHERE i.isActive = true AND " +
           "(:title IS NULL OR LOWER(i.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
           "(:location IS NULL OR LOWER(i.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:duration IS NULL OR i.duration = :duration) AND " +
           "(:isRemote IS NULL OR i.isRemote = :isRemote)")
    List<Internship> findInternshipsWithFilters(@Param("title") String title,
                                               @Param("location") String location,
                                               @Param("duration") Duration duration,
                                               @Param("isRemote") Boolean isRemote);
}