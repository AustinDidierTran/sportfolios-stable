ALTER TABLE event_rosters
  DROP CONSTRAINT event_rosters_payment_option_id_fkey;

ALTER TABLE event_payment_options
  DROP CONSTRAINT event_payment_options_pkey;

ALTER TABLE event_payment_options ALTER COLUMN id DROP NOT NULL;

ALTER TABLE event_payment_options
  RENAME COLUMN price TO team_price;

ALTER TABLE event_payment_options
  RENAME COLUMN id TO team_stripe_price_id;

ALTER TABLE event_payment_options
  ADD COLUMN individual_price INT DEFAULT 0,
  ADD COLUMN individual_stripe_price_id VARCHAR(255) DEFAULT NULL,
  ADD COLUMN id UUID DEFAULT uuid_generate_v4() PRIMARY KEY;

UPDATE event_rosters SET 
  payment_option_id = (SELECT event_payment_options.id 
  FROM event_payment_options 
  WHERE event_rosters.payment_option_id = event_payment_options.team_stripe_price_id);

ALTER TABLE event_rosters ALTER COLUMN payment_option_id TYPE UUID USING payment_option_id::UUID;

ALTER TABLE event_rosters
  ADD FOREIGN KEY (payment_option_id) REFERENCES event_payment_options (id);