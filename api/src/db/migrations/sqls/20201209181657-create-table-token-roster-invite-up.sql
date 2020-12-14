CREATE table token_roster_invite(token uuid primary key DEFAULT uuid_generate_v4(), roster_id uuid references TEAM_ROSTERS(id) not null, expires_at timestamp default now()+interval '1 month');

