package com.agrichain.service.impl;

import com.agrichain.entity.ProductCategory;
import com.agrichain.repository.ProductCategoryRepository;
import com.agrichain.service.AiService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.bedrockruntime.BedrockRuntimeClient;
import software.amazon.awssdk.services.bedrockruntime.model.InvokeModelRequest;
import software.amazon.awssdk.services.bedrockruntime.model.InvokeModelResponse;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class AiServiceImpl implements AiService {
    private static final Logger logger = LoggerFactory.getLogger(AiServiceImpl.class);

    @Value("${aws.bedrock.simulate:true}")
    private boolean simulate;

    @Value("${aws.bedrock.access-key-id:}")
    private String accessKeyId;

    @Value("${aws.bedrock.secret-access-key:}")
    private String secretAccessKey;

    @Value("${aws.region:us-east-1}")
    private String awsRegion;

    @Autowired
    private ProductCategoryRepository categoryRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private BedrockRuntimeClient getBedrockClient() {
        if (accessKeyId == null || accessKeyId.trim().isEmpty() ||
            secretAccessKey == null || secretAccessKey.trim().isEmpty()) {
            return null;
        }
        try {
            return BedrockRuntimeClient.builder()
                    .region(Region.of(awsRegion))
                    .credentialsProvider(StaticCredentialsProvider.create(
                            AwsBasicCredentials.create(accessKeyId, secretAccessKey)))
                    .build();
        } catch (Exception e) {
            logger.warn("Could not instantiate AWS Bedrock client: {}", e.getMessage());
            return null;
        }
    }

    @Override
    public String chatWithMarketAssistant(Long userId, String message, String lang) {
        boolean isTamil = "ta".equalsIgnoreCase(lang);
        logger.info("Chatbot query received: '{}' (Lang: {})", message, lang);

        if (!simulate) {
            BedrockRuntimeClient client = getBedrockClient();
            if (client != null) {
                try {
                    // Invoking Amazon Nova or Anthropic Claude via Bedrock
                    String modelId = "amazon.nova-lite-v1:0"; // Defaulting to Amazon Nova
                    ObjectNode requestBody = objectMapper.createObjectNode();
                    requestBody.put("prompt", "You are a professional agricultural advisor for oilseed products. Respond in " 
                            + (isTamil ? "Tamil" : "English") + ". Query: " + message);
                    requestBody.put("max_tokens", 500);
                    requestBody.put("temperature", 0.7);

                    InvokeModelRequest request = InvokeModelRequest.builder()
                            .modelId(modelId)
                            .contentType("application/json")
                            .accept("application/json")
                            .body(SdkBytes.fromUtf8String(objectMapper.writeValueAsString(requestBody)))
                            .build();

                    InvokeModelResponse response = client.invokeModel(request);
                    String responseBody = response.body().asString(StandardCharsets.UTF_8);
                    ObjectNode responseJson = (ObjectNode) objectMapper.readTree(responseBody);
                    if (responseJson.has("completion")) {
                        return responseJson.get("completion").asText();
                    } else if (responseJson.has("outputs")) {
                        return responseJson.get("outputs").get(0).get("text").asText();
                    }
                    return responseBody;
                } catch (Exception e) {
                    logger.error("AWS Bedrock execution failed, falling back to local simulation. Error: {}", e.getMessage());
                }
            }
        }

        // Return rich simulation response based on input content
        String lowercaseMsg = message.toLowerCase();
        if (lowercaseMsg.contains("விற்றால்") || lowercaseMsg.contains("லாபம்") || lowercaseMsg.contains("sell") || lowercaseMsg.contains("profit")) {
            return isTamil ? 
                "தற்போது 'சோயாமீல்' (Soymeal) சந்தையில் அதிக லாபம் தரக்கூடியதாக உள்ளது. நடப்பு வாரத்தில் இதன் தேவை கோவை மற்றும் ஈரோடு சந்தைகளில் 18% அதிகரித்துள்ளது. தற்போதைய சந்தை விலை கிலோவுக்கு ₹42.50 ஆக உள்ளது, இது அடுத்த மாதம் ₹44.50 ஆக உயர வாய்ப்புள்ளது." :
                "Currently, 'Soymeal' is highly profitable. Its demand in Coimbatore and Erode markets has surged by 18% this week. The spot price is ₹42.50/kg, expected to touch ₹44.50/kg next month.";
        } else if (lowercaseMsg.contains("தேவை") || lowercaseMsg.contains("demand") || lowercaseMsg.contains("trend")) {
            return isTamil ?
                "இந்த மாதத்தில் கடலை புண்ணாக்கு மற்றும் சோயாமீல் ஆகியவற்றுக்கு அதிக தேவை ஏற்பட்டுள்ளது. கால்நடை தீவன உற்பத்தி ஆலைகள் அதிகளவில் கொள்முதல் செய்யத் தொடங்கியுள்ளதே இதற்குக் காரணம்." :
                "Groundnut oil cake and Soymeal have the highest demand this month. This is driven by heavy procurement from cattle feed manufacturing units.";
        } else if (lowercaseMsg.contains("ஏற்றுமதி") || lowercaseMsg.contains("export")) {
            return isTamil ?
                "மலேசியா மற்றும் சிங்கப்பூருக்கு கடலை புண்ணாக்கு ஏற்றுமதி செய்ய சிறந்த வாய்ப்புகள் உள்ளன. புரதச்சத்து 46% மேல் இருக்கும் பட்சத்தில் கூடுதல் லாபம் பெறலாம்." :
                "Excellent export opportunities exist for Groundnut Oil Cake to Malaysia and Singapore. High margins can be locked if protein content is above 46%.";
        }

        return isTamil ?
            "வணக்கம்! நான் உங்கள் அக்ரிசெயின் சந்தை உதவியாளர். விலை கணிப்பு, சந்தை நிலவரம் அல்லது ஏற்றுமதி வாய்ப்புகள் பற்றி நீங்கள் என்னிடம் கேட்கலாம்." :
            "Hello! I am your AgriChain Market Assistant. You can ask me about price predictions, demand trends, or export leads.";
    }

    @Override
    public Map<String, Object> getPricePrediction(Integer categoryId, String lang) {
        boolean isTamil = "ta".equalsIgnoreCase(lang);
        ProductCategory category = categoryRepository.findById(categoryId).orElse(null);
        String name = (category != null) ? category.getNameEn() : "Oilseed By-Product";

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("categoryName", (category != null) ? (isTamil ? category.getNameTa() : category.getNameEn()) : name);
        response.put("currentPrice", 42.50);
        response.put("predictedPriceNextMonth", 44.20);
        response.put("trendDirection", "UP");
        response.put("riskIndicator", "LOW");

        response.put("explanation", isTamil ?
                "மாட்டுத்தீவன உற்பத்தி நிறுவனங்களிடமிருந்து சோயாபீன் தேவைகள் அதிகரித்துள்ளதாலும், தற்போதைய பருவ கால வரத்து குறைவினாலும் சோயாமீல் விலை அடுத்த 30 நாட்களில் 4% வரை அதிகரிக்கக்கூடும்." :
                "Due to a rise in feed mill inquiries and low seasonal stocks, prices are forecasted to climb by 4% over the next 30 days.");

        // Chart projections
        List<Map<String, Object>> chart = new ArrayList<>();
        chart.add(createChartPoint("May", 41.50));
        chart.add(createChartPoint("Jun (Current)", 42.50));
        chart.add(createChartPoint("Jul (Predicted)", 44.20));
        chart.add(createChartPoint("Aug (Predicted)", 45.00));
        chart.add(createChartPoint("Sep (Predicted)", 45.80));
        response.put("chartData", chart);

        return response;
    }

    @Override
    public Map<String, Object> getMarketForecast(Integer categoryId, String lang) {
        boolean isTamil = "ta".equalsIgnoreCase(lang);
        ProductCategory category = categoryRepository.findById(categoryId).orElse(null);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("category", (category != null) ? (isTamil ? category.getNameTa() : category.getNameEn()) : "By-product");
        response.put("demandStatus", "HIGH_GROWTH");
        response.put("supplyStatus", "STABLE_SHORTAGE");
        response.put("confidenceScore", 92.4);

        response.put("demandTrend", isTamil ? "தேவை 18% அதிகரித்துள்ளது" : "Demand increased by 18%");
        response.put("supplyTrend", isTamil ? "விநியோகம் 5% சரிந்துள்ளது" : "Supply decreased by 5%");

        response.put("seasonalInsight", isTamil ?
                "மழைக்காலத் துவக்கத்தின் காரணமாக கால்நடை தீவனங்கள் நுகர்வு அதிகரிக்கும் காலம் இது. இதனால் புண்ணாக்கு மற்றும் சோயாமீல் தேவைகள் அடுத்த 3 மாதங்களுக்கு வலுவாக நீடிக்கும்." :
                "Monsoon commencement triggers elevated dry fodder intake. Oil cakes and meals demand will remain structurally strong for the next 3 months.");

        return response;
    }

    @Override
    public Map<String, Object> getExportAdvice(Integer categoryId, String lang) {
        boolean isTamil = "ta".equalsIgnoreCase(lang);
        ProductCategory category = categoryRepository.findById(categoryId).orElse(null);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("category", (category != null) ? (isTamil ? category.getNameTa() : category.getNameEn()) : "By-product");
        response.put("exportReadinessScore", 85.0); // 85%

        List<Map<String, Object>> countries = new ArrayList<>();
        countries.add(createCountryLead("Singapore", isTamil ? "சிங்கப்பூர்" : "Singapore", "HIGH", 52.0, "Phytosanitary certificate (தாவர சுகாதார சான்றிதழ்)"));
        countries.add(createCountryLead("Malaysia", isTamil ? "மலேசியா" : "Malaysia", "MEDIUM", 45.5, "Aflatoxin Certificate (அஃப்லாடாக்சின் சான்றிதழ்)"));
        response.put("destinations", countries);

        response.put("readinessRecommendation", isTamil ?
                "ஏற்றுமதி தரத்தை அடைய உங்கள் தயாரிப்பின் ஈரப்பதத்தை 12% க்கும் குறைவாக பராமரிக்கவும். பேக்கிங்கிற்கு இரட்டை அடுக்கு பிபி பைகளைப் பயன்படுத்தவும்." :
                "To optimize export eligibility, maintain moisture content under 12%. Double-layered PP bag packing is highly recommended.");

        return response;
    }

    @Override
    public Map<String, String> generateProductDescription(String productName, String categoryName) {
        Map<String, String> desc = new HashMap<>();

        // Generate bilingual product descriptions
        desc.put("descriptionEn", "Premium quality " + productName + " categorized under " + categoryName + 
                ". Mechanically crushed and highly nutritious. Free from chemical additives and ideal for livestock feed formulation.");
        desc.put("descriptionTa", "உயர்தர " + productName + " (" + categoryName + 
                " வகை). இயந்திரம் மூலம் பிழியப்பட்ட சத்துக்கள் நிறைந்த தீவனம். எவ்வித இரசாயனக் கலப்பும் இல்லாதது, கால்நடைகளுக்கு மிகவும் உகந்தது.");
        return desc;
    }

    private Map<String, Object> createChartPoint(String label, double price) {
        Map<String, Object> point = new HashMap<>();
        point.put("month", label);
        point.put("price", price);
        return point;
    }

    private Map<String, Object> createCountryLead(String code, String name, String demand, double price, String certs) {
        Map<String, Object> lead = new LinkedHashMap<>();
        lead.put("countryCode", code);
        lead.put("countryName", name);
        lead.put("demandLevel", demand);
        lead.put("targetPrice", price);
        lead.put("certificatesRequired", certs);
        return lead;
    }
}
