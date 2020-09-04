encounterCREATE TABLE IF NOT EXISTS user (
  id          bigint(20) not null auto_increment,
  username    varchar(255),
  password    varchar(255),
  PRIMARY KEY (id)
) ENGINE=InnoDB;

INSERT INTO user (username, password) values ('niels', '1234');
INSERT INTO user (username, password) values ('sinterklaas', '1234');

CREATE TABLE IF NOT EXISTS patient (
  id          bigint(20) not null auto_increment,
  name        varchar(255) not null,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

INSERT INTO patient (name) values ('Elvis Presley');
INSERT INTO patient (name) values ('Janis Joplin');
INSERT INTO patient (name) values ('Mick Jaggers');
INSERT INTO patient (name) values ('Jim Morrison');

CREATE TABLE IF NOT EXISTS encounter (
  id          bigint(20) not null auto_increment,
  user_id     bigint not null references user(id),
  patient_id  bigint not null references patient(id),
  visitdate   datetime not null,
  history     text not null default '',
  physical    text not null default '',
  plan        text not null default '',
  PRIMARY KEY (id)
) ENGINE=InnoDB;

INSERT INTO encounter (user_id, patient_id, visitdate, history, physical, plan) values (1, 1, '2020-02-09 16:30', 'aap', 'noot', 'mies');
INSERT INTO encounter (user_id, patient_id, visitdate, history, physical, plan) values (2, 1, '2020-09-03 14:07', 'wim', 'zus', 'jet');


