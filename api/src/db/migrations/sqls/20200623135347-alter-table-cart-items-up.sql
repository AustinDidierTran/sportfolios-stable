ALTER TABLE cart_items
    DROP COLUMN entity_id
,
ADD COLUMN user_id UUID REFERENCES users
(id) NOT NULL;