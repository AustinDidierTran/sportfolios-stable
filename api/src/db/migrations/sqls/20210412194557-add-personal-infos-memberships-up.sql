/* Replace with your SQL commands */
ALTER TABLE memberships
  ADD COLUMN birth_date VARCHAR(255),
  ADD COLUMN street_address VARCHAR(255), 
  ADD COLUMN city VARCHAR(255),
  ADD COLUMN state  VARCHAR(255),
  ADD COLUMN zip VARCHAR(255),
  ADD COLUMN country VARCHAR(255),
  ADD COLUMN gender VARCHAR(6) CHECK (gender in ('Male', 'Female', 'Other'));

