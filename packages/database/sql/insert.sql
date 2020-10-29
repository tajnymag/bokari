BEGIN;

INSERT INTO businesses (id, name, registration_number)
VALUES (1, 'T4T', '234'),
       (2, 'Alza', '123'),
       (3, 'CZC', '345');
SELECT setval('businesses_id_seq', (SELECT max(id) from businesses));

INSERT INTO people (id, name)
VALUES (1, 'Marek Lukáš'),
       (2, 'Petr Lukáš'),
       (3, 'Pepa Vomáčka');
SELECT setval('people_id_seq', (SELECT max(id) from people));

INSERT INTO contacts (id, created_by_id, updated_by_id, email, phone, note)
VALUES (1, 1, 1, 'marek.lukas@email.cz', '+420123456789', 'Kontakt na Marka Lukáše');
SELECT setval('contacts_id_seq', (SELECT max(id) from contacts));

INSERT INTO person_contacts (person_id, contact_id)
VALUES (1, 1);

INSERT INTO users (id, username, password_hash, person_id)
VALUES (1, 'marek.lukas', '$argon2i$v=19$m=4096,t=3,p=1$YqT0JkcemErz4F0tfVOG/g$jsg+j4UiLEvVnY+Yqhet2UYcTzJo4eqgBiTfG2tdmko', 1),
       (2, 'petr.lukas', '$argon2i$v=19$m=4096,t=3,p=1$YqT0JkcemErz4F0tfVOG/g$jsg+j4UiLEvVnY+Yqhet2UYcTzJo4eqgBiTfG2tdmko', 2);
SELECT setval('users_id_seq', (SELECT max(id) from users));

INSERT INTO contractors (id, created_by_id, updated_by_id, person_id, business_id)
VALUES (1, 1, 1, 3, 2);
SELECT setval('contractors_id_seq', (SELECT max(id) from contractors));

INSERT INTO permissions (id, name, bit)
VALUES (1, 'USERS_READ', 1),
       (2, 'USERS_WRITE', 2),
       (3, 'FINANCES_READ', 4),
       (4, 'FINANCES_WRITE', 8),
       (5, 'CONTRACTS_READ', 16),
       (6, 'CONTRACTS_WRITE', 32);
SELECT setval('permissions_id_seq', (SELECT max(id) from permissions));

INSERT INTO groups (id, name)
VALUES (1, 'Administrators'),
       (2, 'Employee'),
       (3, 'Accountants');
SELECT setval('groups_id_seq', (SELECT max(id) from groups));

INSERT INTO group_permissions (group_id, permission_id)
VALUES (1, 1),
       (1, 2),
       (1, 3),
       (1, 4),
       (1, 5),
       (1, 6),
       (2, 5),
       (2, 6),
       (3, 3),
       (3, 4);

INSERT INTO group_users (user_id, group_id)
VALUES (1, 1),
       (2, 2);

UPDATE contractors
SET business_id = 2
WHERE person_id = 3;
UPDATE contractors
SET business_id = 3
WHERE person_id = 3;

COMMIT;
