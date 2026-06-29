package com.agrichain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "market_forecasts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MarketForecast {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private ProductCategory category;

    @Column(name = "forecast_date", nullable = false)
    private LocalDate forecastDate;

    @Column(name = "predicted_demand_kg", nullable = false)
    private Double predictedDemandKg;

    @Column(name = "predicted_supply_kg", nullable = false)
    private Double predictedSupplyKg;

    @Column(name = "confidence_score", nullable = false)
    private Double confidenceScore;

    @Column(name = "insights_en", columnDefinition = "TEXT")
    private String insightsEn;

    @Column(name = "insights_ta", columnDefinition = "TEXT")
    private String insightsTa;
}
