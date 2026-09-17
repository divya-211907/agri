package com.agrichain.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "price_forecasts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class PriceForecast {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String commodity;

    @Column(nullable = false, length = 100)
    private String market;

    @Column(name = "forecast_date", nullable = false)
    private LocalDate forecastDate;

    @Column(name = "predicted_min_price", nullable = false)
    private Double predictedMinPrice;

    @Column(name = "predicted_max_price", nullable = false)
    private Double predictedMaxPrice;

    @Column(name = "model_name", nullable = false, length = 100)
    @Builder.Default
    private String modelName = "AgriChain Statistical Price Trend Engine";

    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
