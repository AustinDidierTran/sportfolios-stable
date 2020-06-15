CREATE TABLE sports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, 
  name VARCHAR(255) NOT NULL, 
  score_type integer NOT NULL,
  deleted_at TIMESTAMP
);

CREATE RULE delete_sport AS ON DELETE TO sports
DO INSTEAD
(UPDATE sports SET deleted_at = now() WHERE sports.id = old.id;
)