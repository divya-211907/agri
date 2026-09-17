package com.agrichain.controller;

import com.agrichain.dto.OrderRequest;
import com.agrichain.entity.Order;
import com.agrichain.security.UserDetailsImpl;
import com.agrichain.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    @PreAuthorize("hasRole('BUYER') or hasRole('PROCESSOR') or hasRole('EXPORTER')")
    public ResponseEntity<Order> placeOrder(@RequestBody OrderRequest orderRequest) {
        org.springframework.security.core.Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserDetailsImpl)) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        Order order = orderService.placeOrder(userDetails.getId(), orderRequest);
        return ResponseEntity.ok(order);
    }

    @GetMapping
    public ResponseEntity<List<Order>> getOrders() {
        org.springframework.security.core.Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserDetailsImpl)) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        String role = userDetails.getAuthorities().iterator().next().getAuthority();

        if (role.equals("ROLE_ADMIN")) {
            return ResponseEntity.ok(orderService.getAllOrders());
        } else if (role.equals("ROLE_FARMER")) {
            return ResponseEntity.ok(orderService.getOrdersByFarmer(userDetails.getId()));
        } else {
            // Buyers, Processors, Exporters
            return ResponseEntity.ok(orderService.getOrdersByBuyer(userDetails.getId()));
        }
    }

    @GetMapping("/farmer")
    public ResponseEntity<List<Order>> getFarmerOrders() {
        org.springframework.security.core.Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserDetailsImpl)) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        return ResponseEntity.ok(orderService.getOrdersByFarmer(userDetails.getId()));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Order>> getMyOrders() {
        org.springframework.security.core.Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserDetailsImpl)) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        String role = userDetails.getAuthorities().iterator().next().getAuthority();
        if (role.equals("ROLE_FARMER")) {
            return ResponseEntity.ok(orderService.getOrdersByFarmer(userDetails.getId()));
        }
        return ResponseEntity.ok(orderService.getOrdersByBuyer(userDetails.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestParam("status") String status) {
        Order updatedOrder = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(updatedOrder);
    }
}
