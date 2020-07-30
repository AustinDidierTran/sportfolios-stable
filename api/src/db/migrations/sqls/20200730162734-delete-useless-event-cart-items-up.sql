DELETE FROM cart_items
	WHERE id IN (select id AS cartItemIds
	FROM (select id, metadata ->> 'rosterId' 
		  AS rosterId from cart_items
		 ) AS cartItems 
	WHERE cartItems.rosterid NOT IN (select CAST (roster_id AS text) from event_rosters));