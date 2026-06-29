-- AgriChain AI Database Schema & Seed Data (PostgreSQL)

-- Drop tables if they exist (for easy environment resets)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS chatbot_conversations CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS export_opportunities CASCADE;
DROP TABLE IF EXISTS demand_supply CASCADE;
DROP TABLE IF EXISTS market_forecasts CASCADE;
DROP TABLE IF EXISTS price_history CASCADE;
DROP TABLE IF EXISTS blockchain_records CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS product_categories CASCADE;
DROP TABLE IF EXISTS exporters CASCADE;
DROP TABLE IF EXISTS processors CASCADE;
DROP TABLE IF EXISTS buyers CASCADE;
DROP TABLE IF EXISTS farmers CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Users Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Roles Table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) UNIQUE NOT NULL
);

-- 3. User Roles Mapping
CREATE TABLE user_roles (
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- 4. Farmers Profile Table
CREATE TABLE farmers (
    user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    farm_name VARCHAR(100) NOT NULL,
    tamil_farm_name VARCHAR(100),
    location VARCHAR(100) NOT NULL,
    tamil_location VARCHAR(100),
    state VARCHAR(50) NOT NULL,
    tamil_state VARCHAR(50),
    phone VARCHAR(20) NOT NULL,
    size_acres DECIMAL(6,2),
    bio TEXT,
    tamil_bio TEXT
);

-- 5. Buyers Profile Table
CREATE TABLE buyers (
    user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(100) NOT NULL,
    tamil_company_name VARCHAR(100),
    location VARCHAR(100) NOT NULL,
    tamil_location VARCHAR(100),
    contact_number VARCHAR(20) NOT NULL,
    tax_id VARCHAR(50)
);

-- 6. Processors Profile Table
CREATE TABLE processors (
    user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    facility_name VARCHAR(100) NOT NULL,
    tamil_facility_name VARCHAR(100),
    capacity_tons_day DECIMAL(8,2) NOT NULL,
    location VARCHAR(100) NOT NULL,
    tamil_location VARCHAR(100),
    contact_number VARCHAR(20) NOT NULL
);

-- 7. Exporters Profile Table
CREATE TABLE exporters (
    user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    export_destinations VARCHAR(255),
    tamil_export_destinations VARCHAR(255),
    contact_number VARCHAR(20) NOT NULL
);

-- 8. Product Categories Table
CREATE TABLE product_categories (
    id SERIAL PRIMARY KEY,
    name_en VARCHAR(50) UNIQUE NOT NULL,
    name_ta VARCHAR(100) UNIQUE NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL
);

-- 9. Products Table
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    farmer_id BIGINT NOT NULL REFERENCES farmers(user_id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES product_categories(id),
    name_en VARCHAR(100) NOT NULL,
    name_ta VARCHAR(150) NOT NULL,
    description_en TEXT NOT NULL,
    description_ta TEXT NOT NULL,
    price_per_kg DECIMAL(10,2) NOT NULL CHECK (price_per_kg >= 0),
    stock_kg DECIMAL(10,2) NOT NULL CHECK (stock_kg >= 0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 10. Product Images Table
CREATE TABLE product_images (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL
);

-- 11. Orders Table
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    buyer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'SHIPPED', 'COMPLETED', 'CANCELLED')),
    total_amount DECIMAL(12,2) NOT NULL CHECK (total_amount >= 0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 12. Order Items Table
CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity DECIMAL(10,2) NOT NULL CHECK (quantity > 0),
    price_at_purchase DECIMAL(10,2) NOT NULL CHECK (price_at_purchase >= 0)
);

-- 13. Transactions Table
CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'COMPLETED', 'FAILED')),
    payment_method VARCHAR(50),
    tx_hash VARCHAR(64) UNIQUE, -- simulated blockchain transaction reference hash
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 14. Blockchain Immutable Ledger Table
CREATE TABLE blockchain_records (
    id BIGSERIAL PRIMARY KEY,
    block_index BIGINT NOT NULL UNIQUE,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_payload TEXT NOT NULL, -- JSON formatted containing Order details
    previous_hash VARCHAR(64) NOT NULL,
    block_hash VARCHAR(64) NOT NULL UNIQUE,
    validator_signature VARCHAR(128)
);

-- 15. Price History Table (For AI analysis & trend curves)
CREATE TABLE price_history (
    id BIGSERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES product_categories(id) ON DELETE CASCADE,
    price_per_kg DECIMAL(10,2) NOT NULL,
    recorded_date DATE NOT NULL,
    is_prediction BOOLEAN NOT NULL DEFAULT FALSE
);

