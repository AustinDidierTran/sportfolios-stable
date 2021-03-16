alter table memberships
ADD COLUMN membership_id UUID REFERENCES entity_memberships(id);

DO $$
DECLARE
	membership memberships;
	membership_new_id uuid;
BEGIN
FOR membership IN
		SELECT * FROM memberships 
	LOOP
	select entity_memberships.id into membership_new_id from entity_memberships where entity_id =membership.organization_id and membership_type = membership.member_type LIMIT 1;
	update memberships set membership_id = membership_new_id where created_at = membership.created_at;
END LOOP;
END;
$$
LANGUAGE plpgsql;
