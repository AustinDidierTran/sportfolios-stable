ALTER TABLE event_rosters
  DROP CONSTRAINT event_rosters_payment_option_id_fkey;

ALTER TABLE event_rosters ALTER COLUMN payment_option_id TYPE VARCHAR(255);

UPDATE event_rosters SET
  payment_option_id = (SELECT event_payment_options.team_stripe_price_id
  FROM event_payment_options
  WHERE event_rosters.payment_option_id = event_payment_options.id::text);

ALTER TABLE event_payment_options
  DROP CONSTRAINT event_payment_options_pkey,
  DROP COLUMN individual_price,
  DROP COLUMN individual_stripe_price_id,
  DROP COLUMN id;


ALTER TABLE event_payment_options
  RENAME COLUMN team_stripe_price_id TO id;

ALTER TABLE event_payment_options
  RENAME COLUMN team_price TO price;

ALTER TABLE event_payment_options ALTER COLUMN id SET NOT NULL;

ALTER TABLE event_payment_options
  ADD PRIMARY KEY (id);

ALTER TABLE event_rosters
  ADD FOREIGN KEY (payment_option_id) REFERENCES event_payment_options (id);
