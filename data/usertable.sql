create table users
(
	id serial,
	username varchar(50) not null,
	firstname varchar(50) not null,
	lastname varchar(50) not null,
	email varchar(100) not null,
	password_hashed varchar(50) not null,
	regdate date not null
);

create unique index users_email_uindex
	on users (email);

create unique index users_username_uindex
	on users (username);

alter table users
	add constraint users_pk
		primary key (username);

