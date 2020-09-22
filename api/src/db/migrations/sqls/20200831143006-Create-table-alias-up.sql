/* Replace with your SQL commands */

CREATE TABLE alias( 
  id UUID DEFAULT uuid_generate_v4() NOT NULL, 
  alias VARCHAR(255) NOT NULL,
  PRIMARY KEY(id, alias));
