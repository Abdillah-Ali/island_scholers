package com.islandscholars.service;

import com.islandscholars.dto.auth.JwtResponse;
import com.islandscholars.dto.auth.LoginRequest;
import com.islandscholars.dto.auth.SignupRequest;
import com.islandscholars.model.*;
import com.islandscholars.repository.*;
import com.islandscholars.security.jwt.JwtUtils;
import com.islandscholars.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Autowired
    JwtUtils jwtUtils;

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        // Try to find user by username or email
        User user = userRepository.findByUsername(loginRequest.getUsernameOrEmail())
                .orElse(userRepository.findByEmail(loginRequest.getUsernameOrEmail())
                        .orElseThrow(() -> new RuntimeException("User not found with username or email: " + loginRequest.getUsernameOrEmail())));

        // Check if user is active
        if (!user.isActive()) {
            throw new RuntimeException("User account is deactivated");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole());
    }

    @Transactional
    public String registerUser(SignupRequest signUpRequest) {
        // Validate required fields
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

        // Create new user's account
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

        // Create role-specific profile
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

        // Find university by name and associate it
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
        // Check if admin user already exists
        if (userRepository.findByUsername("Abdillah").isPresent()) {
            return; // Admin already exists
        }

        // Create admin user
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