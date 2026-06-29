package com.agrichain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "blockchain_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlockchainRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "block_index", nullable = false, unique = true)
    private Long blockIndex;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    @Column(name = "data_payload", nullable = false, columnDefinition = "TEXT")
    private String dataPayload;

    @Column(name = "previous_hash", nullable = false, length = 64)
    private String previousHash;

    @Column(name = "block_hash", nullable = false, unique = true, length = 64)
    private String blockHash;

    @Column(name = "validator_signature", length = 128)
    private String validatorSignature;
}
