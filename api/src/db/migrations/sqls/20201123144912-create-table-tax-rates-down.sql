/* Replace with your SQL commands */
ALTER TABLE stripe_price
  DROP COLUMN tax_rate_id;

DROP TABLE tax_rates;