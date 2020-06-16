CREATE TABLE stripe_invoice
(
    user_id UUID REFERENCES users(id) NOT NULL,
    invoice_id VARCHAR(255) NOT NULL PRIMARY KEY,
    status VARCHAR(255) NOT NULL
);

CREATE TABLE stripe_invoice_item
(
    user_id UUID REFERENCES users(id) NOT NULL,
    invoice_item_id VARCHAR(255) NOT NULL PRIMARY KEY
);