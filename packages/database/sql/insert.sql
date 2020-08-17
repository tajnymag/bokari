BEGIN;

INSERT INTO businesses (name, registration_number) VALUES ('Alza', '123');
INSERT INTO businesses (name, registration_number) VALUES ('T4T', '234');
INSERT INTO businesses (name, registration_number) VALUES ('CZC', '345');

INSERT INTO people (name) VALUES ('Pepa Vomáčka');
INSERT INTO people (name) VALUES ('Marek Lukáš');
INSERT INTO people (name) VALUES ('Petr Lukáš');

INSERT INTO users (username, password_hash, person_id) VALUES ('marek.lukas', 'abc', (
    SELECT id FROM people WHERE name = 'Pepa Vomáčka')
);
INSERT INTO users (username, password_hash, person_id) VALUES ('petr.lukas', 'abc', (
    SELECT id FROM people WHERE name = 'Petr Lukáš')
);

INSERT INTO contractors (created_by_id, updated_by_id, person_id, business_id) VALUES (
    (SELECT id FROM users WHERE username = 'marek.lukas'),
    (SELECT id FROM users WHERE username = 'marek.lukas'),
    (SELECT id FROM people WHERE name = 'Pepa Vomáčka'),
    (SELECT id FROM businesses WHERE name = 'Alza')
);

UPDATE contractors SET business_id = (SELECT id FROM businesses WHERE name = 'T4T') WHERE person_id = (SELECT id FROM people WHERE name LIKE 'Pepa%');
UPDATE contractors SET business_id = (SELECT id FROM businesses WHERE name = 'CZC') WHERE person_id = (SELECT id FROM people WHERE name LIKE 'Pepa%');

COMMIT;
