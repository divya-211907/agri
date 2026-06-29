package com.agrichain.service.ledger;

import com.agrichain.entity.BlockchainRecord;
import com.agrichain.entity.Order;
import java.util.List;

public interface LedgerService {
    BlockchainRecord recordTransaction(Order order);
    List<BlockchainRecord> getLedger();
    boolean verifyLedgerIntegrity();
}
