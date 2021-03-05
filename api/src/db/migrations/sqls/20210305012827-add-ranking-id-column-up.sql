/* Replace with your SQL commands */
ALTER TABLE phase_rankings 
ADD COLUMN ranking_id UUID DEFAULT uuid_generate_v4();
