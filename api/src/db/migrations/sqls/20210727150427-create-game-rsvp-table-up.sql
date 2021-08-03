/* Replace with your SQL commands */
CREATE TABLE game_rsvp (
  game_id UUID REFERENCES games(id) NOT NULL,
  person_id UUID REFERENCES entities(id),
  roster_id UUID REFERENCES team_rosters(id),
  is_sub BOOLEAN DEFAULT FALSE,
  status VARCHAR(255)
);

INSERT INTO game_rsvp (game_id, person_id, roster_id, is_sub, status)
    SELECT g.id, p.person_id, p.roster_id, p.is_sub, null
    FROM games g
        LEFT JOIN game_teams t ON g.id = t.game_id
        LEFT JOIN roster_players p ON t.roster_id = p.roster_id;



CREATE OR REPLACE FUNCTION check_for_new_game_players() RETURNS trigger LANGUAGE PLPGSQL as $$
BEGIN
    IF NEW.roster_id IN (SELECT roster_id FROM game_teams) THEN
        INSERT INTO game_rsvp (game_id, person_id, roster_id, is_sub, status)
        SELECT g.id, p.person_id, p.roster_id, p.is_sub, null
        FROM roster_players p
            LEFT JOIN game_teams t ON p.roster_id = t.roster_id
            LEFT JOIN games g ON t.game_id = g.id
        WHERE p.id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION check_for_new_game_roster() RETURNS trigger LANGUAGE PLPGSQL as $$
BEGIN
    IF NEW.roster_id IS NOT NULL THEN
        INSERT INTO game_rsvp (game_id, person_id, roster_id, is_sub, status)
        SELECT g.id, p.person_id, p.roster_id, p.is_sub, null
        FROM game_teams t
            LEFT JOIN games g ON t.game_id = g.id
            LEFT JOIN roster_players p ON t.roster_id = p.roster_id
        WHERE t.id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER game_team_insert AFTER
INSERT ON game_teams
FOR EACH ROW EXECUTE procedure check_for_new_game_roster();

CREATE TRIGGER game_team_update AFTER
UPDATE ON game_teams
FOR EACH ROW EXECUTE procedure check_for_new_game_roster();

CREATE TRIGGER game_player_insert AFTER
INSERT ON roster_players
FOR EACH ROW EXECUTE procedure check_for_new_game_players();

CREATE TRIGGER game_player_update AFTER
UPDATE ON roster_players
FOR EACH ROW EXECUTE procedure check_for_new_game_players();

DROP TABLE game_players_attendance;