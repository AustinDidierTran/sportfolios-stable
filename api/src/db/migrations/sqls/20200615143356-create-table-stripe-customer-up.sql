CREATE TABLE stripe_customer
(
    user_id UUID REFERENCES users(id) NOT NULL UNIQUE,
    customer_id VARCHAR(255) NOT NULL PRIMARY KEY
);