/* Replace with your SQL commands */
ALTER TABLE users
  ADD COLUMN first_name VARCHAR
(255),
ADD COLUMN last_name VARCHAR
(255);

UPDATE users
  SET first_name = subquery.first_name, last_name = subquery.last_name
  FROM (SELECT *
  FROM user_info) AS subquery
  WHERE users.id = subquery.user_id;

-- ALTER TABLE users
--   ALTER COLUMN first_name SET NOT NULL,
--   ALTER COLUMN last_name SET NOT NULL;

DROP TABLE user_info;
