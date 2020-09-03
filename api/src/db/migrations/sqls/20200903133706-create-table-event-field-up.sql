/* Replace with your SQL commands */
CREATE TABLE event_fields (
  event_id UUID REFERENCES entities(id) NOT NULL,
  field VARCHAR(255) NOT NULL,
  PRIMARY KEY(event_id, field)
);