package com.agrichain.service;

import com.agrichain.dto.OrderRequest;
import com.agrichain.entity.Order;
import java.util.List;

public interface OrderService {
    Order placeOrder(Long buyerId, OrderRequest orderRequest);
    List<Order> getOrdersByBuyer(Long buyerId);
    List<Order> getOrdersByFarmer(Long farmerId);
    List<Order> getAllOrders();
    Order getOrderById(Long id);
    Order updateOrderStatus(Long id, String status);
}
