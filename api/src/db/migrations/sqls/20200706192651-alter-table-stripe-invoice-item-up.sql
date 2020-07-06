ALTER TABLE stripe_invoice_item
ADD COLUMN metadata JSON;

CREATE TABLE stripe_transfer
ADD COLUMN user_id REFERENCES users
(id),
ADD COLUMN transfer_id VARCHAR
(255) NOT NULL,
ADD COLUMN status VARCHAR
(255) NOT NULL;
