CREATE TABLE facebook_data (
facebook_id bigint NOT NULL PRIMARY KEY,
email varchar(320),
name varchar(255),
surname varchar(255),
picture varchar
);

CREATE TABLE user_facebook_id (
user_id UUID NOT NULL PRIMARY KEY,
facebook_id bigint,
FOREIGN KEY (facebook_id) REFERENCES facebook_data(facebook_id),
FOREIGN KEY (user_id) REFERENCES users(id)
) ;
