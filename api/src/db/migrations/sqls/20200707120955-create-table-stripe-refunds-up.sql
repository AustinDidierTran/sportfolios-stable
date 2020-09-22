CREATE TABLE stripe_refund
(
    refund_id VARCHAR(255) PRIMARY KEY,
    invoice_id VARCHAR(255) references stripe_invoice(invoice_id),
    amount INTEGER NOT NULL
);