package com.agrichain.dto;

import lombok.Data;

@Data
public class OrderItemRequest {
    private Long productId;
    private Double quantity;
}
