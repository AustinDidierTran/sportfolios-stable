ALTER TABLE phase_link
  DROP CONSTRAINT phase_link_ufinal,
  DROP CONSTRAINT phase_link_pkey;

ALTER TABLE game_teams
  DROP CONSTRAINT game_teams_pkey;

ALTER TABLE entities_role
  DROP CONSTRAINT entities_role_pkey;

ALTER TABLE entities_photo
  DROP CONSTRAINT entities_photo_pkey;