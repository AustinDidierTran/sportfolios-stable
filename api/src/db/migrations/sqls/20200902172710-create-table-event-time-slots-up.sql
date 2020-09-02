/* Replace with your SQL commands */
CREATE TABLE event_time_slots (
  event_id UUID REFERENCES entities(id) NOT NULL, 
  date TIMESTAMP NOT NULL, 
  PRIMARY KEY(event_id, date)
);