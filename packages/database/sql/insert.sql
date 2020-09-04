BEGIN;

INSERT INTO businesses (id, name, registration_number)
VALUES (1, 'T4T', '234');
INSERT INTO businesses (id, name, registration_number)
VALUES (2, 'Alza', '123');
INSERT INTO businesses (id, name, registration_number)
VALUES (3, 'CZC', '345');

INSERT INTO people (id, name)
VALUES (1, 'Marek Lukáš');
INSERT INTO people (id, name)
VALUES (2, 'Petr Lukáš');
INSERT INTO people (id, name)
VALUES (3, 'Pepa Vomáčka');

INSERT INTO contacts (id, created_by_id, updated_by_id, email, phone, note)
VALUES (1, 1, 1, 'marek.lukas@email.cz', '+420123456789', 'Kontakt na Marka Lukáše');

INSERT INTO person_contacts (person_id, contact_id)
VALUES (1, 1);

INSERT INTO users (id, username, password_hash, person_id)
VALUES (1, 'marek.lukas', 'abc', 1);
INSERT INTO users (id, username, password_hash, person_id)
VALUES (2, 'petr.lukas', 'abc', 2);

INSERT INTO contractors (id, created_by_id, updated_by_id, person_id, business_id)
VALUES (1, 1, 1, 3, 2);

UPDATE contractors
SET business_id = 2
WHERE person_id = 3;
UPDATE contractors
SET business_id = 3
WHERE person_id = 3;

COMMIT;
