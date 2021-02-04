/* Replace with your SQL commands */
CREATE TABLE posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  entity_id UUID,
  content TEXT NOT NULL,
  CONSTRAINT fk_entity
    FOREIGN KEY(entity_id)
      REFERENCES entities(id)
);

CREATE TABLE post_image(
  post_id UUID NOT NULL,
  photo_url VARCHAR (255),
  CONSTRAINT fk_posts
    FOREIGN KEY(post_id)
      REFERENCES posts(id)
);

CREATE TABLE post_comment (
  id UUID default uuid_generate_v4() PRIMARY KEY,
  post_id UUID,
  content TEXT NOT NULL,
  parent_id UUID,
  CONSTRAINT fk_posts
    FOREIGN KEY(post_id)
      REFERENCES posts(id),
  CONSTRAINT fk_parent
    FOREIGN KEY(parent_id)
      REFERENCES post_comment(id)
);

CREATE TABLE post_like (
  entity_id UUID,
  post_id UUID,
  CONSTRAINT fk_entity
    FOREIGN KEY(entity_id)
      REFERENCES entities(id),
  CONSTRAINT fk_posts
    FOREIGN KEY(post_id)
      REFERENCES posts(id),
  PRIMARY KEY (entity_id, post_id)
);