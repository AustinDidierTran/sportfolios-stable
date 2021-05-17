/* Replace with your SQL commands */
ALTER TABLE events
  ADD COLUMN start_time VARCHAR (255),
  ADD COLUMN end_time VARCHAR (255);

UPDATE events SET 
  start_time=start_date::time, 
  end_time=end_date::time;