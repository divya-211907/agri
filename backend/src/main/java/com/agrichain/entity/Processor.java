package com.agrichain.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "processors")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Processor {
    @Id
    @Column(name = "user_id")
    private Long userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @Column(name = "facility_name", nullable = false, length = 100)
    private String facilityName;

    @Column(name = "tamil_facility_name", length = 100)
    private String tamilFacilityName;

    @Column(name = "capacity_tons_day", nullable = false)
    private Double capacityTonsDay;

    @Column(nullable = false, length = 100)
    private String location;

    @Column(name = "tamil_location", length = 100)
    private String tamilLocation;

    @Column(name = "contact_number", nullable = false, length = 20)
    private String contactNumber;
}
