/* Replace with your SQL commands */
ALTER TABLE stripe_product
ALTER COLUMN description TYPE TEXT;

ALTER TABLE entities_general_infos
ALTER COLUMN description TYPE TEXT,
ALTER COLUMN quick_description TYPE TEXT;