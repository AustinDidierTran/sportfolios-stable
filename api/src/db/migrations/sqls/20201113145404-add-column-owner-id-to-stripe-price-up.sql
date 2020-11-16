/* Replace with your SQL commands */
ALTER TABLE stripe_price
  ADD COLUMN owner_id UUID REFERENCES entities(id);
