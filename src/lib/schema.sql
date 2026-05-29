CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  shopify_customer_id TEXT UNIQUE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  discord TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'active' | 'cancelled'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  shopify_order_id TEXT UNIQUE NOT NULL,
  plan TEXT NOT NULL, -- 'monthly' or 'yearly'
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
