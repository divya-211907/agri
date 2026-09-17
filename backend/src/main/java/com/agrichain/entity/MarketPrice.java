package com.agrichain.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "market_prices")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class MarketPrice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String commodity;

    @Column(length = 100)
    private String variety;

    @Column(nullable = false, length = 100)
    private String market;

    @Column(nullable = false, length = 100)
    private String district;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(name = "minimum_price", nullable = false)
    private Double minimumPrice;

    @Column(name = "maximum_price", nullable = false)
    private Double maximumPrice;

    @Column(name = "modal_price", nullable = false)
    private Double modalPrice;

    @Column(name = "raw_modal_price")
    private Double rawModalPrice;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String unit = "₹/kg";

    @Column(name = "price_date", nullable = false)
    private LocalDate priceDate;

    @Column(nullable = false, length = 100)
    @Builder.Default
    private String source = "AGMARKNET / data.gov.in";

    @Column(name = "source_url", length = 255)
    @Builder.Default
    private String sourceUrl = "https://agmarknet.gov.in";

    @Column(name = "fetched_at", nullable = false)
    @Builder.Default
    private LocalDateTime fetchedAt = LocalDateTime.now();
}
