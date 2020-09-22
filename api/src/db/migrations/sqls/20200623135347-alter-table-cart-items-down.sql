DELETE FROM cart_items;
ALTER TABLE cart_items
    ADD COLUMN entity_id UUID references entities
(id) NOT NULL,
DROP COLUMN user_id;