package com.agrichain.controller;

import com.agrichain.dto.JwtResponse;
import com.agrichain.dto.LoginRequest;
import com.agrichain.dto.MessageResponse;
import com.agrichain.dto.SignupRequest;
import com.agrichain.entity.*;
import com.agrichain.repository.*;
import com.agrichain.security.JwtUtils;
import com.agrichain.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private FarmerRepository farmerRepository;

    @Autowired
    private BuyerRepository buyerRepository;

    @Autowired
    private ProcessorRepository processorRepository;

    @Autowired
    private ExporterRepository exporterRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority().replace("ROLE_", ""))
                .collect(Collectors.toList());

        // Validate that user possesses the selected role
        String selectedRole = loginRequest.getRole().toUpperCase();
        if (!roles.contains(selectedRole)) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Access Denied: You do not have the role " + selectedRole));
        }

        // Retrieve profile details based on selected role
        Object profile = null;
        switch (ERole.valueOf(selectedRole)) {
            case FARMER:
                profile = farmerRepository.findById(userDetails.getId()).orElse(null);
                break;
            case BUYER:
                profile = buyerRepository.findById(userDetails.getId()).orElse(null);
                break;
            case PROCESSOR:
                profile = processorRepository.findById(userDetails.getId()).orElse(null);
                break;
            case EXPORTER:
                profile = exporterRepository.findById(userDetails.getId()).orElse(null);
                break;
            case ADMIN:
                profile = "ADMIN_METADATA";
                break;
        }

        return ResponseEntity.ok(JwtResponse.builder()
                .token(jwt)
                .id(userDetails.getId())
                .email(userDetails.getUsername())
                .roles(roles)
                .role(selectedRole)
                .profile(profile)
                .build());
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = User.builder()
                .email(signUpRequest.getEmail())
                .password(encoder.encode(signUpRequest.getPassword()))
                .active(true)
                .build();

        String strRole = signUpRequest.getRole().toUpperCase();
        Set<Role> roles = new HashSet<>();

        Role userRole = roleRepository.findByName(ERole.valueOf(strRole))
                .orElseThrow(() -> new RuntimeException("Error: Role " + strRole + " is not found."));
        roles.add(userRole);

        user.setRoles(roles);
        User savedUser = userRepository.save(user);

        // Populate and save profile based on role
        switch (ERole.valueOf(strRole)) {
            case FARMER:
                Farmer farmer = Farmer.builder()
                        .userId(savedUser.getId())
                        .user(savedUser)
                        .farmName(signUpRequest.getFarmName() != null ? signUpRequest.getFarmName() : "Farm_" + savedUser.getId())
                        .tamilFarmName(signUpRequest.getTamilFarmName() != null ? signUpRequest.getTamilFarmName() : "பண்ணை_" + savedUser.getId())
                        .location(signUpRequest.getLocation() != null ? signUpRequest.getLocation() : "Unknown")
                        .tamilLocation(signUpRequest.getTamilLocation() != null ? signUpRequest.getTamilLocation() : "தெரியவில்லை")
                        .state(signUpRequest.getState() != null ? signUpRequest.getState() : "Tamil Nadu")
                        .tamilState(signUpRequest.getTamilState() != null ? signUpRequest.getTamilState() : "தமிழ்நாடு")
                        .phone(signUpRequest.getPhone() != null ? signUpRequest.getPhone() : "")
                        .sizeAcres(signUpRequest.getSizeAcres() != null ? signUpRequest.getSizeAcres() : 0.0)
                        .bio(signUpRequest.getBio() != null ? signUpRequest.getBio() : "")
                        .tamilBio(signUpRequest.getTamilBio() != null ? signUpRequest.getTamilBio() : "")
                        .build();
                farmerRepository.save(farmer);
                break;

            case BUYER:
                Buyer buyer = Buyer.builder()
                        .userId(savedUser.getId())
                        .user(savedUser)
                        .companyName(signUpRequest.getCompanyName() != null ? signUpRequest.getCompanyName() : "Company_" + savedUser.getId())
                        .tamilCompanyName(signUpRequest.getTamilCompanyName() != null ? signUpRequest.getTamilCompanyName() : "நிறுவனம்_" + savedUser.getId())
                        .location(signUpRequest.getLocation() != null ? signUpRequest.getLocation() : "Unknown")
                        .tamilLocation(signUpRequest.getTamilLocation() != null ? signUpRequest.getTamilLocation() : "தெரியவில்லை")
                        .contactNumber(signUpRequest.getPhone() != null ? signUpRequest.getPhone() : "")
                        .taxId(signUpRequest.getTaxId() != null ? signUpRequest.getTaxId() : "")
                        .build();
                buyerRepository.save(buyer);
                break;

            case PROCESSOR:
                Processor processor = Processor.builder()
                        .userId(savedUser.getId())
                        .user(savedUser)
                        .facilityName(signUpRequest.getFacilityName() != null ? signUpRequest.getFacilityName() : "Facility_" + savedUser.getId())
                        .tamilFacilityName(signUpRequest.getTamilFacilityName() != null ? signUpRequest.getTamilFacilityName() : "ஆலை_" + savedUser.getId())
                        .capacityTonsDay(signUpRequest.getCapacityTonsDay() != null ? signUpRequest.getCapacityTonsDay() : 0.0)
                        .location(signUpRequest.getLocation() != null ? signUpRequest.getLocation() : "Unknown")
                        .tamilLocation(signUpRequest.getTamilLocation() != null ? signUpRequest.getTamilLocation() : "தெரியவில்லை")
                        .contactNumber(signUpRequest.getPhone() != null ? signUpRequest.getPhone() : "")
                        .build();
                processorRepository.save(processor);
                break;

            case EXPORTER:
                Exporter exporter = Exporter.builder()
                        .userId(savedUser.getId())
                        .user(savedUser)
                        .licenseNumber(signUpRequest.getLicenseNumber() != null ? signUpRequest.getLicenseNumber() : "LIC-" + System.currentTimeMillis())
                        .exportDestinations(signUpRequest.getExportDestinations() != null ? signUpRequest.getExportDestinations() : "")
                        .tamilExportDestinations(signUpRequest.getTamilExportDestinations() != null ? signUpRequest.getTamilExportDestinations() : "")
                        .contactNumber(signUpRequest.getPhone() != null ? signUpRequest.getPhone() : "")
                        .build();
                exporterRepository.save(exporter);
                break;

            case ADMIN:
                // No profile details required
                break;
        }

        // Generate Welcome Notifications (Bilingual)
        Notification notification = Notification.builder()
                .user(savedUser)
                .messageEn("Welcome to AgriChain AI! Your account has been registered successfully.")
                .messageTa("அக்ரிசெயின் AI-க்கு உங்களை வரவேற்கிறோம்! உங்கள் கணக்கு வெற்றிகரமாக பதிவு செய்யப்பட்டுள்ளது.")
                .isRead(false)
                .build();
        notificationRepository.save(notification);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}
