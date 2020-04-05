/* Replace with your SQL commands */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE associations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, 
  name VARCHAR(255) NOT NULL, 
deleted_at TIMESTAMP);
