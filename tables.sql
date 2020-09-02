CREATE TABLE IF NOT EXISTS user (
  id          bigint(20)   NOT NULL auto_increment,
  username    varchar(255),
  password    varchar(255),
  PRIMARY KEY (id)
) ENGINE=InnoDB;
;
CREATE TABLE IF NOT EXISTS patient (
  id          bigint(20)   NOT NULL auto_increment,
  name        varchar(255),
  PRIMARY KEY (id)
) ENGINE=InnoDB;
;
CREATE TABLE IF NOT EXISTS encounter (
  user_id     bigint references user(id),
  patient_id  bigint references patient(id),
  visit_date  datetime,
  field1      text,
  field2      text,
  field3      text
)
;
