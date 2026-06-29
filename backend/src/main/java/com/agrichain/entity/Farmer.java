package com.agrichain.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "farmers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Farmer {
    @Id
    @Column(name = "user_id")
    private Long userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @Column(name = "farm_name", nullable = false, length = 100)
    private String farmName;

    @Column(name = "tamil_farm_name", length = 100)
    private String tamilFarmName;

    @Column(nullable = false, length = 100)
    private String location;

    @Column(name = "tamil_location", length = 100)
    private String tamilLocation;

    @Column(nullable = false, length = 50)
    private String state;

    @Column(name = "tamil_state", length = 50)
    private String tamilState;

    @Column(nullable = false, length = 20)
    private String phone;

    @Column(name = "size_acres")
    private Double sizeAcres;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "tamil_bio", columnDefinition = "TEXT")
    private String tamilBio;
}
