package com.agrichain.controller;

import com.agrichain.entity.ExportOpportunity;
import com.agrichain.repository.ExportOpportunityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/export-opportunities")
public class ExportController {

    @Autowired
    private ExportOpportunityRepository exportRepository;

    @GetMapping
    public ResponseEntity<List<ExportOpportunity>> getOpportunities() {
        return ResponseEntity.ok(exportRepository.findAllByOrderByDeadlineAsc());
    }
}
