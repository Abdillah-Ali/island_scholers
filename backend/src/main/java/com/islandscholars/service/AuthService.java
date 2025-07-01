package com.islandscholars.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.islandscholars.dto.auth.LoginRequest;
import com.islandscholars.dto.auth.SignupRequest;
import com.islandscholars.model.Industry;
import com.islandscholars.model.OrganizationProfile;
import com.islandscholars.model.Role;
import com.islandscholars.model.StudentProfile;
import com.islandscholars.model.University;
import com.islandscholars.model.User;
import com.islandscholars.repository.OrganizationProfileRepository;
import com.islandscholars.repository.StudentProfileRepository;
import com.islandscholars.repository.UniversityRepository;
import com.islandscholars.repository.UserRepository;
import com.islandscholars.security.services.UserDetailsImpl;

@Service
public class AuthService {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    StudentProfileRepository studentProfileRepository;

    @Autowired
    OrganizationProfileRepository organizationProfileRepository;

    @Autowired
    UniversityRepository universityRepository;

    @Autowired
    PasswordEncoder encoder;

    // Authenticate user by username/email and password, return user details only
    public UserDetailsImpl authenticateUser(LoginRequest loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsernameOrEmail())
                .orElse(userRepository.findByEmail(loginRequest.getUsernameOrEmail())
                        .orElseThrow(() -> new RuntimeException("User not found with username or email: " + loginRequest.getUsernameOrEmail())));

        if (!user.isActive()) {
            throw new RuntimeException("User account is deactivated");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        return (UserDetailsImpl) authentication.getPrincipal();
    }

    @Transactional
    public String registerUser(SignupRequest signUpRequest) {
        if (signUpRequest.getUsername() == null || signUpRequest.getUsername().trim().isEmpty()) {
            throw new RuntimeException("Username is required!");
        }

        if (signUpRequest.getEmail() == null || signUpRequest.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email is required!");
        }

        if (signUpRequest.getPassword() == null || signUpRequest.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Password is required!");
        }

        if (signUpRequest.getRole() == null) {
            throw new RuntimeException("Role is required!");
        }

        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new RuntimeException("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()),
                signUpRequest.getFirstName(),
                signUpRequest.getLastName(),
                signUpRequest.getRole());

        user.setPhoneNumber(signUpRequest.getPhoneNumber());
        user.setLocation(signUpRequest.getLocation());
        user.setBio(signUpRequest.getBio());

        user = userRepository.save(user);

        switch (signUpRequest.getRole()) {
            case STUDENT:
                createStudentProfile(user, signUpRequest);
                break;
            case ORGANIZATION:
                createOrganizationProfile(user, signUpRequest);
                break;
            case UNIVERSITY:
                createUniversityProfile(user, signUpRequest);
                break;
        }

        return "User registered successfully!";
    }

    private void createStudentProfile(User user, SignupRequest signUpRequest) {
        StudentProfile studentProfile = new StudentProfile();
        studentProfile.setUser(user);
        studentProfile.setStudentId(signUpRequest.getStudentId());
        studentProfile.setYearOfStudy(signUpRequest.getYearOfStudy());
        studentProfile.setFieldOfStudy(signUpRequest.getFieldOfStudy());
        studentProfile.setSkills(signUpRequest.getSkills());

        if (signUpRequest.getUniversity() != null && !signUpRequest.getUniversity().trim().isEmpty()) {
            University university = universityRepository.findByName(signUpRequest.getUniversity())
                    .orElse(null);
            studentProfile.setUniversity(university);
        }

        studentProfileRepository.save(studentProfile);
    }

    private void createOrganizationProfile(User user, SignupRequest signUpRequest) {
        OrganizationProfile orgProfile = new OrganizationProfile();
        orgProfile.setUser(user);
        orgProfile.setCompanyName(signUpRequest.getCompanyName());

        if (signUpRequest.getIndustry() != null && !signUpRequest.getIndustry().trim().isEmpty()) {
            try {
                orgProfile.setIndustry(Industry.valueOf(signUpRequest.getIndustry().toUpperCase()));
            } catch (IllegalArgumentException e) {
                orgProfile.setIndustry(Industry.OTHER);
            }
        }

        orgProfile.setCompanySize(signUpRequest.getCompanySize());
        orgProfile.setDescription(signUpRequest.getDescription());
        orgProfile.setWebsite(signUpRequest.getWebsite());
        orgProfile.setFoundedYear(signUpRequest.getFoundedYear());
        orgProfile.setRegistrationNumber(signUpRequest.getRegistrationNumber());
        orgProfile.setDesiredSkills(signUpRequest.getDesiredSkills());

        organizationProfileRepository.save(orgProfile);
    }

    private void createUniversityProfile(User user, SignupRequest signUpRequest) {
        University university = new University();
        university.setUser(user);
        university.setName(signUpRequest.getUniversityName());
        university.setDescription(signUpRequest.getDescription());
        university.setWebsite(signUpRequest.getWebsite());
        university.setEstablishedYear(signUpRequest.getEstablishedYear());
        university.setStudentCount(signUpRequest.getStudentCount());
        university.setFacultyCount(signUpRequest.getFacultyCount());
        university.setPrograms(signUpRequest.getPrograms());

        universityRepository.save(university);
    }

    @Transactional
    public void createAdminUser() {
        if (userRepository.findByUsername("Abdillah").isPresent()) {
            return;
        }

        User admin = new User();
        admin.setUsername("Abdillah");
        admin.setEmail("abdillah.va@gmail.com");
        admin.setPassword(encoder.encode("8Characters**"));
        admin.setFirstName("Abdillah");
        admin.setLastName("Ali");
        admin.setRole(Role.ADMIN);
        admin.setLocation("Tunguu Zanzibar");
        admin.setBio("System Administrator for Island Scholars platform");
        admin.setActive(true);
        admin.setVerified(true);

        userRepository.save(admin);
    }
}
