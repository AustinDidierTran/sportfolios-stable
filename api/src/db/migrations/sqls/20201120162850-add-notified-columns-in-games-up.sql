ALTER TABLE games ADD COLUMN notified_start timestamp,
                                            ADD COLUMN notified_end timestamp;


DROP VIEW game_players_view;


DROP VIEW games_all_infos;


CREATE OR REPLACE VIEW public.games_all_infos AS
SELECT events.id AS event_id,
       entities_name.name AS event_name,
       games.id,
       event_time_slots.date AS timeslot,
       event_fields.field,
       games.notified_end,
       games.notified_start
FROM events
LEFT JOIN entities_name ON events.id = entities_name.entity_id
LEFT JOIN games ON events.id = games.event_id
LEFT JOIN event_time_slots ON event_time_slots.id = games.timeslot_id
LEFT JOIN event_fields ON event_fields.id = games.field_id;


CREATE OR REPLACE VIEW public.game_players_view AS
SELECT t4.user_id AS player_owner,
       t5.person_id AS player_id,
       t5.game_id,
       t5.event_id,
       t5.timeslot,
       t5.roster_id,
       t5.notified_end,
       t5.notified_start,
       t5.event_name,
       t5.role AS player_role
FROM
  (SELECT user_entity_role.user_id,
          user_entity_role.entity_id
   FROM user_entity_role
   WHERE user_entity_role.role = 1) t4
JOIN (
        (SELECT team_players.person_id,
                team_players.roster_id AS rost_id,
                team_players.role
         FROM team_players) t3
      JOIN
        (SELECT games_all_infos.id AS game_id,
                games_all_infos.event_id,
                games_all_infos.timeslot,
                games_all_infos.notified_end,
                games_all_infos.notified_start,
                games_all_infos.event_name,
                t1.roster_id
         FROM games_all_infos
         JOIN
           (SELECT game_teams.roster_id,
                   game_teams.game_id
            FROM game_teams) t1 ON games_all_infos.id = t1.game_id) t2 ON t3.rost_id = t2.roster_id) t5 ON t4.entity_id = t5.person_id;