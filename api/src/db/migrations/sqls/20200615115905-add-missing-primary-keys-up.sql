ALTER TABLE entities_photo
  ADD CONSTRAINT entities_photo_pkey PRIMARY KEY (entity_id);

ALTER TABLE entities_role
  ADD CONSTRAINT entities_role_pkey PRIMARY KEY (entity_id, entity_id_admin);

ALTER TABLE game_teams
  ADD CONSTRAINT game_teams_pkey PRIMARY KEY (game_id);

ALTER TABLE phase_link
  ADD CONSTRAINT phase_link_pkey PRIMARY KEY (initial_phase, initial_position),
  ADD CONSTRAINT phase_link_ufinal UNIQUE (final_phase, final_position);
