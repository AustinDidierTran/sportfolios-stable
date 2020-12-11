/* Replace with your SQL commands */
CREATE TABLE event_persons(
  person_id UUID REFERENCES entities(id) NOT NULL,
  event_id UUID REFERENCES events(id) NOT NULL,
  invoice_item_id VARCHAR(255),
  status VARCHAR(255),
  registration_status VARCHAR(255) NOT NULL DEFAULT 'accepted',
  payment_option_id UUID REFERENCES event_payment_options(id),
  PRIMARY KEY(person_id,event_id)
)