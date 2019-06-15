-- Your SQL goes here
CREATE TABLE IF NOT EXISTS hashed_ips (
    id SERIAL PRIMARY KEY,
    hashed_ip VARCHAR NOT NULL UNIQUE
);

