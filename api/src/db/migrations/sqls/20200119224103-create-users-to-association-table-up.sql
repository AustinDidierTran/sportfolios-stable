/* Replace with your SQL commands */
CREATE TABLE user_to_association (
  user_id UUID REFERENCES users(id) NOT NULL,
  association_id UUID REFERENCES associations(id) NOT NULL,
  role INTEGER NOT NULL,
  PRIMARY KEY(user_id, association_id)
);

-- roles ENUM
-- 0: Owner
-- 1: Member

INSERT INTO user_to_association (user_id, association_id, role)
  VALUES (
    '318644a8-b90f-42dc-bb02-9f92b0fc1c1c',
    'd8c1c867-ecac-4ef0-8912-1f3102e481dc',
    0
  );
