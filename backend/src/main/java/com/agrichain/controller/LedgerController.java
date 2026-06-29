package com.agrichain.controller;

import com.agrichain.entity.BlockchainRecord;
import com.agrichain.service.ledger.LedgerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/ledger")
public class LedgerController {

    @Autowired
    private LedgerService ledgerService;

    @GetMapping
    public ResponseEntity<List<BlockchainRecord>> getLedger() {
        return ResponseEntity.ok(ledgerService.getLedger());
    }

    @GetMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyLedger() {
        boolean isValid = ledgerService.verifyLedgerIntegrity();
        Map<String, Object> response = new HashMap<>();
        response.put("valid", isValid);
        response.put("status", isValid ? "INTEGRITY_SECURED" : "INTEGRITY_COMPROMISED");
        response.put("message", isValid ? 
                "All transaction blocks are structurally validated and linked." :
                "Warning: Ledger has detected data manipulation or chain-link breaks!");
        return ResponseEntity.ok(response);
    }
}
