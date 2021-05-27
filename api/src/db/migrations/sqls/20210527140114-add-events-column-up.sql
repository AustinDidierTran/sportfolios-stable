/* Replace with your SQL commands */
ALTER TABLE events
  ADD COLUMN type VARCHAR(6) default 'team';
  
  
UPDATE events
  SET type = 'player'
  FROM (SELECT *
  FROM event_persons) AS subquery
  WHERE events.id = subquery.event_id;
