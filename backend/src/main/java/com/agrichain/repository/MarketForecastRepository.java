package com.agrichain.repository;

import com.agrichain.entity.MarketForecast;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MarketForecastRepository extends JpaRepository<MarketForecast, Long> {
    List<MarketForecast> findByCategoryIdOrderByForecastDateAsc(Integer categoryId);
}
