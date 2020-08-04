ALTER TABLE stripe_invoice_item
  ADD COLUMN seller_entity_id UUID;

UPDATE stripe_invoice_item 
  SET seller_entity_id = siii.seller_entity_id
  FROM (SELECT sii.invoice_item_id,
	CASE 
		WHEN sii.seller_id IS NOT NULL THEN sii.seller_id
    	WHEN sii.seller_entity_id IS NOT NULL THEN sii.seller_entity_id
	END AS seller_entity_id
	FROM (select invoice_item_id, (metadata ->> 'sellerId')::uuid AS seller_id, (metadata ->> 'seller_entity_id')::uuid AS seller_entity_id from stripe_invoice_item) AS sii) AS siii
  WHERE stripe_invoice_item.invoice_item_id = siii.invoice_item_id;