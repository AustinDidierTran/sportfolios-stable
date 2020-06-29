/* Replace with your SQL commands */
CREATE TABLE event_payment_options (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES events(id)NOT NULL,
  name VARCHAR(255) NOT NULL,
  price INTEGER NOT NULL,
  start_time TIMESTAMP DEFAULT now(),
  end_time TIMESTAMP
);