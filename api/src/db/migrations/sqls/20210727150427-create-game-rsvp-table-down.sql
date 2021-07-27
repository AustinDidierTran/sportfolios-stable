/* Replace with your SQL commands */
DROP TABLE game_rsvp;

CREATE TABLE GAME_PLAYERS_ATTENDANCE AS
SELECT PLAYER_ID,
       GAME_ID,
       ROSTER_ID
FROM GAME_PLAYERS_VIEW;

DROP TRIGGER game_team_insert on game_teams;
DROP TRIGGER game_team_update on game_teams;
DROP FUNCTION check_for_new_game_roster;

DROP TRIGGER game_player_insert on roster_players;
DROP TRIGGER game_player_update on roster_players;
DROP FUNCTION check_for_new_game_players;
