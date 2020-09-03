BEGIN;

INSERT INTO businesses (id, name, registration_number) VALUES (1, 'T4T', '234');
INSERT INTO businesses (id, name, registration_number) VALUES (2, 'Alza', '123');
INSERT INTO businesses (id, name, registration_number) VALUES (3, 'CZC', '345');

INSERT INTO people (id, name) VALUES (1, 'Marek Lukáš');
INSERT INTO people (id, name) VALUES (2, 'Petr Lukáš');
INSERT INTO people (id, name) VALUES (3, 'Pepa Vomáčka');

INSERT INTO users (id, username, password_hash, person_id) VALUES (1, 'marek.lukas', 'abc', 1);
INSERT INTO users (id, username, password_hash, person_id) VALUES (2, 'petr.lukas', 'abc', 2);

INSERT INTO contractors (created_by_id, updated_by_id, person_id, business_id) VALUES (
    (SELECT id FROM users WHERE username = 'marek.lukas'),
    (SELECT id FROM users WHERE username = 'marek.lukas'),
    (SELECT id FROM people WHERE name = 'Pepa Vomáčka'),
    (SELECT id FROM businesses WHERE name = 'Alza')
);

UPDATE contractors SET business_id = (SELECT id FROM businesses WHERE name = 'T4T') WHERE person_id = (SELECT id FROM people WHERE name LIKE 'Pepa%');
UPDATE contractors SET business_id = (SELECT id FROM businesses WHERE name = 'CZC') WHERE person_id = (SELECT id FROM people WHERE name LIKE 'Pepa%');

COMMIT;
