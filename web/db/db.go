package db

import (
	"time"

	"gorm.io/gorm"

	Config "myemr/config"
	H "myemr/helpers"
)

type User struct {
	gorm.Model
	Username   string `gorm:"unique;not null"`
	Salt       string `gorm:"not null"`
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
	UserID     uint      `gorm:"not null"`
	User       User      ``
	PatientID  uint      `gorm:"not null"`
	Patient    Patient   ``
	VisitDate  time.Time `gorm:"not null"`
	Subjective string    `gorm:"not null"`
	Objective  string    `gorm:"not null"`
	DDx1       string    `gorm:"not null"`
	DDx2       string    `gorm:"not null"`
	DDx3       string    `gorm:"not null"`
}

var gormdb *gorm.DB

func checkConnection(gormdb *gorm.DB) bool {
	if gormdb != nil {
		db, err := gormdb.DB()
		if err == nil {
			err = db.Ping()
			if err == nil {
				return true
			}
		}
	}
	return false
}

func GetDbConnection() *gorm.DB {
	if gormdb == nil || !checkConnection(gormdb) {
		db, err := Config.ConnectGORM()
		H.ErrorCheck(err)
		gormdb = db
	}

	return gormdb
}

func AutoMigrate() {
	db := GetDbConnection()
	H.ErrorCheck(db.AutoMigrate(&User{}))
	H.ErrorCheck(db.AutoMigrate(&Patient{}))
	H.ErrorCheck(db.AutoMigrate(&Encounter{}))
	initDbIfEmpty()
}

func GetUserByName(username string) (User, bool) {
	db := GetDbConnection()

	var user User
	result := db.First(&user, "username = ?", username)

	if result.RowsAffected == 1 {
		return user, true
	} else {
		return user, false
	}
}

func GetUserByID(userID uint) (User, bool) {
	db := GetDbConnection()

	var user User
	result := db.First(&user, userID)
	H.ErrorCheck(result.Error)

	if result.RowsAffected == 1 {
		return user, true
	} else {
		return user, false
	}
}

func SaveUser(user User) {
	db := GetDbConnection()
	db.Save(user)
}

func AddPatient(name string) uint {
	db := GetDbConnection()

	patient := Patient{Name: name}
	result := db.Create(&patient)
	H.ErrorCheck(result.Error)

	return patient.ID
}

func GetPatients() []Patient {
	db := GetDbConnection()

	var patients []Patient
	result := db.Find(&patients)
	H.ErrorCheck(result.Error)

	return patients
}

func GetPatientByID(patientID uint) Patient {
	db := GetDbConnection()

	var patient Patient
	result := db.First(&patient, patientID)
	H.ErrorCheck(result.Error)

	return patient
}

func AddEncounter(patientID uint, currentUser User) uint {
	db := GetDbConnection()

	encounter := Encounter{
		PatientID: patientID,
		UserID:    currentUser.ID,
		VisitDate: time.Now(),
	}

	result := db.Create(&encounter) // pass pointer of data to Create
	H.ErrorCheck(result.Error)

	return encounter.ID
}

func GetEncountersByPatientID(patientID uint) []Encounter {
	db := GetDbConnection()

	var encounters []Encounter
	result := db.Preload("User").Preload("Patient").Find(&encounters, "patient_id = ?", patientID)
	H.ErrorCheck(result.Error)

	return encounters
}

func GetEncounterByID(encounterID uint) Encounter {
	db := GetDbConnection()

	var encounter Encounter
	result := db.Preload("User").Preload("Patient").First(&encounter, encounterID)
	H.ErrorCheck(result.Error)

	return encounter
}

func SaveEncounter(encounter *Encounter) {
	db := GetDbConnection()
	db.Save(encounter)
}

func DeleteEncounter(encounter *Encounter) {
	db := GetDbConnection()
	db.Delete(encounter)
}
