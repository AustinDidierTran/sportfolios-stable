ALTER TABLE cart_items
  ADD COLUMN id UUID DEFAULT uuid_generate_v4
() PRIMARY KEY;