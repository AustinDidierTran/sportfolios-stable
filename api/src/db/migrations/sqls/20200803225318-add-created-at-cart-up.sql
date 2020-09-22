ALTER TABLE cart_items
  ADD COLUMN created_at timestamp NOT NULL DEFAULT now();