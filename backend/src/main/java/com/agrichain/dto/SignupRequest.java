package com.agrichain.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignupRequest {
    @NotBlank
    @Size(max = 100)
    @Email
    private String email;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;

    @NotBlank
    private String role; // ADMIN, FARMER, BUYER, PROCESSOR, EXPORTER

    // Farmer Profile Fields
    private String farmName;
    private String tamilFarmName;
    private Double sizeAcres;
    private String bio;
    private String tamilBio;

    // Buyer Profile Fields
    private String companyName;
    private String tamilCompanyName;
    private String taxId;

    // Processor Profile Fields
    private String facilityName;
    private String tamilFacilityName;
    private Double capacityTonsDay;

    // Exporter Profile Fields
    private String licenseNumber;
    private String exportDestinations;
    private String tamilExportDestinations;

    // Common Profile Fields
    private String location;
    private String tamilLocation;
    private String state;
    private String tamilState;
    private String phone; // Also maps to contactNumber
}
