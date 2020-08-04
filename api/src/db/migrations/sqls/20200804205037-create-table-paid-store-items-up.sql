CREATE TABLE store_items_paid (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  seller_entity_id UUID NOT NULL REFERENCES entities(id),
  quantity integer NOT NULL,
  unit_amount integer NOT NULL,
  amount integer NOT NULL,
  stripe_price_id VARCHAR(255) REFERENCES stripe_price(stripe_price_id) NOT NULL,
  buyer_user_id UUID NOT NULL REFERENCES users(id),
  invoice_item_id VARCHAR(255) NOT NULL REFERENCES stripe_invoice_item(invoice_item_id),
  metadata JSON
)