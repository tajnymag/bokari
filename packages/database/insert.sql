INSERT INTO businesses (name, registration_number) VALUES ('Alza', '123');
INSERT INTO businesses (name, registration_number) VALUES ('T4T', '234');
INSERT INTO businesses (name, registration_number) VALUES ('CZC', '345');

INSERT INTO people (name) VALUES ('Pepa Vomáčka');
INSERT INTO people (name) VALUES ('Marek Lukáš');
INSERT INTO people (name) VALUES ('Petr Lukáš');

INSERT INTO users (username, password_hash, person_id) VALUES ('marek.lukas', 'abc', 2);
INSERT INTO users (username, password_hash, person_id) VALUES ('petr.lukas', 'abc', 3);

INSERT INTO contractors (created_by_id, updated_by_id, person_id, business_id) VALUES (1, 1, 1, 1);

UPDATE contractors SET business_id = 2 WHERE id = 1;
UPDATE contractors SET business_id = 3 WHERE id = 1;
