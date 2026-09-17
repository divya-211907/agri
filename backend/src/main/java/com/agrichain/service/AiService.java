package com.agrichain.service;

import java.util.Map;

public interface AiService {
    String chatWithMarketAssistant(Long userId, String message, String lang);
    Map<String, Object> chatWithMarketAssistantDetailed(Long userId, String message, String lang);
    Map<String, Object> getPricePrediction(Integer categoryId, String lang);
    Map<String, Object> getMarketForecast(Integer categoryId, String lang);
    Map<String, Object> getExportAdvice(Integer categoryId, String lang);
    Map<String, String> generateProductDescription(String productName, String categoryName);
}
