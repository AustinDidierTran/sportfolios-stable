/* Replace with your SQL commands */
CREATE TABLE posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  entity_id UUID REFERENCES entities(id) NOT NULL,
  content TEXT NOT NULL
);

CREATE TABLE post_image(
  post_id UUID REFERENCES posts(id) NOT NULL,
  image_url VARCHAR (255)
      
);

CREATE TABLE post_comment (
  id UUID default uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) NOT NULL,
  entity_id UUID REFEREnCES entities(id) NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES post_comment(id)
);

CREATE TABLE post_like (
  entity_id UUID REFERENCES entities(id) NOT NULL,
  post_id UUID REFERENCES posts(id) NOT NULL,
  PRIMARY KEY (entity_id, post_id)
);