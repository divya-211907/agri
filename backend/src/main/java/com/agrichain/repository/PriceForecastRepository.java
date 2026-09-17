package com.agrichain.repository;

import com.agrichain.entity.PriceForecast;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PriceForecastRepository extends JpaRepository<PriceForecast, Long> {

    @Query("SELECT f FROM PriceForecast f WHERE LOWER(f.commodity) = LOWER(:commodity) AND LOWER(f.market) = LOWER(:market) ORDER BY f.forecastDate DESC LIMIT 1")
    Optional<PriceForecast> findLatestByCommodityAndMarket(@Param("commodity") String commodity, @Param("market") String market);

    @Query("SELECT f FROM PriceForecast f WHERE LOWER(f.commodity) = LOWER(:commodity) ORDER BY f.forecastDate DESC LIMIT 1")
    Optional<PriceForecast> findLatestByCommodity(@Param("commodity") String commodity);
}
