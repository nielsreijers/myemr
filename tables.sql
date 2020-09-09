-- default password 1234 with empty salt
USE myemr;
INSERT INTO users (username, salt, password) values ('niels', '', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4');
INSERT INTO users (username, salt, password) values ('sinterklaas', '', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4');

INSERT INTO patients (name) values ('Elvis Presley');
INSERT INTO patients (name) values ('Janis Joplin');
INSERT INTO patients (name) values ('Mick Jagger');
INSERT INTO patients (name) values ('Jim Morrison');

INSERT INTO encounters (user_id, patient_id, visit_date, history, physical, plan) values (1, 1, '2020-02-09 16:30', 'aap', 'noot', 'mies');
INSERT INTO encounters (user_id, patient_id, visit_date, history, physical, plan) values (2, 1, '2020-09-03 14:07', 'wim', 'zus', 'jet');
