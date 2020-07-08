ALTER TABLE stripe_invoice_item
ADD COLUMN metadata JSON;

CREATE TABLE stripe_transfer
(
    transfer_id VARCHAR(255) PRIMARY KEY,
    invoice_item_id VARCHAR(255) references stripe_invoice_item(invoice_item_id),
    status VARCHAR(255) NOT NULL
);