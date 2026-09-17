package com.agrichain.service;

import com.agrichain.entity.MarketPrice;
import com.agrichain.entity.PriceForecast;
import java.util.List;
import java.util.Map;

public interface MarketPriceService {

    /**
     * Retrieves the latest verified market price for a product, prioritized by user location.
     * Priority: 1. Same District, 2. Same State, 3. Other Indian Markets.
     */
    MarketPriceResult getLatestPrice(String productName, String district, String state);

    /**
     * Retrieves multiple markets for comparison, ordered by modal price descending.
     * Used for "Where to sell?" type inquiries.
     */
    MarketComparisonResult compareMarkets(String productName, String preferredState);

    /**
     * Generates or retrieves AI forecast for a commodity, clearly marked as an estimate.
     */
    PriceForecast getForecast(String commodity, String market);

    /**
     * Calculates authentic price trend from historical data (e.g. +8.57% Price Trend).
     */
    Map<String, Object> calculatePriceTrend(String commodity);

    /**
     * Retrieves full source audit & traceability metadata for an individual market price record.
     */
    Map<String, Object> getTraceabilityMetadata(Long priceId);

    /**
     * Strictly validates a market price record. Returns false if any mandatory field is missing.
     */
    boolean isValidRecord(MarketPrice record);

    /**
     * Returns historical prices for chart visualization.
     */
    List<Map<String, Object>> getHistoricalPrices(String commodity);

    // Data Transfer Objects
    record MarketPriceResult(
            boolean found,
            boolean ambiguous,
            List<String> ambiguousOptions,
            String clarificationPrompt,
            MarketPrice priceRecord,
            String locationMatchLevel, // "EXACT_DISTRICT", "STATE_LEVEL", "NATIONAL", or "NONE"
            String statusMessage,
            String alternativeReference
    ) {}

    record MarketComparisonResult(
            boolean found,
            boolean ambiguous,
            List<String> ambiguousOptions,
            String clarificationPrompt,
            String commodity,
            List<MarketPrice> markets,
            String comparisonNote
    ) {}
}