-- 16. Market Forecasts Table
CREATE TABLE market_forecasts (
    id BIGSERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES product_categories(id) ON DELETE CASCADE,
    forecast_date DATE NOT NULL,
    predicted_demand_kg DECIMAL(12,2) NOT NULL,
    predicted_supply_kg DECIMAL(12,2) NOT NULL,
    confidence_score DECIMAL(5,2) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
    insights_en TEXT,
    insights_ta TEXT
);

-- 17. Demand & Supply Regional Tracking Table
CREATE TABLE demand_supply (
    id BIGSERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES product_categories(id) ON DELETE CASCADE,
    region VARCHAR(100) NOT NULL,
    region_ta VARCHAR(100),
    demand_kg DECIMAL(12,2) NOT NULL DEFAULT 0,
    supply_kg DECIMAL(12,2) NOT NULL DEFAULT 0,
    status_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- 18. Export Opportunities Table
CREATE TABLE export_opportunities (
    id BIGSERIAL PRIMARY KEY,
    title_en VARCHAR(150) NOT NULL,
    title_ta VARCHAR(200) NOT NULL,
    destination_country VARCHAR(100) NOT NULL,
    destination_country_ta VARCHAR(100),
    quantity_required_kg DECIMAL(12,2) NOT NULL,
    target_price_per_kg DECIMAL(10,2) NOT NULL,
    deadline DATE NOT NULL,
    requirements_en TEXT,
    requirements_ta TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 19. Notifications Table
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message_en TEXT NOT NULL,
    message_ta TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 20. Chatbot Conversations Table
CREATE TABLE chatbot_conversations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message_en TEXT,
    message_ta TEXT,
    response_en TEXT NOT NULL,
    response_ta TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 21. Audit Logs Table
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==================== INDEXES FOR PERFORMANCE ====================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_farmer ON products(farmer_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_transactions_order ON transactions(order_id);
CREATE INDEX idx_price_history_cat_date ON price_history(category_id, recorded_date);
CREATE INDEX idx_blockchain_index ON blockchain_records(block_index);
CREATE INDEX idx_blockchain_hash ON blockchain_records(block_hash);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read);


-- ==================== INITIAL SAMPLE DATA ====================

-- Insert Roles
INSERT INTO roles (id, name) VALUES 
(1, 'ADMIN'),
(2, 'FARMER'),
(3, 'BUYER'),
(4, 'PROCESSOR'),
(5, 'EXPORTER');

-- Insert Users (Password: '$2a$10$Ab3t5vQc2E5M/bif.DgHn.1ShSCWIbL3YQQxBWOPewmT4Ev3rLxaW' which is 'password' crypted)
INSERT INTO users (id, email, password, active) VALUES 
(1, 'admin@agrichain.com', '$2a$10$Ab3t5vQc2E5M/bif.DgHn.1ShSCWIbL3YQQxBWOPewmT4Ev3rLxaW', true),
(2, 'farmer.ramesh@agrichain.com', '$2a$10$Ab3t5vQc2E5M/bif.DgHn.1ShSCWIbL3YQQxBWOPewmT4Ev3rLxaW', true),
(3, 'buyer.corporation@agrichain.com', '$2a$10$Ab3t5vQc2E5M/bif.DgHn.1ShSCWIbL3YQQxBWOPewmT4Ev3rLxaW', true),
(4, 'processor.oilmill@agrichain.com', '$2a$10$Ab3t5vQc2E5M/bif.DgHn.1ShSCWIbL3YQQxBWOPewmT4Ev3rLxaW', true),
(5, 'exporter.global@agrichain.com', '$2a$10$Ab3t5vQc2E5M/bif.DgHn.1ShSCWIbL3YQQxBWOPewmT4Ev3rLxaW', true);

-- Map Users to Roles
INSERT INTO user_roles (user_id, role_id) VALUES 
(1, 1), -- Admin
(2, 2), -- Farmer
(3, 3), -- Buyer
(4, 4), -- Processor
(5, 5); -- Exporter

-- Insert Profile Info
INSERT INTO farmers (user_id, farm_name, tamil_farm_name, location, tamil_location, state, tamil_state, phone, size_acres, bio, tamil_bio) VALUES 
(2, 'Ramesh Organic Farms', 'ரமேஷ் இயற்கை பண்ணை', 'Salem', 'சேலம்', 'Tamil Nadu', 'தமிழ்நாடு', '+91 9876543210', 12.5, 'We cultivate high quality organic soybeans and groundnuts.', 'நாங்கள் உயர்தர இயற்கை சோயாபீன்ஸ் மற்றும் நிலக்கடலை பயிரிடுகிறோம்.');

INSERT INTO buyers (user_id, company_name, tamil_company_name, location, tamil_location, contact_number, tax_id) VALUES 
(3, 'Kovai Feeds & Feeder Corp', 'கோவை தீவனங்கள் நிறுவனம்', 'Coimbatore', 'கோயம்புத்தூர்', '+91 9443322110', 'GSTIN33AAACK4412B1Z3');

INSERT INTO processors (user_id, facility_name, tamil_facility_name, capacity_tons_day, location, tamil_location, contact_number) VALUES 
(4, 'Vasantham Oil Seed Crushing Mill', 'வசந்தம் எண்ணெய் வித்துக்கள் அரைக்கும் ஆலை', 50.0, 'Erode', 'ஈரோடு', '+91 9842211002');

INSERT INTO exporters (user_id, license_number, export_destinations, tamil_export_destinations, contact_number) VALUES 
(5, 'EXP-IND-99827-TN', 'Singapore, Malaysia, UAE', 'சிங்கப்பூர், மலேசியா, ஐக்கிய அரபு அமீரகம்', '+91 9003882711');

-- Insert Product Categories
INSERT INTO product_categories (id, name_en, name_ta, code) VALUES 
(1, 'Soymeal', 'சோயாமீல்', 'SOYMEAL'),
(2, 'Groundnut Oil Cake', 'கடலை புண்ணாக்கு', 'GNUT_CAKE'),
(3, 'Sunflower Husk', 'சூரியகாந்தி உமி', 'SUN_HUSK'),
(4, 'Mustard Meal', 'கடுகு புண்ணாக்கு', 'MUSTARD_MEAL'),
(5, 'Sesame Oil Cake', 'எள் புண்ணாக்கு', 'SESAME_CAKE');

-- Insert Sample Products
INSERT INTO products (id, farmer_id, category_id, name_en, name_ta, description_en, description_ta, price_per_kg, stock_kg) VALUES 
(1, 2, 1, 'Premium Grade Organic Soymeal', 'பிரீமியம் தர இயற்கை சோயாமீல்', 'High protein content, ideal for cattle and poultry feeds.', 'அதிக புரதச்சத்து கொண்டது, மாடு மற்றும் கோழி தீவனத்திற்கு மிகவும் உகந்தது.', 42.50, 5000.00),
(2, 2, 2, 'Cold Pressed Groundnut Oil Cake', 'மரச்செக்கு கடலை புண்ணாக்கு', 'Rich in nutrients, sourced from fresh organic oilseeds.', 'ஊட்டச்சத்துக்கள் நிறைந்தது, புதிய இயற்கை எண்ணெய் வித்துக்களிலிருந்து தயாரிக்கப்பட்டது.', 38.00, 3000.00),
(3, 2, 3, 'Dry Sunflower Husk Feedstock', 'உலர்ந்த சூரியகாந்தி உமி', 'Cleaned and dried sunflower husk for biomass or cattle bedding.', 'சுத்திகரிக்கப்பட்ட மற்றும் உலர்த்தப்பட்ட சூரியகாந்தி உமி, உயிர் எரிபொருள் அல்லது கால்நடை படுக்கைக்கு ஏற்றது.', 12.00, 10000.00);

-- Insert Product Images
INSERT INTO product_images (product_id, image_url) VALUES 
(1, 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=400'),
(2, 'https://images.unsplash.com/photo-1594756202469-9ff9799b2e4e?auto=format&fit=crop&q=80&w=400'),
(3, 'https://images.unsplash.com/photo-1589923188900-85dae440342b?auto=format&fit=crop&q=80&w=400');

-- Insert Historical Price Data (For prediction rendering)
INSERT INTO price_history (category_id, price_per_kg, recorded_date, is_prediction) VALUES 
(1, 39.00, '2026-01-15', false),
(1, 40.20, '2026-02-15', false),
(1, 41.00, '2026-03-15', false),
(1, 41.50, '2026-04-15', false),
(1, 42.00, '2026-05-15', false),
(1, 42.50, '2026-06-15', false),
-- Predicted Prices
(1, 43.10, '2026-07-15', true),
(1, 43.80, '2026-08-15', true),
(1, 44.50, '2026-09-15', true),

-- Groundnut Oil Cake History
(2, 35.00, '2026-01-15', false),
(2, 35.80, '2026-02-15', false),
(2, 36.50, '2026-03-15', false),
(2, 37.00, '2026-04-15', false),
(2, 37.50, '2026-05-15', false),
(2, 38.00, '2026-06-15', false),
-- Predicted
(2, 38.20, '2026-07-15', true),
(2, 38.50, '2026-08-15', true),
(2, 39.00, '2026-09-15', true);

-- Insert Market Forecasts
INSERT INTO market_forecasts (category_id, forecast_date, predicted_demand_kg, predicted_supply_kg, confidence_score, insights_en, insights_ta) VALUES 
(1, '2026-07-01', 120000.00, 105000.00, 92.50, 'Soymeal demand is expected to surge due to low seasonal supply and high demand from regional poultry feeds. High export margins are projected.', 'குறைந்த பருவகால உற்பத்தி மற்றும் பிராந்திய கோழி தீவன ஆலைகளின் அதிக தேவை காரணமாக சோயாமீல் தேவை அதிகரிக்கும் என எதிர்பார்க்கப்படுகிறது. அதிக ஏற்றுமதி லாபம் கணிக்கப்பட்டுள்ளது.'),
(2, '2026-07-01', 85000.00, 89000.00, 88.00, 'Groundnut cake markets are stabilized. Local mills have robust stock levels matching feed demand, leading to flat pricing curves.', 'கடலை புண்ணாக்கு சந்தை ஸ்திரமாக உள்ளது. உள்ளூர் ஆலைகள் தீவன தேவைக்கேற்ப வலுவான இருப்பு நிலைகளை வைத்துள்ளன, இதனால் விலையில் பெரிய மாற்றம் இருக்காது.');

-- Insert Demand & Supply Regional Tracking
INSERT INTO demand_supply (category_id, region, region_ta, demand_kg, supply_kg) VALUES 
(1, 'Coimbatore', 'கோயம்புத்தூர்', 45000.00, 32000.00),
(1, 'Salem', 'சேலம்', 28000.00, 35000.00),
(2, 'Erode', 'ஈரோடு', 30000.00, 29000.00),
(2, 'Madurai', 'மதுரை', 18000.00, 15000.00),
(3, 'Tiruppur', 'திருப்பூர்', 50000.00, 48000.00);

-- Insert Export Opportunities
INSERT INTO export_opportunities (title_en, title_ta, destination_country, destination_country_ta, quantity_required_kg, target_price_per_kg, deadline, requirements_en, requirements_ta) VALUES 
('Organic Soymeal Feed Consignment', 'இயற்கை சோயாமீல் தீவன சரக்கு', 'Singapore', 'சிங்கப்பூர்', 25000.00, 52.00, '2026-08-30', 'Phytosanitary certificate required. Minimum protein content 46%. Moisture below 12%.', 'தாவர சுகாதார சான்றிதழ் தேவை. குறைந்தபட்ச புரதச்சத்து 46%. ஈரப்பதம் 12% க்கும் குறைவாக இருக்க வேண்டும்.'),
('Groundnut Oil Cake Bulk Order', 'நிலக்கடலை புண்ணாக்கு மொத்த கொள்முதல்', 'Malaysia', 'மலேசியா', 40000.00, 45.50, '2026-09-15', 'Aflatoxin test certificate necessary. Double woven PP bag packing required.', 'அஃப்லாடாக்சின் சோதனை சான்றிதழ் அவசியம். இரட்டை நெய்த பிபி பை பேக்கிங் தேவை.');

-- Insert Initial Notifications for the Farmer
INSERT INTO notifications (user_id, message_en, message_ta, is_read) VALUES 
(2, 'Welcome to AgriChain AI! List your products to start receiving buyers orders.', 'அக்ரிசெயின் AI-க்கு உங்களை வரவேற்கிறோம்! வாங்குபவர்களின் ஆர்டர்களைப் பெற உங்கள் பொருட்களைப் பட்டியலிடுங்கள்.', false),
(2, 'Soymeal prices are predicted to rise by 4.5% next month. Consider stocking.', 'அடுத்த மாதம் சோயாமீல் விலை 4.5% உயரும் என்று கணிக்கப்பட்டுள்ளது. சேமித்து வைக்க பரிசீலியுங்கள்.', false);

-- Insert Initial Audit Logs
INSERT INTO audit_logs (user_id, action, details) VALUES 
(1, 'SYSTEM_STARTUP', 'Database seeded with default roles, categories, and test user accounts.'),
(2, 'PROFILE_CREATION', 'Farmer Ramesh registered profile information.');

-- Insert Genesis Blockchain Block
INSERT INTO blockchain_records (block_index, timestamp, data_payload, previous_hash, block_hash, validator_signature) VALUES 
(0, '2026-06-25 00:00:00', 'Genesis Block - AgriChain AI Immutable Trade Ledger Started', '0000000000000000000000000000000000000000000000000000000000000000', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'SYSTEM_VALIDATOR_SIGNATURE_OK');

-- Reset Auto-Increment Sequences (resolves primary key constraint conflicts on inserts after manual seeds)
SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 1));
SELECT setval('roles_id_seq', COALESCE((SELECT MAX(id) FROM roles), 1));
SELECT setval('product_categories_id_seq', COALESCE((SELECT MAX(id) FROM product_categories), 1));
SELECT setval('products_id_seq', COALESCE((SELECT MAX(id) FROM products), 1));
