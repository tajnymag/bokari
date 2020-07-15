BEGIN;

CREATE TABLE IF NOT EXISTS files (
	id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	name text NOT NULL,
	hash text NOT NULL,
	uploaded_by_id integer NOT NULL REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS company_settings (
	id integer PRIMARY KEY NOT NULL,
	name text NOT NULL,
	locale text NOT NULL DEFAULT 'en',
	logo_id integer NOT NULL REFERENCES files (id)
);

CREATE TABLE IF NOT EXISTS preferences (
	id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	preferred_locale text NOT NULL DEFAULT 'en'
);

CREATE TABLE IF NOT EXISTS addresses (
	id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	city_name text NOT NULL,
	street_name text NOT NULL,
	street_number text NOT NULL,
	zip text NOT NULL
);

CREATE TABLE IF NOT EXISTS biographies (
	id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	full_name text NOT NULL,
	email text,
	address_id integer REFERENCES addresses (id)
);

CREATE TABLE IF NOT EXISTS users (
	id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	username text NOT NULL,
	password_hash text NOT NULL,
	biography_id integer NOT NULL REFERENCES biographies (id),
	preferences_id integer NOT NULL REFERENCES preferences (id)
);

CREATE TABLE IF NOT EXISTS contracts (
	id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	code text NOT NULL,
	made_by_id integer NOT NULL REFERENCES users (id),
	responsible_user_id integer NOT NULL REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS contract_assignees (
	user_id integer NOT NULL,
	contract_id integer NOT NULL,
	PRIMARY KEY (user_id, contract_id)
);

COMMIT;
