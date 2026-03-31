
CREATE TABLE IF NOT EXISTS yamp_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(32) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar VARCHAR(10) DEFAULT '👤',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS yamp_friendships (
  id SERIAL PRIMARY KEY,
  requester_id INTEGER REFERENCES yamp_users(id),
  addressee_id INTEGER REFERENCES yamp_users(id),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(requester_id, addressee_id)
);

CREATE TABLE IF NOT EXISTS yamp_messages (
  id SERIAL PRIMARY KEY,
  from_id INTEGER REFERENCES yamp_users(id),
  to_id INTEGER REFERENCES yamp_users(id),
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP
);
