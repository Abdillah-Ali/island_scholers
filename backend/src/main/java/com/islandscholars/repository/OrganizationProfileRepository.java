package com.islandscholars.repository;

import com.islandscholars.model.Industry;
import com.islandscholars.model.OrganizationProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrganizationProfileRepository extends JpaRepository<OrganizationProfile, Long> {
    Optional<OrganizationProfile> findByUserId(Long userId);
    List<OrganizationProfile> findByIndustry(Industry industry);
    List<OrganizationProfile> findByCompanyNameContainingIgnoreCase(String companyName);
}