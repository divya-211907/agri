package com.agrichain.service.impl;

import com.agrichain.dto.OrderItemRequest;
import com.agrichain.dto.OrderRequest;
import com.agrichain.entity.*;
import com.agrichain.exception.ResourceNotFoundException;
import com.agrichain.repository.*;
import com.agrichain.service.OrderService;
import com.agrichain.service.ledger.LedgerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private LedgerService ledgerService;

    @Override
    public Order placeOrder(Long buyerId, OrderRequest orderRequest) {
        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new ResourceNotFoundException("Buyer not found with id: " + buyerId));

        if (orderRequest.getItems() == null || orderRequest.getItems().isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one item.");
        }

        Order order = Order.builder()
                .buyer(buyer)
                .status("PENDING")
                .totalAmount(0.0)
                .items(new ArrayList<>())
                .build();

        double total = 0.0;
        List<OrderItem> items = new ArrayList<>();

        for (OrderItemRequest itemReq : orderRequest.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + itemReq.getProductId()));

            if (product.getStockKg() < itemReq.getQuantity()) {
                throw new IllegalArgumentException("Insufficient stock for product: " + product.getNameEn() +
                        ". Available: " + product.getStockKg() + " kg, Requested: " + itemReq.getQuantity() + " kg");
            }

            // Deduct stock
            product.setStockKg(product.getStockKg() - itemReq.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemReq.getQuantity())
                    .priceAtPurchase(product.getPricePerKg())
                    .build();

            items.add(orderItem);
            total += orderItem.getPriceAtPurchase() * orderItem.getQuantity();

            // Create notification for Farmer
            Notification farmerNotif = Notification.builder()
                    .user(product.getFarmer().getUser())
                    .messageEn("You received a new order for " + itemReq.getQuantity() + " kg of " + product.getNameEn() + ".")
                    .messageTa("உங்கள் " + product.getNameTa() + " பொருளுக்கு " + itemReq.getQuantity() + " கிலோ புதிய ஆர்டர் வந்துள்ளது.")
                    .isRead(false)
                    .build();
            notificationRepository.save(farmerNotif);
        }

        order.setItems(items);
        order.setTotalAmount(total);
        Order savedOrder = orderRepository.save(order);

        // Generate Transaction reference
        String txHash = UUID.randomUUID().toString().replace("-", "");
        Transaction transaction = Transaction.builder()
                .order(savedOrder)
                .amount(total)
                .paymentStatus("PENDING")
                .paymentMethod(orderRequest.getPaymentMethod() != null ? orderRequest.getPaymentMethod() : "CASH_ON_DELIVERY")
                .txHash(txHash)
                .build();
        transactionRepository.save(transaction);

        // Create notification for Buyer
        Notification buyerNotif = Notification.builder()
                .user(buyer)
                .messageEn("Order #" + savedOrder.getId() + " placed successfully. Total: ₹" + total)
                .messageTa("ஆர்டர் #" + savedOrder.getId() + " வெற்றிகரமாக பதிவு செய்யப்பட்டது. மொத்தம்: ₹" + total)
                .isRead(false)
                .build();
        notificationRepository.save(buyerNotif);

        // Log Audit
        AuditLog auditLog = AuditLog.builder()
                .user(buyer)
                .action("PLACE_ORDER")
                .details("Buyer placed order #" + savedOrder.getId() + " with total: ₹" + total)
                .build();
        auditLogRepository.save(auditLog);

        return savedOrder;
    }

    @Override
    public List<Order> getOrdersByBuyer(Long buyerId) {
        return orderRepository.findByBuyerId(buyerId);
    }

    @Override
    public List<Order> getOrdersByFarmer(Long farmerId) {
        return orderRepository.findOrdersForFarmer(farmerId);
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
    }

    @Override
    public Order updateOrderStatus(Long id, String status) {
        Order order = getOrderById(id);
        String oldStatus = order.getStatus();
        String newStatus = status.toUpperCase();

        if (oldStatus.equals(newStatus)) {
            return order;
        }

        order.setStatus(newStatus);
        order.setUpdatedAt(LocalDateTime.now());
        Order savedOrder = orderRepository.save(order);

        // Handle transaction status updates
        Transaction transaction = transactionRepository.findByOrderId(id).orElse(null);
        if (transaction != null) {
            if ("COMPLETED".equals(newStatus)) {
                transaction.setPaymentStatus("COMPLETED");
                transactionRepository.save(transaction);

                // Immutable ledger entries on completion
                ledgerService.recordTransaction(savedOrder);
            } else if ("CANCELLED".equals(newStatus)) {
                transaction.setPaymentStatus("FAILED");
                transactionRepository.save(transaction);

                // Restore product stocks
                for (OrderItem item : order.getItems()) {
                    Product product = item.getProduct();
                    product.setStockKg(product.getStockKg() + item.getQuantity());
                    productRepository.save(product);
                }
            }
        }

        // Notify Buyer
        Notification buyerNotif = Notification.builder()
                .user(order.getBuyer())
                .messageEn("Your order #" + order.getId() + " status is now: " + newStatus)
                .messageTa("உங்கள் ஆர்டர் #" + order.getId() + " நிலை தற்போது: " + translateStatus(newStatus))
                .isRead(false)
                .build();
        notificationRepository.save(buyerNotif);

        // Notify Farmers
        for (OrderItem item : order.getItems()) {
            Notification farmerNotif = Notification.builder()
                    .user(item.getProduct().getFarmer().getUser())
                    .messageEn("Order #" + order.getId() + " item " + item.getProduct().getNameEn() + " is now: " + newStatus)
                    .messageTa("ஆர்டர் #" + order.getId() + "-ன் பொருள் " + item.getProduct().getNameTa() + " தற்போது: " + translateStatus(newStatus))
                    .isRead(false)
                    .build();
            notificationRepository.save(farmerNotif);
        }

        // Log Audit
        AuditLog auditLog = AuditLog.builder()
                .action("UPDATE_ORDER_STATUS")
                .details("Order #" + order.getId() + " status updated from " + oldStatus + " to " + newStatus)
                .build();
        auditLogRepository.save(auditLog);

        return savedOrder;
    }

    private String translateStatus(String status) {
        switch (status) {
            case "PENDING": return "காத்திருக்கிறது";
            case "ACCEPTED": return "ஏற்கப்பட்டது";
            case "SHIPPED": return "அனுப்பப்பட்டது";
            case "COMPLETED": return "நிறைவடைந்தது";
            case "CANCELLED": return "ரத்து செய்யப்பட்டது";
            default: return status;
        }
    }
}
