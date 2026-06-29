package com.agrichain.repository;

import com.agrichain.entity.DemandSupply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DemandSupplyRepository extends JpaRepository<DemandSupply, Long> {
    List<DemandSupply> findByCategoryId(Integer categoryId);
}
