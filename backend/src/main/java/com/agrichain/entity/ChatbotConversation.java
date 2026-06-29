package com.agrichain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chatbot_conversations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatbotConversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "message_en", columnDefinition = "TEXT")
    private String messageEn;

    @Column(name = "message_ta", columnDefinition = "TEXT")
    private String messageTa;

    @Column(name = "response_en", nullable = false, columnDefinition = "TEXT")
    private String responseEn;

    @Column(name = "response_ta", nullable = false, columnDefinition = "TEXT")
    private String responseTa;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
