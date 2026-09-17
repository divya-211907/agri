package com.agrichain.repository;

import com.agrichain.entity.MarketPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MarketPriceRepository extends JpaRepository<MarketPrice, Long> {

    List<MarketPrice> findByCommodityIgnoreCaseOrderByPriceDateDescModalPriceDesc(String commodity);

    List<MarketPrice> findByCommodityIgnoreCaseAndDistrictIgnoreCaseOrderByPriceDateDesc(String commodity, String district);

    List<MarketPrice> findByCommodityIgnoreCaseAndStateIgnoreCaseOrderByPriceDateDescModalPriceDesc(String commodity, String state);

    @Query("SELECT m FROM MarketPrice m WHERE LOWER(m.commodity) = LOWER(:commodity) AND LOWER(m.district) = LOWER(:district) ORDER BY m.priceDate DESC LIMIT 1")
    Optional<MarketPrice> findLatestByCommodityAndDistrict(@Param("commodity") String commodity, @Param("district") String district);

    @Query("SELECT m FROM MarketPrice m WHERE LOWER(m.commodity) = LOWER(:commodity) AND LOWER(m.state) = LOWER(:state) ORDER BY m.priceDate DESC, m.modalPrice DESC LIMIT 1")
    Optional<MarketPrice> findLatestByCommodityAndState(@Param("commodity") String commodity, @Param("state") String state);

    @Query("SELECT m FROM MarketPrice m WHERE LOWER(m.commodity) = LOWER(:commodity) ORDER BY m.priceDate DESC, m.modalPrice DESC LIMIT 1")
    Optional<MarketPrice> findLatestOverallByCommodity(@Param("commodity") String commodity);

    @Query("SELECT DISTINCT m.commodity FROM MarketPrice m ORDER BY m.commodity ASC")
    List<String> findDistinctCommodities();

    @Query("SELECT m FROM MarketPrice m WHERE LOWER(m.commodity) = LOWER(:commodity) ORDER BY m.priceDate ASC")
    List<MarketPrice> findHistoricalByCommodity(@Param("commodity") String commodity);
}
