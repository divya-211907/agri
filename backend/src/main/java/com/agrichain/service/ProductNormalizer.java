package com.agrichain.service;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class ProductNormalizer {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class NormalizationResult {
        private String rawQuery;
        private String canonicalName;
        private boolean ambiguous;
        private List<String> ambiguousOptions;
        private boolean recognized;
        private String clarificationPromptEn;
        private String clarificationPromptTa;
        private String alternativeReference;
    }

    public NormalizationResult normalize(String input) {
        if (input == null || input.trim().isEmpty()) {
            return NormalizationResult.builder()
                    .rawQuery("")
                    .recognized(false)
                    .build();
        }

        String query = input.trim().toLowerCase();

        // 1. Ambiguity Detection: Generic "soya" / "soy" / "சோயா"
        // When user asks generically about "soya", prompt to specify whether they mean Soybean grain, Soymeal, or Soya DOC
        if (query.matches(".*\\b(soya|soy)\\b.*") && 
            !query.contains("bean") && !query.contains("meal") && !query.contains("doc") && !query.contains("cake") && !query.contains("oil") ||
            query.equals("சோயா") || query.equals("soya") || query.equals("soy")) {
            return NormalizationResult.builder()
                    .rawQuery(input)
                    .ambiguous(true)
                    .ambiguousOptions(Arrays.asList("Soybean", "Soymeal", "Soybean Oil Cake"))
                    .clarificationPromptEn("You mentioned 'soya'. Please specify whether you mean Soybean (raw grain), Soymeal (de-oiled meal), or Soybean Oil Cake.")
                    .clarificationPromptTa("நீங்கள் 'சோயா' என்று குறிப்பிட்டுள்ளீர்கள். நீங்கள் குறிப்பிடுவது சோயாபீன் (தானியம்), சோயாமீல் (தீவன மாவு), அல்லது சோயா புண்ணாக்கு என்பதில் எதைக் குறிக்கிறீர்கள் எனத் தெளிவுபடுத்தவும்.")
                    .recognized(true)
                    .build();
        }

        // 2. Exact / Regex Keyword Mapping to Canonical Names
        if (matchesAny(query, "soybean", "soy bean", "soya bean", "சோயாபீன்", "சோயா அவரை", "soya grain")) {
            return recognized("Soybean", input);
        }

        if (matchesAny(query, "soymeal", "soy meal", "soya meal", "soya doc", "soy doc", "சோயாமீல்", "de-oiled soya")) {
            return recognized("Soymeal", input);
        }

        if (matchesAny(query, "groundnut cake", "groundnut oil cake", "peanut cake", "peanut oil cake", "ground nut cake", "கடலை புண்ணாக்கு", "நிலக்கடலை புண்ணாக்கு", "கடலைப்புண்ணாக்கு")) {
            return recognized("Groundnut Cake", input);
        }

        if (matchesAny(query, "cottonseed cake", "cotton seed cake", "cotton cake", "kapas cake", "பருத்தி புண்ணாக்கு", "பருத்திக் கொட்டை புண்ணாக்கு", "பருத்திப்புண்ணாக்கு")) {
            return recognized("Cottonseed Cake", input);
        }

        if (matchesAny(query, "mustard meal", "mustard cake", "mustard oil cake", "sarson cake", "கடுகு புண்ணாக்கு", "கடுகுப் புண்ணாக்கு")) {
            return recognized("Mustard Meal", input);
        }

        if (matchesAny(query, "sesame cake", "sesame oil cake", "gingelly cake", "gingelly oil cake", "til cake", "எள் புண்ணாக்கு", "எள்ளுப் புண்ணாக்கு")) {
            return recognized("Sesame Oil Cake", input);
        }

        if (matchesAny(query, "sunflower cake", "sunflower meal", "sunflower husk", "சூரியகாந்தி புண்ணாக்கு", "சூரியகாந்தி உமி")) {
            return recognized("Sunflower Cake", input);
        }

        if (matchesAny(query, "groundnut", "peanut", "நிலக்கடலை", "வேர்க்கடலை")) {
            return recognized("Groundnut", input);
        }

        // 3. Fallback check for partial matches or unrecognized products
        return NormalizationResult.builder()
                .rawQuery(input)
                .canonicalName(null)
                .ambiguous(false)
                .recognized(false)
                .alternativeReference("Groundnut Cake")
                .build();
    }

    private boolean matchesAny(String text, String... patterns) {
        for (String p : patterns) {
            if (text.contains(p.toLowerCase())) {
                return true;
            }
        }
        return false;
    }

    private NormalizationResult recognized(String canonical, String raw) {
        return NormalizationResult.builder()
                .rawQuery(raw)
                .canonicalName(canonical)
                .ambiguous(false)
                .recognized(true)
                .build();
    }
}
