/* Replace with your SQL commands */
CREATE TABLE divisions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES events(id) NOT NULL,
  name VARCHAR(255) NOT NULL,
);
