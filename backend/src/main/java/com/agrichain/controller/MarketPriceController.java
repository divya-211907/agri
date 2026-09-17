package com.agrichain.controller;

import com.agrichain.entity.PriceForecast;
import com.agrichain.service.MarketPriceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/market-prices")
public class MarketPriceController {

    @Autowired
    private MarketPriceService marketPriceService;

    @GetMapping("/latest")
    public ResponseEntity<MarketPriceService.MarketPriceResult> getLatestPrice(
            @RequestParam("product") String product,
            @RequestParam(value = "district", required = false) String district,
            @RequestParam(value = "state", defaultValue = "Tamil Nadu") String state) {
        return ResponseEntity.ok(marketPriceService.getLatestPrice(product, district, state));
    }

    @GetMapping("/compare")
    public ResponseEntity<MarketPriceService.MarketComparisonResult> compareMarkets(
            @RequestParam("product") String product,
            @RequestParam(value = "state", defaultValue = "Tamil Nadu") String state) {
        return ResponseEntity.ok(marketPriceService.compareMarkets(product, state));
    }

    @GetMapping("/trace/{priceId}")
    public ResponseEntity<Map<String, Object>> getTraceability(@PathVariable Long priceId) {
        return ResponseEntity.ok(marketPriceService.getTraceabilityMetadata(priceId));
    }

    @GetMapping("/forecast")
    public ResponseEntity<PriceForecast> getForecast(
            @RequestParam("product") String product,
            @RequestParam(value = "market", required = false) String market) {
        return ResponseEntity.ok(marketPriceService.getForecast(product, market));
    }

    @GetMapping("/trend")
    public ResponseEntity<Map<String, Object>> getTrend(@RequestParam("product") String product) {
        return ResponseEntity.ok(marketPriceService.calculatePriceTrend(product));
    }

    @GetMapping("/history")
    public ResponseEntity<List<Map<String, Object>>> getHistory(@RequestParam(value = "product", defaultValue = "Soymeal") String product) {
        return ResponseEntity.ok(marketPriceService.getHistoricalPrices(product));
    }
}
