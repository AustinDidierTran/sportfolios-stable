/* Replace with your SQL commands */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE associations (id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, name VARCHAR(255) NOT NULL, deleted_at TIMESTAMP);

INSERT INTO associations (
  id,
  name
) VALUES (
  'd8c1c867-ecac-4ef0-8912-1f3102e481dc',
  'Association d''ultimate de Sherbrooke'
);
