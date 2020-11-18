/* Replace with your SQL commands */
CREATE TABLE reports(
  report_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  entity_id UUID REFERENCES entities(id),
  type VARCHAR(255),
  metadata JSON
);