CREATE OR REPLACE VIEW person_all_infos as SELECT id, name, surname, photo_url, birth_date, type FROM entities_all_infos WHERE type = 1;
