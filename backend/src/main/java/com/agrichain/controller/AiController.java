package com.agrichain.controller;

import com.agrichain.entity.ChatbotConversation;
import com.agrichain.entity.User;
import com.agrichain.repository.ChatbotConversationRepository;
import com.agrichain.repository.UserRepository;
import com.agrichain.security.UserDetailsImpl;
import com.agrichain.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private AiService aiService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChatbotConversationRepository chatbotRepository;

    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(@RequestBody Map<String, String> body, @RequestParam(value = "lang", defaultValue = "en") String lang) {
        String message = body.get("message");
        org.springframework.security.core.Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserDetailsImpl)) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow();

        // Get AI response with full market data payload
        Map<String, Object> aiResult = aiService.chatWithMarketAssistantDetailed(user.getId(), message, lang);
        String aiResponse = (String) aiResult.get("response");

        // Persist conversation
        boolean isTamil = "ta".equalsIgnoreCase(lang);
        ChatbotConversation conversation = ChatbotConversation.builder()
                .user(user)
                .messageEn(isTamil ? null : message)
                .messageTa(isTamil ? message : null)
                .responseEn(isTamil ? "" : aiResponse)
                .responseTa(isTamil ? aiResponse : "")
                .build();
        chatbotRepository.save(conversation);

        return ResponseEntity.ok(aiResult);
    }

    @GetMapping("/price-prediction/{categoryId}")
    public ResponseEntity<Map<String, Object>> getPricePrediction(@PathVariable Integer categoryId, @RequestParam(value = "lang", defaultValue = "en") String lang) {
        return ResponseEntity.ok(aiService.getPricePrediction(categoryId, lang));
    }

    @GetMapping("/market-forecast/{categoryId}")
    public ResponseEntity<Map<String, Object>> getMarketForecast(@PathVariable Integer categoryId, @RequestParam(value = "lang", defaultValue = "en") String lang) {
        return ResponseEntity.ok(aiService.getMarketForecast(categoryId, lang));
    }

    @GetMapping("/export-advice/{categoryId}")
    public ResponseEntity<Map<String, Object>> getExportAdvice(@PathVariable Integer categoryId, @RequestParam(value = "lang", defaultValue = "en") String lang) {
        return ResponseEntity.ok(aiService.getExportAdvice(categoryId, lang));
    }

    @PostMapping("/generate-description")
    public ResponseEntity<Map<String, String>> generateDescription(@RequestBody Map<String, String> body) {
        String productName = body.get("productName");
        String categoryName = body.get("categoryName");
        return ResponseEntity.ok(aiService.generateProductDescription(productName, categoryName));
    }
}
