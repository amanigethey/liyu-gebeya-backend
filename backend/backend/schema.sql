
-- LIYU GEBEYA DATABASE
-- PostgreSQL

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(30) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    profile_image TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Main categories
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(20),
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Advertisements
CREATE TABLE IF NOT EXISTS advertisements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    price NUMERIC(14,2),
    currency VARCHAR(10) DEFAULT 'ETB',
    location VARCHAR(200),
    status VARCHAR(30) DEFAULT 'active',
    is_sponsored BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Advertisement photos (maximum 5 per advertisement)
CREATE TABLE IF NOT EXISTS advertisement_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    advertisement_id UUID NOT NULL
        REFERENCES advertisements(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Seller information
CREATE TABLE IF NOT EXISTS seller_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(150),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Saved advertisements
CREATE TABLE IF NOT EXISTS saved_advertisements (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    advertisement_id UUID REFERENCES advertisements(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, advertisement_id)
);

-- 7. Insert the 9 main home categories
INSERT INTO categories (name, icon, display_order)
VALUES
('Houses', '🏠', 1),
('Cars', '🚗', 2),
('Others', '📦', 3),
('Jobs', '💼', 4),
('Sponsored', '⭐', 5),
('Service', '🔧', 6),
('Wanted', '🔍', 7),
('Lost/Found', '🔎', 8),
('Free', '🎁', 9)
ON CONFLICT (name) DO NOTHING;

-- 8. Useful indexes
CREATE INDEX IF NOT EXISTS idx_ads_category
ON advertisements(category_id);

CREATE INDEX IF NOT EXISTS idx_ads_user
ON advertisements(user_id);

CREATE INDEX IF NOT EXISTS idx_ads_status
ON advertisements(status);

CREATE INDEX IF NOT EXISTS idx_ads_created
ON advertisements(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_images_ad
ON advertisement_images(advertisement_id);
