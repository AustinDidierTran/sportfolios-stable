/* Replace with your SQL commands */
ALTER TABLE stripe_product
DROP COLUMN metadata;

ALTER TABLE stripe_price
DROP COLUMN metadata;

ALTER TABLE cart_items
DROP COLUMN metadata;