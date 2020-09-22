CREATE TABLE stripe_accounts
(
    entity_id UUID REFERENCES entities(id),
    account_id VARCHAR(255) NOT NULL,
    created_at timestamp DEFAULT now(),
    PRIMARY KEY(entity_id,account_id)
);