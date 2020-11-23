/* Replace with your SQL commands */
CREATE TABLE tax_rates(
  id VARCHAR(255) PRIMARY KEY, 
  display_name VARCHAR(255),
  description VARCHAR(255),
  inclusive BOOLEAN,
  active BOOLEAN,
  percentage NUMERIC(6,4),
  deleted_at TIMESTAMP
);

ALTER TABLE stripe_price
  ADD COLUMN tax_rate_id VARCHAR(255) REFERENCES tax_rates(id);