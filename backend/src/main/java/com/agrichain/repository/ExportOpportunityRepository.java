package com.agrichain.repository;

import com.agrichain.entity.ExportOpportunity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExportOpportunityRepository extends JpaRepository<ExportOpportunity, Long> {
    List<ExportOpportunity> findAllByOrderByDeadlineAsc();
}
