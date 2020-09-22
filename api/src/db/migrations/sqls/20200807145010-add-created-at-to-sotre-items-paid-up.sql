/* Replace with your SQL commands */
ALTER TABLE store_items_paid
  ADD COLUMN created_at timestamp DEFAULT now();