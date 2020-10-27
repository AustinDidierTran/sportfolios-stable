/* Replace with your SQL commands */
ALTER TABLE memberships
  ADD COLUMN status VARCHAR(255),
  ADD COLUMN invoice_item_id VARCHAR(255);

CREATE TABLE receipts(
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  receipt_url VARCHAR(255),
  user_id UUID NOT NULL REFERENCES users(id));
  
  ALTER TABLE store_items_paid
  ADD COLUMN receipt_id UUID REFERENCES receipts(id);

