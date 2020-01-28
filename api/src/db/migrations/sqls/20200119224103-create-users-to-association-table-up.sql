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
