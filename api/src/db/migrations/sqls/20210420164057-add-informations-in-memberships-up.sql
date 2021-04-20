/* Replace with your SQL commands */
ALTER TABLE memberships
  ADD COLUMN phone_number VARCHAR(11),
  ADD COLUMN emergency_name VARCHAR(255),
  ADD COLUMN emergency_surname VARCHAR(255),
  ADD COLUMN emergency_phone_number VARCHAR(11),
  ADD COLUMN medical_conditions TEXT;