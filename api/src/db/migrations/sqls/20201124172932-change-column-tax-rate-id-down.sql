/* Replace with your SQL commands */
DROP TABLE tax_rates_stripe_price;

ALTER TABLE stripe_price
  ADD COLUMN tax_rate_id VARCHAR(255) REFERENCES tax_rates(id);