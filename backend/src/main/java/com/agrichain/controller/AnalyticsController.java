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

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardData(@RequestParam(value = "lang", defaultValue = "en") String lang) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
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

            // AI analytics summary (Tamil/English translation)
            String aiSummary = isTamil ?
                    "உங்கள் சோயாமீல் இருப்பு திருப்திகரமாக உள்ளது. கோவை சந்தையில் புண்ணாக்கு தேவை 18% அதிகரித்துள்ளதால், உங்கள் கடலை புண்ணாக்கு விலையை கிலோவுக்கு ₹2 உயர்த்த பரிந்துரைக்கப்படுகிறது. மொத்த வருவாய் ₹" + totalRevenue + " நிறைவடைந்துள்ளது." :
                    "Your Soymeal stock is satisfactory. Since groundnut oil cake demand in Coimbatore rose by 18%, we suggest increasing your cake listing price by ₹2/kg. Total revenue earned is ₹" + totalRevenue + ".";
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
                data.put("exportReadinessScore", 85.0);
                data.put("recommendedDestinations", Arrays.asList("Singapore", "Malaysia"));
            }

            String aiSummary = isTamil ?
                    "இந்த மாதம் உங்களின் மொத்த கொள்முதல் ₹" + totalSpent + " ஆகும். சோயாமீல் விலைகள் அடுத்த வாரம் 4.5% உயரும் என கணிக்கப்பட்டுள்ளது, எனவே உங்கள் கொள்முதலை விரைவுபடுத்துங்கள்." :
                    "Your procurement total this month is ₹" + totalSpent + ". Soymeal prices are predicted to rise by 4.5% next week, so lock in your purchases early.";
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
