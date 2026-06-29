import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const dictionary = {
  en: {
    // Navigation / General
    appName: "AgriChain AI",
    dashboard: "Dashboard",
    marketplace: "Marketplace",
    products: "Products",
    orders: "Orders",
    analytics: "Analytics",
    blockchain: "Ledger Verification",
    exportOpp: "Export Leads",
    notifications: "Notifications",
    aiAssistant: "Market Assistant",
    profile: "Profile",
    logout: "Log Out",
    welcome: "Welcome back",
    language: "Language",
    english: "English",
    tamil: "Tamil",
    role: "User Role",
    loading: "Loading data...",
    save: "Save Changes",
    delete: "Delete",
    submit: "Submit",
    cancel: "Cancel",
    search: "Search products...",
    pricePerKg: "Price per kg",
    availableStock: "Available Stock",
    category: "Category",
    description: "Description",
    add: "Add New Product",

    // Roles
    admin: "Administrator",
    farmer: "Farmer",
    buyer: "Buyer / Feed Mill",
    processor: "Processor",
    exporter: "Exporter",

    // Auth Pages
    loginTitle: "Sign In to AgriChain AI",
    registerTitle: "Farmer & Buyer Registration",
    emailLabel: "Email Address",
    passwordLabel: "Password",
    roleSelectLabel: "Select Access Role",
    loginBtn: "Login",
    noAccount: "Don't have an account?",
    alreadyHaveAccount: "Already registered?",
    registerBtn: "Register Account",
    phone: "Phone Number",
    location: "Location / District",
    state: "State",
    farmName: "Farm / Business Name",
    sizeAcres: "Farm Size (Acres)",
    bio: "Farm Description / Bio",
    companyName: "Company Name",
    taxId: "GSTIN / Tax ID",
    facilityName: "Processing Facility Name",
    capacity: "Crushing Capacity (Tons/Day)",
    licenseNumber: "Export License Number",
    exportDestinations: "Export Destination Countries (e.g. Singapore, UAE)",

    // Farmer Dashboard
    revenue: "Total Revenue",
    totalStockCount: "Total Inventory",
    pendingOrdersCount: "Pending Orders",
    listedProducts: "Listed By-Products",
    aiDescriptionGen: "AI Description Generator",
    genBtn: "Generate AI Descriptions",
    nameEn: "Product Name (English)",
    nameTa: "Product Name (Tamil)",
    priceLabel: "Price (₹/kg)",
    stockLabel: "Stock (kg)",

    // Buyer Dashboard & Marketplace
    browseProducts: "Browse Oilseed By-Products",
    purchaseTitle: "Procurement Order Checkout",
    checkoutBtn: "Complete Order",
    paymentMethod: "Payment Method",
    cod: "Cash On Delivery (COD)",
    online: "AgriChain NetBanking Transfer",
    totalAmount: "Total Order Price",
    orderStatus: "Order Status",
    quantityRequired: "Quantity Required (kg)",

    // Blockchain Page
    ledgerTitle: "AgriChain Cryptographic Ledger Explorer",
    ledgerSub: "Immutable trade logs chained with SHA-256 block hashing and validator node signatures.",
    blockIndex: "Block Index",
    blockHash: "Block Hash",
    prevHash: "Previous Hash",
    payload: "Order Payload",
    validator: "Validator Node Signature",
    verifyChainBtn: "Verify Ledger Integrity",
    integritySecure: "Ledger Secured",
    integrityCompromised: "Chain Compromised",

    // Export Page
    exportTitle: "AI Export Advisor & Trade Matching",
    destinationCountry: "Destination Country",
    targetPrice: "Target Buyer Price",
    qtyRequired: "Quantity Demanded",
    requirements: "Quality Requirements & Certifications",
    readinessScore: "AI Export Readiness Score",
    recommendation: "AI Market Recommendations",

    // AI Chat Page
    chatTitle: "AI Smart Market Assistant (Bedrock)",
    chatPlaceholder: "Ask me a market query (e.g., Which by-product is in high demand?)...",
    chatBtn: "Ask Assistant",
    aiTyping: "AI is thinking..."
  },
  ta: {
    // Navigation / General
    appName: "அக்ரிசெயின் AI",
    dashboard: "டாஷ்போர்டு",
    marketplace: "சந்தை",
    products: "பொருட்கள்",
    orders: "ஆர்டர்கள்",
    analytics: "பகுப்பாய்வு",
    blockchain: "வர்த்தக பேரேடு",
    exportOpp: "ஏற்றுமதி வாய்ப்புகள்",
    notifications: "அறிவிப்புகள்",
    aiAssistant: "சந்தை உதவியாளர்",
    profile: "சுயவிவரம்",
    logout: "வெளியேறு",
    welcome: "மீண்டும் வருக",
    language: "மொழி",
    english: "English",
    tamil: "தமிழ்",
    role: "பயனர் பங்கு",
    loading: "தரவு ஏற்றப்படுகிறது...",
    save: "மாற்றங்களைச் சேமி",
    delete: "நீக்கு",
    submit: "சமர்ப்பி",
    cancel: "ரத்து செய்",
    search: "பொருட்களைத் தேடு...",
    pricePerKg: "ஒரு கிலோ விலை",
    availableStock: "இருப்பு அளவு",
    category: "வகை",
    description: "விளக்கம்",
    add: "புதிய பொருளைச் சேர்",

    // Roles
    admin: "நிர்வாகி",
    farmer: "விவசாயி",
    buyer: "கொள்முதல் வாங்குபவர்",
    processor: "எண்ணெய் ஆலை",
    exporter: "ஏற்றுமதியாளர்",

    // Auth Pages
    loginTitle: "அக்ரிசெயின் AI இல் உள்நுழையவும்",
    registerTitle: "விவசாயி மற்றும் வாங்குபவர் பதிவு",
    emailLabel: "மின்னஞ்சல் முகவரி",
    passwordLabel: "கடவுச்சொல்",
    roleSelectLabel: "அணுகல் பங்கைத் தேர்ந்தெடுக்கவும்",
    loginBtn: "உள்நுழைக",
    noAccount: "கணக்கு இல்லையா?",
    alreadyHaveAccount: "ஏற்கனவே பதிவு செய்துள்ளீர்களா?",
    registerBtn: "கணக்கை பதிவுசெய்",
    phone: "தொலைபேசி எண்",
    location: "மாவட்டம் / இருப்பிடம்",
    state: "மாநிலம்",
    farmName: "பண்ணை / வணிகப் பெயர்",
    sizeAcres: "பண்ணை அளவு (ஏக்கர்)",
    bio: "பண்ணை விளக்கம்",
    companyName: "நிறுவனத்தின் பெயர்",
    taxId: "ஜிஎஸ்டி / வரி ஐடி",
    facilityName: "ஆலை பெயர்",
    capacity: "அரைக்கும் திறன் (டன்/நாள்)",
    licenseNumber: "ஏற்றுமதி உரிம எண்",
    exportDestinations: "ஏற்றுமதி நாடுகள் (எ.கா. சிங்கப்பூர், ஐக்கிய அரபு அமீரகம்)",

    // Farmer Dashboard
    revenue: "மொத்த வருவாய்",
    totalStockCount: "மொத்த இருப்பு",
    pendingOrdersCount: "காத்திருக்கும் ஆர்டர்கள்",
    listedProducts: "பட்டியலிடப்பட்ட பொருட்கள்",
    aiDescriptionGen: "AI பொருள் விளக்க இயற்றி",
    genBtn: "AI விளக்கங்களை உருவாக்கு",
    nameEn: "பொருளின் பெயர் (ஆங்கிலம்)",
    nameTa: "பொருளின் பெயர் (தமிழ்)",
    priceLabel: "விலை (₹/கிலோ)",
    stockLabel: "இருப்பு (கிலோ)",

    // Buyer Dashboard & Marketplace
    browseProducts: "எண்ணெய் வித்து துணைப் பொருட்களை உலாவுக",
    purchaseTitle: "கொள்முதல் ஆர்டர் செக்அவுட்",
    checkoutBtn: "ஆர்டரை நிறைவு செய்",
    paymentMethod: "கட்டண முறை",
    cod: "டெலிவரியின் போது பணம் செலுத்துதல் (COD)",
    online: "அக்ரிசெயின் வங்கி பரிமாற்றம்",
    totalAmount: "மொத்த ஆர்டர் விலை",
    orderStatus: "ஆர்டர் நிலை",
    quantityRequired: "தேவைப்படும் அளவு (கிலோ)",

    // Blockchain Page
    ledgerTitle: "அக்ரிசெயின் வர்த்தக பேரேடு எக்ஸ்ப்ளோரர்",
    ledgerSub: "SHA-256 தொகுதி ஹாஷிங் மற்றும் அங்கீகார கையொப்பங்களுடன் இணைக்கப்பட்ட வர்த்தகப் பதிவுகள்.",
    blockIndex: "தொகுதி குறியீடு",
    blockHash: "தொகுதி ஹாஷ்",
    prevHash: "முந்தைய ஹாஷ்",
    payload: "ஆர்டர் விவரங்கள் (JSON)",
    validator: "கையொப்பம் (Validator Node)",
    verifyChainBtn: "பேரேட்டு பாதுகாப்பை சரிபார்",
    integritySecure: "பேரேடு பாதுகாப்பானது",
    integrityCompromised: "பேரேடு திருத்தப்பட்டது",

    // Export Page
    exportTitle: "AI ஏற்றுமதி ஆலோசனைகள்",
    destinationCountry: "ஏற்றுமதி நாடு",
    targetPrice: "வாங்குபவர் இலக்கு விலை",
    qtyRequired: "தேவைப்படும் அளவு",
    requirements: "தர தேவைகள் மற்றும் சான்றிதழ்கள்",
    readinessScore: "ஏற்றுமதி தயார்நிலை மதிப்பெண்",
    recommendation: "AI சந்தை பரிந்துரைகள்",

    // AI Chat Page
    chatTitle: "AI சந்தை உதவியாளர் (பெட்ராக்)",
    chatPlaceholder: "சந்தை நிலவரம் பற்றி என்னிடம் கேளுங்கள் (எ.கா., தற்போது எந்த பொருளுக்கு அதிக தேவை உள்ளது?)...",
    chatBtn: "கேள்வி கேள்",
    aiTyping: "AI யோசித்துக்கொண்டிருக்கிறது..."
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'ta' : 'en'));
  };

  const t = (key) => {
    return dictionary[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
