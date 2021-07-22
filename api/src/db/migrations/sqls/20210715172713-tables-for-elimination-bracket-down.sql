/* Replace with your SQL commands */
DROP TABLE elimination_bracket;

ALTER TABLE game_teams
  ADD CONSTRAINT game_teams_ranking_id_fkey FOREIGN KEY (ranking_id) REFERENCES phase_rankings(ranking_id);