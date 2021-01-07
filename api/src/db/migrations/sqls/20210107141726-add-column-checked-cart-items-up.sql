/* Replace with your SQL commands */
ALTER TABLE cart_items
  ADD COLUMN selected BOOLEAN NOT NULL DEFAULT TRUE;