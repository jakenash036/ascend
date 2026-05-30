CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  shopify_customer_id TEXT UNIQUE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  discord TEXT,
  discord_id TEXT UNIQUE,
  password_hash TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'active' | 'cancelled'
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  shopify_order_id TEXT UNIQUE NOT NULL,
  plan TEXT NOT NULL, -- 'monthly' or 'yearly'
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- 'active' | 'cancelled' | 'expired'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
