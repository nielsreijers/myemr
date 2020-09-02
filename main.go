package main

import (
	"database/sql"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"

	Config "myemr/config"
	Connect "myemr/connect"
)

func main() {
	addr, err := Config.MyPort()
	if err != nil {
		log.Fatal(err)
	}

	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowMethods:    []string{"GET"},
		AllowHeaders:    []string{"Origin", "text"},
		ExposeHeaders:   []string{"Content-Length"},
		AllowAllOrigins: true,
		MaxAge:          48 * time.Hour,
	}))
	router.LoadHTMLGlob("templates/*")

	// API
	v1 := router.Group("api/v1/logger")
	v1.GET("/testconnect", Connect.TestConnect)

	// UI
	router.GET("/patientlist", patientlist)
	router.GET("/patient/:id", patient)

	router.Run(addr)
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

type User struct {
	Id       int
	Username string
	Password string
}

type Patient struct {
	Id   int
	Name string
}

type Encounter struct {
	Id        int
	VisitDate time.Time
	Field1    string
	Field2    string
	Field3    string
}

func getPatients() []Patient {
	db := getDbConnection()
	defer db.Close()

	// query all data
	rows, err := db.Query("select id, name from patient")
	errorCheck(err)

	patients := []Patient{}
	for rows.Next() {
		var p = Patient{}
		err = rows.Scan(&p.Id, &p.Name)
		errorCheck(err)
		patients = append(patients, p)
	}
	return patients
}

func getEncounters(patientID int) []Encounter {
	db := getDbConnection()
	defer db.Close()

	// query all data
	rows, err := db.Query("select id, visitdate, field1, field2, field3 from encounter where user_id=1 and patient_id=?", patientID)
	errorCheck(err)

	encounters := []Encounter{}
	for rows.Next() {
		var e = Encounter{}
		err = rows.Scan(&e.Id, &e.VisitDate, &e.Field1, &e.Field2, &e.Field3)
		errorCheck(err)
		encounters = append(encounters, e)
	}
	return encounters
}

func patientlist(c *gin.Context) {
	patients := getPatients()

	c.HTML(http.StatusOK, "patientlist.tmpl.html", gin.H{
		"Patients": patients,
	})
}

func patient(c *gin.Context) {
	patientID, err := strconv.Atoi(c.Param("id"))
	errorCheck(err)

	encounters := getEncounters(patientID)
	c.HTML(http.StatusOK, "patient.tmpl.html", gin.H{
		"Encounters": encounters,
	})
}
