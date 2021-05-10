/* Replace with your SQL commands */
ALTER TABLE memberships
  ADD COLUMN heard_organization VARCHAR(255),
  ADD COLUMN frequented_school VARCHAR(255),
  ADD COLUMN job_title VARCHAR(255),
  ADD COLUMN employer VARCHAR(255),
  ADD COLUMN getting_involved BOOLEAN;
