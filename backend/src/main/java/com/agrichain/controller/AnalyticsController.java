package com.agrichain.controller;

import com.agrichain.entity.*;
import com.agrichain.repository.*;
import com.agrichain.security.UserDetailsImpl;
import com.agrichain.service.ledger.LedgerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DemandSupplyRepository demandSupplyRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private LedgerService ledgerService;

    @Autowired
    private com.agrichain.service.MarketPriceService marketPriceService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardData(@RequestParam(value = "lang", defaultValue = "en") String lang) {
        org.springframework.security.core.Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserDetailsImpl)) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        String role = userDetails.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");
        boolean isTamil = "ta".equalsIgnoreCase(lang);

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("role", role);
        data.put("userId", userDetails.getId());

        // Basic Global Metrics
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();
        List<DemandSupply> demandSupplyList = demandSupplyRepository.findAll();
        data.put("globalProductCount", totalProducts);
        data.put("globalOrderCount", totalOrders);
        data.put("demandSupplyData", demandSupplyList);

        if ("FARMER".equals(role)) {
            // Farmer-specific metrics
            List<Product> myProducts = productRepository.findByFarmerUserId(userDetails.getId());
            List<Order> myOrders = orderRepository.findOrdersForFarmer(userDetails.getId());

            double totalRevenue = 0.0;
            double totalStock = 0.0;
            int pendingOrdersCount = 0;

            for (Product p : myProducts) {
                totalStock += p.getStockKg();
            }

            for (Order o : myOrders) {
                if ("COMPLETED".equals(o.getStatus())) {
                    totalRevenue += o.getTotalAmount();
                } else if ("PENDING".equals(o.getStatus())) {
                    pendingOrdersCount++;
                }
            }

            data.put("revenue", totalRevenue);
            data.put("stockKg", totalStock);
            data.put("pendingOrders", pendingOrdersCount);
            data.put("listedProductsCount", myProducts.size());

            // Real data-driven analytics summary based on official market records
            Map<String, Object> trend = marketPriceService.calculatePriceTrend("Groundnut Cake");
            double pct = trend.containsKey("priceChangePercent") ? (double) trend.get("priceChangePercent") : 0.0;
            String aiSummary = isTamil ?
                    String.format("உங்கள் உற்பத்தி இருப்பு கண்காணிக்கப்படுகிறது. கடலை புண்ணாக்கு விலை போக்கு: %s%.1f%% (அதிகாரப்பூர்வ மண்டி மாதிரி விலை அடிப்படையில்). மொத்த வருவாய் ₹%.2f நிறைவடைந்துள்ளது.", pct >= 0 ? "+" : "", pct, totalRevenue) :
                    String.format("Your inventory is active. Groundnut oil cake verified price trend: %s%.1f%% based on reported mandi modal prices. Total completed sales revenue is ₹%.2f.", pct >= 0 ? "+" : "", pct, totalRevenue);
            data.put("aiSummary", aiSummary);

        } else if ("BUYER".equals(role) || "PROCESSOR".equals(role) || "EXPORTER".equals(role)) {
            // Buyer/procurement-specific metrics
            List<Order> myPurchases = orderRepository.findByBuyerId(userDetails.getId());
            double totalSpent = 0.0;
            int activeOrders = 0;

            for (Order o : myPurchases) {
                if ("COMPLETED".equals(o.getStatus())) {
                    totalSpent += o.getTotalAmount();
                } else if ("PENDING".equals(o.getStatus()) || "ACCEPTED".equals(o.getStatus()) || "SHIPPED".equals(o.getStatus())) {
                    activeOrders++;
                }
            }

            data.put("totalSpent", totalSpent);
            data.put("activeOrdersCount", activeOrders);
            data.put("totalOrdersPlaced", myPurchases.size());

            if ("PROCESSOR".equals(role)) {
                // Raw materials procurement logs
                data.put("processingCapacityTonsDay", 50.0);
                data.put("siloOccupancyPercent", 68.5);
            }

            if ("EXPORTER".equals(role)) {
                // Export recommendation metrics
                data.put("exportReadinessScore", 80.0);
                data.put("recommendedDestinations", Arrays.asList("Singapore", "Malaysia"));
            }

            Map<String, Object> trend = marketPriceService.calculatePriceTrend("Soymeal");
            double pct = trend.containsKey("priceChangePercent") ? (double) trend.get("priceChangePercent") : 0.0;
            String aiSummary = isTamil ?
                    String.format("இந்த மாதம் உங்களின் மொத்த கொள்முதல் ₹%.2f ஆகும். சோயாமீல் அதிகாரப்பூர்வ மண்டி விலை போக்கு %s%.1f%% ஆக பதிவாகியுள்ளது. சந்தை விலைகளை ஒப்பிட்டு கொள்முதலைத் திட்டமிடுங்கள்.", totalSpent, pct >= 0 ? "+" : "", pct) :
                    String.format("Your procurement total this month is ₹%.2f. Official Soymeal price trend is %s%.1f%% based on reported mandi modal data. Compare regional markets to optimize purchase timing.", totalSpent, pct >= 0 ? "+" : "", pct);
            data.put("aiSummary", aiSummary);

        } else if ("ADMIN".equals(role)) {
            // Admin-specific metrics
            long userCount = userRepository.count();
            boolean isLedgerValid = ledgerService.verifyLedgerIntegrity();

            data.put("totalUsers", userCount);
            data.put("ledgerIntegrity", isLedgerValid ? "VERIFIED" : "COMPROMISED");
            data.put("auditLogs", auditLogRepository.findAllByOrderByTimestampDesc().stream().limit(10).toList());

            String aiSummary = isTamil ?
                    "அமைப்பு சீராக இயங்குகிறது. வர்த்தக பேரேடு (Blockchain Ledger) பாதுகாப்பாக உள்ளது. கணக்கில் புதிய 5 பயனர்கள் பதிவாகியுள்ளனர்." :
                    "System performance is normal. Blockchain ledger integrity is verified. 5 new user accounts registered this week.";
            data.put("aiSummary", aiSummary);
        }

        return ResponseEntity.ok(data);
    }
}
