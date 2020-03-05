/* Replace with your SQL commands */
CREATE TABLE user_app_role (
  user_id VARCHAR(255) NOT NULL PRIMARY KEY,
  app_role integer NOT NULL
);

-- Password is Salut123
INSERT INTO users(id, password) VALUES ('8317ff33-3b04-49a1-afd3-420202cddf73' ,'$2b$10$ihEC0KlQ3lbUwn/DqFGH6ukZRCn5vD0bgw6yLY5AnvryNIWWXC78G');

INSERT INTO user_email(user_id, email, confirmed_email_at) VALUES ('8317ff33-3b04-49a1-afd3-420202cddf73', 'austindidier@sportfolios.app', now());

INSERT INTO user_info(user_id, first_name, last_name) VALUES ('8317ff33-3b04-49a1-afd3-420202cddf73', 'Austin-Didier', 'Tran');

-- 1: Super admin of all time
INSERT INTO user_app_role(user_id, app_role) VALUES ('8317ff33-3b04-49a1-afd3-420202cddf73', 1);