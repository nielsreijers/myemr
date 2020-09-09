package db

import (
	"time"

	H "myemr/helpers"
)

func initDbIfEmpty() {
	db := GetDbConnection()

	var users []User
	result := db.Find(&users)
	H.ErrorCheck(result.Error)

	if len(users) == 0 {
		user1 := User{}
		user1.Username = "niels"
		user1.Salt = ""
		user1.Password = "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4"
		db.Create(&user1)
		user2 := User{}
		user2.Username = "sinterklaas"
		user2.Salt = ""
		user2.Password = "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4"
		db.Create(&user2)

		patient1 := Patient{}
		patient1.Name = "Elvis Presley"
		db.Create(&patient1)
		patient2 := Patient{}
		patient2.Name = "Janis Joplin"
		db.Create(&patient2)
		patient3 := Patient{}
		patient3.Name = "Mick Jagger"
		db.Create(&patient3)
		patient4 := Patient{}
		patient4.Name = "Jim Morrison"
		db.Create(&patient4)

		encounter1 := Encounter{}
		encounter1.UserID = user1.ID
		encounter1.PatientID = patient1.ID
		encounter1.VisitDate = time.Date(2020, 9, 2, 16, 30, 0, 0, time.Local)
		encounter1.Subjective = "aap"
		encounter1.Objective = "noot"
		encounter1.DDx1 = "mies 1"
		encounter1.DDx2 = "mies 2"
		encounter1.DDx3 = "mies 3"
		db.Create(&encounter1)
		encounter2 := Encounter{}
		encounter2.UserID = user2.ID
		encounter2.PatientID = patient1.ID
		encounter2.VisitDate = time.Date(2020, 9, 3, 14, 07, 0, 0, time.Local)
		encounter2.Subjective = "wim"
		encounter2.Objective = "zus"
		encounter2.DDx1 = "jet 1"
		encounter2.DDx2 = "jet 2"
		encounter2.DDx3 = "jet 3"
		db.Create(&encounter2)
	}
}
