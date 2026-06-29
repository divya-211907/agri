package com.agrichain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "export_opportunities")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExportOpportunity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title_en", nullable = false, length = 150)
    private String titleEn;

    @Column(name = "title_ta", nullable = false, length = 200)
    private String titleTa;

    @Column(name = "destination_country", nullable = false, length = 100)
    private String destinationCountry;

    @Column(name = "destination_country_ta", length = 100)
    private String destinationCountryTa;

    @Column(name = "quantity_required_kg", nullable = false)
    private Double quantityRequiredKg;

    @Column(name = "target_price_per_kg", nullable = false)
    private Double targetPricePerKg;

    @Column(nullable = false)
    private LocalDate deadline;

    @Column(name = "requirements_en", columnDefinition = "TEXT")
    private String requirementsEn;

    @Column(name = "requirements_ta", columnDefinition = "TEXT")
    private String requirementsTa;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
