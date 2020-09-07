INSERT INTO users (username, password) values ('niels', '1234');
INSERT INTO users (username, password) values ('sinterklaas', '1234');

INSERT INTO patients (name) values ('Elvis Presley');
INSERT INTO patients (name) values ('Janis Joplin');
INSERT INTO patients (name) values ('Mick Jagger');
INSERT INTO patients (name) values ('Jim Morrison');

INSERT INTO encounters (user_id, patient_id, visit_date, history, physical, plan) values (1, 1, '2020-02-09 16:30', 'aap', 'noot', 'mies');
INSERT INTO encounters (user_id, patient_id, visit_date, history, physical, plan) values (2, 1, '2020-09-03 14:07', 'wim', 'zus', 'jet');
