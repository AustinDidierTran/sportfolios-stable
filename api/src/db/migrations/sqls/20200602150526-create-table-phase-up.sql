/* Replace with your SQL commands *//* Replace with your SQL commands */
CREATE TABLE divisions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  division_id UUID REFERENCES event_divisions(id) FOREIGN KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
);
