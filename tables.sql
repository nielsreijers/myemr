CREATE TABLE IF NOT EXISTS user (
  id          bigint(20)   NOT NULL auto_increment,
  username    varchar(255),
  password    varchar(255),
  PRIMARY KEY (id)
) ENGINE=InnoDB;

INSERT INTO user (username, password) values ('niels', '');

CREATE TABLE IF NOT EXISTS patient (
  id          bigint(20)   NOT NULL auto_increment,
  name        varchar(255),
  PRIMARY KEY (id)
) ENGINE=InnoDB;

INSERT INTO patient (name) values ('Elvis Presley');
INSERT INTO patient (name) values ('Janis Joplin');
INSERT INTO patient (name) values ('Mick Jaggers');
INSERT INTO patient (name) values ('Jim Morrison');

CREATE TABLE IF NOT EXISTS encounter (
  id          bigint(20)   NOT NULL auto_increment,
  user_id     bigint references user(id),
  patient_id  bigint references patient(id),
  visitdate  datetime,
  field1      text,
  field2      text,
  field3      text
) ENGINE=InnoDB;

INSERT INTO encounter (user_id, patient_id, visitdate, field1, field2, field3) values (1, 1, '2020-02-09 16:30', 'aap', 'noot', 'mies');
