package com.agrichain.service.ledger;

import com.agrichain.entity.BlockchainRecord;
import com.agrichain.repository.BlockchainRecordRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.LocalDateTime;
import java.util.Arrays;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class LedgerServiceTest {

    @Mock
    private BlockchainRecordRepository recordRepository;

    @InjectMocks
    private LedgerServiceImpl ledgerService;

    @Test
    public void testVerifyLedgerIntegrity_Compromised() {
        // Block 1
        BlockchainRecord block1 = BlockchainRecord.builder()
                .blockIndex(0L)
                .timestamp(LocalDateTime.of(2026, 6, 25, 12, 0))
                .dataPayload("Genesis Block")
                .previousHash("0000000000000000000000000000000000000000000000000000000000000000")
                .blockHash("hash_one")
                .build();

        // Block 2 (compromised previous hash link)
        BlockchainRecord block2 = BlockchainRecord.builder()
                .blockIndex(1L)
                .timestamp(LocalDateTime.of(2026, 6, 25, 12, 10))
                .dataPayload("Order #1 details")
                .previousHash("hash_manipulated") // should be "hash_one"
                .blockHash("hash_two")
                .build();

        when(recordRepository.findAllByOrderByBlockIndexAsc()).thenReturn(Arrays.asList(block1, block2));

        boolean isValid = ledgerService.verifyLedgerIntegrity();
        assertFalse(isValid, "The ledger should be detected as compromised due to broken link hash.");
        verify(recordRepository, times(1)).findAllByOrderByBlockIndexAsc();
    }
}
