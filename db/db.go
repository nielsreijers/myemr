package db

import (
	"time"

	"gorm.io/gorm"

	Config "myemr/config"
)

type User struct {
	gorm.Model
	Username   string `gorm:"unique;not null"`
	Password   string `gorm:"not null"`
	Encounters []Encounter
}

type Patient struct {
	gorm.Model
	Name       string `gorm:"not null"`
	Encounters []Encounter
}

type Encounter struct {
	gorm.Model
	UserID    uint      `gorm:"not null"`
	User      User      ``
	PatientID uint      `gorm:"not null"`
	Patient   Patient   ``
	VisitDate time.Time `gorm:"not null"`
	History   string    `gorm:"not null"`
	Physical  string    `gorm:"not null"`
	Plan      string    `gorm:"not null"`
}

func getDbConnection() *gorm.DB {
	var db, errdb = Config.ConnectDb()
	errorCheck(errdb)
	return db
}

func AutoMigrate() {
	db := getDbConnection()
	errorCheck(db.AutoMigrate(&User{}))
	errorCheck(db.AutoMigrate(&Patient{}))
	errorCheck(db.AutoMigrate(&Encounter{}))
}

func errorCheck(err error) {
	if err != nil {
		panic(err.Error())
	}
}

func GetUserByName(username string) (User, bool) {
	db := getDbConnection()

	var user User
	result := db.First(&user, "username = ?", username)
	errorCheck(result.Error)

	if result.RowsAffected == 1 {
		return user, true
	} else {
		return user, false
	}
}

func GetUserByID(userID uint) (User, bool) {
	db := getDbConnection()

	var user User
	result := db.First(&user, userID)
	errorCheck(result.Error)

	if result.RowsAffected == 1 {
		return user, true
	} else {
		return user, false
	}
}

func AddPatient(name string) uint {
	db := getDbConnection()

	patient := Patient{Name: name}
	result := db.Create(&patient)
	errorCheck(result.Error)

	return patient.ID
}

func GetPatients() []Patient {
	db := getDbConnection()

	var patients []Patient
	result := db.Find(&patients)
	errorCheck(result.Error)

	return patients
}

func GetPatientByID(patientID uint) Patient {
	db := getDbConnection()

	var patient Patient
	result := db.First(&patient, patientID)
	errorCheck(result.Error)

	return patient
}

func AddEncounter(patientID uint, currentUser User) uint {
	db := getDbConnection()

	encounter := Encounter{
		PatientID: patientID,
		UserID:    currentUser.ID,
		VisitDate: time.Now(),
	}

	result := db.Create(&encounter) // pass pointer of data to Create
	errorCheck(result.Error)

	return encounter.ID
}

func GetEncountersByPatientID(patientID uint) []Encounter {
	db := getDbConnection()

	var encounters []Encounter

	result := db.Find(&encounters, "patient_id = ?", patientID)
	errorCheck(result.Error)

	return encounters
}

func GetEncounterByID(encounterID uint) Encounter {
	db := getDbConnection()

	var encounter Encounter
	result := db.First(&encounter, encounterID)
	errorCheck(result.Error)

	return encounter
}

func SaveEncounter(encounter Encounter) {
	db := getDbConnection()
	db.Save(encounter)
}
