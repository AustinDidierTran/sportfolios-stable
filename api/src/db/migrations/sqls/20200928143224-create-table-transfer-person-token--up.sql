CREATE TABLE transfered_person ( 
token UUID NOT NULL PRIMARY KEY,
email varchar(320) NOT NULL,
person_id UUID REFERENCES entities(id) NOT NULL,
expires_at timestamp
);
