#! /usr/bin/env node

const { Client } = require('pg')

if (process.env.NODE_ENV != 'production')
    require('dotenv').config()


const SQL = `
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS session;

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    firstName VARCHAR (255) NOT NULL,
    lastName VARCHAR (255) NOT NULL,
    username VARCHAR (255) NOT NULL,
    password VARCHAR (255) NOT NULL,
    isMember BOOLEAN NOT NULL,
    isAdmin BOOLEAN DEFAULT false
)
;

CREATE TABLE IF NOT EXISTS messages (
    message_id SERIAL PRIMARY KEY,
    title VARCHAR (255) NOT NULL,
    message VARCHAR (255) NOT NULL,
    user_id INTEGER REFERENCES users ON DELETE CASCADE,
    timestamp VARCHAR (80) NOT NULL
)
;

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire")
;

INSERT INTO users (firstName, lastName, username, password, isMember, isAdmin) 
    VALUES
    (
     'aaa',
     'bbb',
     'admin1',
     '$2b$10$NQf1HT10AbwV6wcTnGIwu.cOsNNLObTq.lvtS6IvDBtxYsx2v711m',
      true,
      true
    ),
    (
     'Alice',
     'Bob',
     'user1',
     '$2b$10$TbT/HwJoIII2D8Naaa252.pRU3i5MpMIbzYg2jPumEya2HZGgB.JO',
      true,
      false
    ),
    (
     'Cat',
     'Dog',
     'user2',
     '$2b$10$1dzcTgwtUQYoGCdwKouFE.blADspBDLK8bKBu.v0yhJ/zTPKUZRFK',
      false,
      false
    ),
    (
     'Elephant',
     'Frog',
     'user3',
     '$2b$10$VfdPtR/NEYhF/7XgWHydle.R0I5SDenqo791978Y.oa4MAUovpmjy',
      false,
      false
    )

    
;

INSERT INTO messages (title, message, user_id, timestamp) 
    VALUES
    (
     'test-title1',
     'test-message1',
      1,
     '2024-06-16T05:43:55.022Z'
    ),
    (
     'user-title2',
     'user-message2',
      2,
     '2024-06-28T05:43:55.022Z'
    ),
    (
     'random title',
     'random -message',
      1,
     '2024-05-18T05:43:55.022Z'
    )
;


`

async function main() {
    console.log('creating table and populating')
    console.log(process.env.DB_URI)
    const client = new Client({
        // connectionString: "postgresql://<role_name>:<role_password>@localhost:5432/top_users",
        connectionString: process.env.DB_URI
    });

    await client.connect();
    await client.query(SQL);
    await client.end();

    console.log('done')
}

main()