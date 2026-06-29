package com.agrichain.repository;

import com.agrichain.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByBuyerId(Long buyerId);

    @Query("SELECT DISTINCT o FROM Order o JOIN o.items i WHERE i.product.farmer.userId = :farmerId")
    List<Order> findOrdersForFarmer(@Param("farmerId") Long farmerId);
}
