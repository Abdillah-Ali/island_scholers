package com.islandscholars.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

@Entity
@Table(name = "organization_profiles")
public class OrganizationProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @NotBlank
    @Size(max = 200)
    private String companyName;

    @Enumerated(EnumType.STRING)
    private Industry industry;

    private String companySize;

    @Size(max = 1000)
    private String description;

    private String website;
    private Integer foundedYear;
    private String registrationNumber;

    @ElementCollection
    @CollectionTable(name = "organization_desired_skills", joinColumns = @JoinColumn(name = "organization_profile_id"))
    @Column(name = "skill")
    private List<String> desiredSkills;

    // Constructors
    public OrganizationProfile() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public Industry getIndustry() { return industry; }
    public void setIndustry(Industry industry) { this.industry = industry; }

    public String getCompanySize() { return companySize; }
    public void setCompanySize(String companySize) { this.companySize = companySize; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public Integer getFoundedYear() { return foundedYear; }
    public void setFoundedYear(Integer foundedYear) { this.foundedYear = foundedYear; }

    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }

    public List<String> getDesiredSkills() { return desiredSkills; }
    public void setDesiredSkills(List<String> desiredSkills) { this.desiredSkills = desiredSkills; }
}