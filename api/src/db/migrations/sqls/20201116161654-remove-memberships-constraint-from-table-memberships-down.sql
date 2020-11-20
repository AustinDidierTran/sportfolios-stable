/* Replace with your SQL commands */
ALTER TABLE memberships
  ADD CONSTRAINT memberships_pkey PRIMARY KEY(member_type,organization_id,person_id,created_at);