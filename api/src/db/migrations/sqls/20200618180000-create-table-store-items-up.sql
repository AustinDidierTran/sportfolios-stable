CREATE TABLE store_items
(
    stripe_price_id VARCHAR(255) references stripe_price(stripe_price_id) PRIMARY KEY,
    entity_id UUID references entities(id) NOT NULL
);