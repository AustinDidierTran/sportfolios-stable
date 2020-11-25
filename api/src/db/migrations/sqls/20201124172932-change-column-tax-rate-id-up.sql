/* Replace with your SQL commands */
ALTER TABLE stripe_price
  DROP COLUMN tax_rate_id;

CREATE TABLE tax_rates_stripe_price
(
  stripe_price_id VARCHAR(255) REFERENCES stripe_price(stripe_price_id),
  tax_rate_id VARCHAR(255) REFERENCES tax_rates(id),
  PRIMARY KEY(stripe_price_id,tax_rate_id)
);
