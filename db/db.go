package db

import (
	"database/sql"
	"time"

	_ "github.com/go-sql-driver/mysql"

	Config "myemr/config"
)

type User struct {
	ID       int
	Username string
	Password string
}

type Patient struct {
	ID   int
	Name string
}

type Encounter struct {
	ID        int
	UserID    int
	PatientID int
	VisitDate time.Time
	Field1    string
	Field2    string
	Field3    string
}

func getDbConnection() *sql.DB {
	var db, errdb = Config.ConnectDb()
	errorCheck(errdb)
	return db
}

func errorCheck(err error) {
	if err != nil {
		panic(err.Error())
	}
}

func GetUserByName(username string) (User, bool) {
	db := getDbConnection()
	defer db.Close()

	// query all data
	rows, err := db.Query("select id, username, password from user where username=?", username)
	errorCheck(err)

	u := User{}
	if rows.Next() {
		err = rows.Scan(&u.ID, &u.Username, &u.Password)
		errorCheck(err)

		return u, true
	} else {
		// User not found
		return u, false
	}
}

func GetUserByID(userID int) (User, bool) {
	db := getDbConnection()
	defer db.Close()

	// query all data
	rows, err := db.Query("select id, username, password from user where id=?", userID)
	errorCheck(err)

	u := User{}
	rows.Next()
	err = rows.Scan(&u.ID, &u.Username, &u.Password)
	if err == nil {
		return u, true
	} else {
		return u, false
	}
}

func GetPatients() []Patient {
	db := getDbConnection()
	defer db.Close()

	rows, err := db.Query("select id, name from patient")
	errorCheck(err)

	patients := []Patient{}
	for rows.Next() {
		var p = Patient{}
		err = rows.Scan(&p.ID, &p.Name)
		errorCheck(err)
		patients = append(patients, p)
	}
	return patients
}

func GetPatientByID(patientID int) Patient {
	db := getDbConnection()
	defer db.Close()

	rows, err := db.Query("select id, name from patient where id=?", patientID)
	errorCheck(err)

	p := Patient{}
	rows.Next()
	err = rows.Scan(&p.ID, &p.Name)
	errorCheck(err)

	return p
}

func GetEncountersByPatientID(patientID int) []Encounter {
	db := getDbConnection()
	defer db.Close()

	rows, err := db.Query("select id, user_id, patient_id, visitdate, field1, field2, field3 from encounter where user_id=1 and patient_id=?", patientID)
	errorCheck(err)

	encounters := []Encounter{}
	for rows.Next() {
		var e = Encounter{}
		err = rows.Scan(&e.ID, &e.UserID, &e.PatientID, &e.VisitDate, &e.Field1, &e.Field2, &e.Field3)
		errorCheck(err)
		encounters = append(encounters, e)
	}
	return encounters
}

func GetEncounterByID(encounterID int) Encounter {
	db := getDbConnection()
	defer db.Close()

	rows, err := db.Query("select id,  user_id, patient_id, visitdate, field1, field2, field3 from encounter where id=?", encounterID)
	errorCheck(err)

	e := Encounter{}
	rows.Next()
	err = rows.Scan(&e.ID, &e.UserID, &e.PatientID, &e.VisitDate, &e.Field1, &e.Field2, &e.Field3)
	errorCheck(err)

	return e
}
