package com.agrichain.service;

import com.agrichain.entity.MarketPrice;
import com.agrichain.entity.PriceForecast;
import com.agrichain.repository.MarketPriceRepository;
import com.agrichain.repository.PriceForecastRepository;
import com.agrichain.service.impl.MarketPriceServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import java.time.LocalDate;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MarketPriceServiceTest {

    @Mock
    private MarketPriceRepository marketPriceRepository;

    @Mock
    private PriceForecastRepository priceForecastRepository;

    private ProductNormalizer productNormalizer = new ProductNormalizer();

    private MarketPriceServiceImpl marketPriceService;

    private MarketPrice coimbatoreRecord;
    private MarketPrice erodeRecord;
    private MarketPrice indoreRecord;

    @BeforeEach
    public void setup() {
        marketPriceService = new MarketPriceServiceImpl();
        ReflectionTestUtils.setField(marketPriceService, "marketPriceRepository", marketPriceRepository);
        ReflectionTestUtils.setField(marketPriceService, "priceForecastRepository", priceForecastRepository);
        ReflectionTestUtils.setField(marketPriceService, "productNormalizer", productNormalizer);

        coimbatoreRecord = MarketPrice.builder()
                .id(1L)
                .commodity("Soybean")
                .variety("Other")
                .market("Coimbatore")
                .district("Coimbatore")
                .state("Tamil Nadu")
                .modalPrice(48.00)
                .minimumPrice(46.00)
                .maximumPrice(49.50)
                .priceDate(LocalDate.of(2026, 9, 15))
                .source("AGMARKNET / data.gov.in")
                .build();

        erodeRecord = MarketPrice.builder()
                .id(2L)
                .commodity("Soybean")
                .variety("Other")
                .market("Erode")
                .district("Erode")
                .state("Tamil Nadu")
                .modalPrice(47.50)
                .minimumPrice(45.00)
                .maximumPrice(49.00)
                .priceDate(LocalDate.of(2026, 9, 15))
                .source("AGMARKNET / data.gov.in")
                .build();

        indoreRecord = MarketPrice.builder()
                .id(3L)
                .commodity("Soybean")
                .variety("Yellow")
                .market("Indore")
                .district("Indore")
                .state("Madhya Pradesh")
                .modalPrice(46.50)
                .minimumPrice(44.00)
                .maximumPrice(48.50)
                .priceDate(LocalDate.of(2026, 9, 15))
                .source("AGMARKNET / data.gov.in")
                .build();
    }

    @Test
    public void testProductNormalization_Ambiguity() {
        ProductNormalizer.NormalizationResult res = productNormalizer.normalize("where to sell my soya");
        assertTrue(res.isAmbiguous(), "Generic 'soya' must be detected as ambiguous");
        assertTrue(res.getAmbiguousOptions().contains("Soybean"));
        assertTrue(res.getAmbiguousOptions().contains("Soymeal"));
    }

    @Test
    public void testProductNormalization_CanonicalMapping() {
        assertEquals("Soybean", productNormalizer.normalize("What is the price of soybean?").getCanonicalName());
        assertEquals("Soymeal", productNormalizer.normalize("today soymeal price").getCanonicalName());
        assertEquals("Groundnut Cake", productNormalizer.normalize("groundnut oil cake rate").getCanonicalName());
        assertEquals("Cottonseed Cake", productNormalizer.normalize("Show me cottonseed cake price").getCanonicalName());
        assertEquals("Groundnut Cake", productNormalizer.normalize("கடலை புண்ணாக்கு விலை").getCanonicalName());
    }

    @Test
    public void testStrictValidation() {
        assertTrue(marketPriceService.isValidRecord(coimbatoreRecord));

        MarketPrice invalidMissingSource = MarketPrice.builder()
                .commodity("Soybean")
                .market("Coimbatore")
                .priceDate(LocalDate.now())
                .modalPrice(45.00)
                .source(null) // missing source
                .build();
        assertFalse(marketPriceService.isValidRecord(invalidMissingSource));

        MarketPrice invalidMissingDate = MarketPrice.builder()
                .commodity("Soybean")
                .market("Coimbatore")
                .source("AGMARKNET")
                .modalPrice(45.00)
                .priceDate(null) // missing date
                .build();
        assertFalse(marketPriceService.isValidRecord(invalidMissingDate));

        MarketPrice invalidZeroPrice = MarketPrice.builder()
                .commodity("Soybean")
                .market("Coimbatore")
                .source("AGMARKNET")
                .priceDate(LocalDate.now())
                .modalPrice(0.0) // zero price
                .build();
        assertFalse(marketPriceService.isValidRecord(invalidZeroPrice));
    }

    @Test
    public void testLocationPriority_ExactDistrict() {
        when(marketPriceRepository.findLatestByCommodityAndDistrict("Soybean", "Coimbatore"))
                .thenReturn(Optional.of(coimbatoreRecord));

        MarketPriceService.MarketPriceResult result = marketPriceService.getLatestPrice("Soybean", "Coimbatore", "Tamil Nadu");

        assertTrue(result.found());
        assertEquals("EXACT_DISTRICT", result.locationMatchLevel());
        assertEquals("Coimbatore", result.priceRecord().getMarket());
        assertEquals(48.00, result.priceRecord().getModalPrice());
    }

    @Test
    public void testLocationPriority_StateFallbackWhenDistrictNotFound() {
        when(marketPriceRepository.findLatestByCommodityAndDistrict("Soybean", "Madurai"))
                .thenReturn(Optional.empty());
        when(marketPriceRepository.findLatestByCommodityAndState("Soybean", "Tamil Nadu"))
                .thenReturn(Optional.of(coimbatoreRecord));

        MarketPriceService.MarketPriceResult result = marketPriceService.getLatestPrice("Soybean", "Madurai", "Tamil Nadu");

        assertTrue(result.found());
        assertEquals("STATE_LEVEL", result.locationMatchLevel());
        assertEquals("Coimbatore", result.priceRecord().getMarket());
    }

    @Test
    public void testMultiMarketComparison() {
        when(marketPriceRepository.findByCommodityIgnoreCaseOrderByPriceDateDescModalPriceDesc("Soybean"))
                .thenReturn(Arrays.asList(coimbatoreRecord, erodeRecord, indoreRecord));

        MarketPriceService.MarketComparisonResult result = marketPriceService.compareMarkets("Soybean", "Tamil Nadu");

        assertTrue(result.found());
        assertEquals(3, result.markets().size());
        assertEquals(48.00, result.markets().get(0).getModalPrice());
        assertEquals("Coimbatore", result.markets().get(0).getMarket());
        assertNotNull(result.comparisonNote());
    }

    @Test
    public void testPriceTrendCalculation() {
        MarketPrice earlier = MarketPrice.builder()
                .commodity("Soymeal")
                .modalPrice(38.00)
                .priceDate(LocalDate.of(2026, 8, 15))
                .source("AGMARKNET")
                .build();

        MarketPrice current = MarketPrice.builder()
                .commodity("Soymeal")
                .modalPrice(40.80)
                .priceDate(LocalDate.of(2026, 9, 15))
                .source("AGMARKNET")
                .build();

        when(marketPriceRepository.findByCommodityIgnoreCaseOrderByPriceDateDescModalPriceDesc("Soymeal"))
                .thenReturn(Arrays.asList(current, earlier));

        Map<String, Object> trend = marketPriceService.calculatePriceTrend("Soymeal");

        assertTrue((Boolean) trend.get("hasTrendData"));
        assertEquals("Price trend", trend.get("trendLabel"));
        double pct = (Double) trend.get("priceChangePercent");
        assertTrue(pct > 7.0 && pct < 8.0); // (40.8 - 38.0)/38.0 = +7.37%
    }
}
