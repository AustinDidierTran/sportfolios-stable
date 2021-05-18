/* Replace with your SQL commands */
ALTER TABLE events
  ADD COLUMN start_varchar VARCHAR (255),
  ADD COLUMN end_varchar VARCHAR (255);

UPDATE events SET 
  start_varchar=start_date, 
  end_varchar=end_date;