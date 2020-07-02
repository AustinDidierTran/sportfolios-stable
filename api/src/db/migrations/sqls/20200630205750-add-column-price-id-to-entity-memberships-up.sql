/* Replace with your SQL commands */
ALTER TABLE entity_memberships
ADD COLUMN stripe_price_id VARCHAR(255) REFERENCES stripe_price(stripe_price_id);