--
-- PostgreSQL database Proman
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET default_tablespace = '';

SET default_with_oids = false;

---
--- drop tables
---

DROP TABLE IF EXISTS statuses CASCADE;
DROP TABLE IF EXISTS boards CASCADE;
DROP TABLE IF EXISTS cards;

---
--- create tables
---

CREATE TABLE statuses (
    id       SERIAL PRIMARY KEY     NOT NULL,
    title    VARCHAR(200)           NOT NULL,
    board_id    INTEGER             NOT NULL
);

CREATE TABLE boards (
    id          SERIAL PRIMARY KEY  NOT NULL,
    title       VARCHAR(200)        NOT NULL,
    user_id integer
		constraint boards_users_id_fk
			references users
				on delete cascade
);

CREATE TABLE cards (
    id          SERIAL PRIMARY KEY  NOT NULL,
    board_id    INTEGER             NOT NULL,
    status_id   INTEGER             NOT NULL,
    title       VARCHAR (200)       NOT NULL,
    card_order  INTEGER             NOT NULL
);

---
--- insert data
---

INSERT INTO statuses VALUES (1, 'new', 1);
INSERT INTO statuses VALUES (2, 'in progress', 1);
INSERT INTO statuses VALUES (3, 'testing', 1);
INSERT INTO statuses VALUES (4, 'done', 1);

INSERT INTO statuses VALUES (5, 'new', 2);
INSERT INTO statuses VALUES (6, 'in progress', 2);
INSERT INTO statuses VALUES (7, 'testing', 2);
INSERT INTO statuses VALUES (8, 'done', 2);

INSERT INTO boards(title) VALUES ('Board 1');
INSERT INTO boards(title) VALUES ('Board 2');

INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 1, 'new card 1', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 1, 'new card 2', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 2, 'in progress card', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 3, 'planning', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 4, 'done card 1', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 4, 'done card 1', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 5, 'new card 1', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 5, 'new card 2', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 6, 'in progress card', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 7, 'planning', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 8, 'done card 1', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 8, 'done card 1', 2);

---
--- add constraints
---

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_board_id FOREIGN KEY (board_id) REFERENCES boards(id);

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_status_id FOREIGN KEY (status_id) REFERENCES statuses(id);

ALTER TABLE ONLY statuses
    ADD CONSTRAINT fk_statuses_board_id FOREIGN KEY (board_id) REFERENCES boards(id);

alter table cards drop constraint fk_cards_board_id;

alter table cards
	add constraint fk_cards_board_id
		foreign key (board_id) references boards
			on delete cascade;



DROP TABLE IF EXISTS linkingBoardStatus;