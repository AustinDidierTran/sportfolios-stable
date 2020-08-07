/* Replace with your SQL commands */
ALTER TABLE stripe_product
ALTER COLUMN description TYPE VARCHAR(2048);

ALTER TABLE entities_general_infos
ALTER COLUMN description TYPE VARCHAR(4000),
ALTER COLUMN quick_description TYPE VARCHAR(500);