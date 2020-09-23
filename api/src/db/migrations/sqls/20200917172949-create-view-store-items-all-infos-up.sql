CREATE OR REPLACE VIEW store_items_all_infos AS
SELECT entity_id,
price.stripe_price_id,
product.stripe_product_id,
label,
description,
amount,
price.active,
photo_url,
items.created_at
FROM store_items items
LEFT JOIN stripe_price price ON items.stripe_price_id=price.stripe_price_id
LEFT JOIN stripe_product product ON product.stripe_product_id = price.stripe_product_id
LEFT JOIN entities e on items.entity_id=e.id
;
