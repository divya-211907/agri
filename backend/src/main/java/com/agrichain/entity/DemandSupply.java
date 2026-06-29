package com.agrichain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "demand_supply")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DemandSupply {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private ProductCategory category;

    @Column(nullable = false, length = 100)
    private String region;

    @Column(name = "region_ta", length = 100)
    private String regionTa;

    @Column(name = "demand_kg", nullable = false)
    @Builder.Default
    private Double demandKg = 0.0;

    @Column(name = "supply_kg", nullable = false)
    @Builder.Default
    private Double supplyKg = 0.0;

    @Column(name = "status_date", nullable = false)
    @Builder.Default
    private LocalDate statusDate = LocalDate.now();
}
