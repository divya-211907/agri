package com.agrichain.repository;

import com.agrichain.entity.Exporter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExporterRepository extends JpaRepository<Exporter, Long> {
}
