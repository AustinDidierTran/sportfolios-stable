/* Replace with your SQL commands */
ALTER TABLE stripe_product
ADD COLUMN metadata JSON;

ALTER TABLE stripe_price
ADD COLUMN metadata JSON;

ALTER TABLE cart_items
ADD COLUMN metadata JSON;