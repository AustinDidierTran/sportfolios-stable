CREATE VIEW game_players_view as
SELECT USER_ID as player_owner,
       PERSON_ID as player_id,
       GAME_ID,
       EVENT_ID,
       TIMESLOT,
       ROSTER_ID,
       ROLE as player_role
FROM (
        (SELECT USER_ID,
                ENTITY_ID
         FROM USER_ENTITY_ROLE
         WHERE ROLE = 1) AS T4
      JOIN (
              (SELECT PERSON_ID,
                      ROSTER_ID as rost_id,
                      role
               FROM TEAM_PLAYERS)AS T3
            JOIN
              (SELECT ID AS GAME_ID,
                      EVENT_ID,
                      TIMESLOT,
                      ROSTER_ID
               FROM (GAMES_ALL_INFOS
                     JOIN
                       (SELECT ROSTER_ID,
                               GAME_ID
                        FROM GAME_TEAMS) AS T1 ON GAMES_ALL_INFOS.ID = T1.GAME_ID))AS T2 ON T3.ROST_id = T2.ROSTER_ID) AS T5 ON T4.ENTITY_ID = T5.PERSON_ID)