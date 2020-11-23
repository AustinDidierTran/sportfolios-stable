CREATE TABLE user_notification_setting AS
SELECT *
from (
        (select id as user_id
         from users) as t1
      cross join
        (select DISTINCT type
         from notifications) as t2);


ALTER TABLE user_notification_setting ADD PRIMARY KEY (user_id,
                                                       type), ADD
FOREIGN KEY (user_id) REFERENCES users(id) ON
DELETE CASCADE,
ALTER COLUMN type
SET NOT NULL,
    ADD COLUMN email BOOLEAN default true,
                                     ADD COLUMN chatbot BOOLEAN default false;