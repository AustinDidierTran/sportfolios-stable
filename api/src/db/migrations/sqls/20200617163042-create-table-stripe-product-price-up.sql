CREATE TABLE stripe_product
(
  stripe_product_id VARCHAR(255) PRIMARY KEY,
  label VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  active BOOLEAN NOT NULL
);

CREATE TABLE stripe_price
(
  stripe_price_id VARCHAR(255) PRIMARY KEY,
  stripe_product_id VARCHAR(255) REFERENCES stripe_product(stripe_product_id) NOT NULL,
  amount INTEGER NOT NULL,
  active BOOLEAN NOT NULL,
  start_date TIMESTAMP,
  end_date TIMESTAMP
);

ALTER TABLE stripe_invoice_item
  ADD COLUMN stripe_price_id VARCHAR
(255) REFERENCES stripe_price
(stripe_price_id) NOT NULL;