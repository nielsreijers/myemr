package main

import (
	"html/template"
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/thinkerou/favicon"

	Config "myemr/config"
	DB "myemr/db"
	H "myemr/helpers"
	Logger "myemr/logger"
	L "myemr/login"
)

func main() {
	addr, err := Config.MyPort()
	if err != nil {
		log.Fatal(err)
	}

	DB.AutoMigrate()

	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowMethods:    []string{"GET"},
		AllowHeaders:    []string{"Origin", "text"},
		ExposeHeaders:   []string{"Content-Length"},
		AllowAllOrigins: true,
		MaxAge:          48 * time.Hour,
	}))
	router.SetFuncMap(template.FuncMap{
		"formatDateTime": func(t time.Time) string { return t.Format("2006-01-02 15:04:05") },
	})
	router.LoadHTMLGlob("templates/*")

	router.Use(favicon.New("./assets/favicon.ico"))

	// UI
	router.GET("/", func(c *gin.Context) { c.HTML(http.StatusOK, "index.tmpl.html", gin.H{}) })
	router.GET("/login", L.Login)
	router.POST("/login", L.Login)
	router.GET("/changepassword", L.ChangePassword)
	router.POST("/changepassword", L.ChangePassword)
	router.GET("/logout", L.Logout)
	router.GET("/patientlist", patientlist)
	router.POST("/patient", addPatient)
	router.GET("/patient/:id", patient)
	router.POST("/encounter", addEncounter)
	router.GET("/encounter/:id", encounter)
	router.GET("/encounter/:id/edit", editEncounter)
	router.POST("/encounter/:id", saveEncounter)
	router.DELETE("/encounter/:id", deleteEncounter)

	// Logger
	router.Static("/assets", "./assets")
	router.POST("/logger/keylogger", Logger.KeyLogger)
	router.POST("/logger/videologger", Logger.VideoLogger)

	Logger.AutoMigrate()

	router.RunTLS(addr, "./cert/server.pem", "./cert/server.key")
}

func patientlist(c *gin.Context) {
	currentUser, isLoggedIn := L.GetCurrentUser(c)
	if isLoggedIn {
		patients := DB.GetPatients()

		c.HTML(http.StatusOK, "patientlist.tmpl.html", gin.H{
			"Header":   gin.H{"CurrentUser": currentUser, "Request": c.Request},
			"Patients": patients,
		})
	}
}

func addPatient(c *gin.Context) {
	_, isLoggedIn := L.GetCurrentUser(c)
	if isLoggedIn {
		name, _ := c.GetPostForm("name")
		patientID := DB.AddPatient(name)

		c.Redirect(http.StatusSeeOther, "/patient/"+H.Utoa(patientID))
	}
}

func patient(c *gin.Context) {
	currentUser, isLoggedIn := L.GetCurrentUser(c)
	if isLoggedIn {
		patientID, err := H.Atou(c.Param("id"))
		H.ErrorCheck(err)

		patient := DB.GetPatientByID(patientID)
		encounters := DB.GetEncountersByPatientID(patientID)
		c.HTML(http.StatusOK, "patient.tmpl.html", gin.H{
			"Header":     gin.H{"CurrentUser": currentUser, "Request": c.Request},
			"Patient":    patient,
			"Encounters": encounters,
		})
	}
}

func addEncounter(c *gin.Context) {
	currentUser, isLoggedIn := L.GetCurrentUser(c)
	if isLoggedIn {
		patientIDString, found := c.GetPostForm("patientID")
		if found {
			patientID, err := H.Atou(patientIDString)
			H.ErrorCheck(err)

			encounterID := DB.AddEncounter(patientID, currentUser)
			c.Redirect(http.StatusSeeOther, "/encounter/"+H.Utoa(encounterID)+"/edit")
		} else {
			c.Redirect(http.StatusSeeOther, "/patientlist")
		}
	}
}

func encounter(c *gin.Context) {
	currentUser, isLoggedIn := L.GetCurrentUser(c)
	if isLoggedIn {
		encounterID, err := H.Atou(c.Param("id"))
		H.ErrorCheck(err)

		encounter := DB.GetEncounterByID(encounterID)
		patient := DB.GetPatientByID(encounter.PatientID)
		user, _ := DB.GetUserByID(encounter.UserID)
		c.HTML(http.StatusOK, "encounter.tmpl.html", gin.H{
			"Header":    gin.H{"CurrentUser": currentUser, "Request": c.Request},
			"Encounter": encounter,
			"Patient":   patient,
			"User":      user,
		})
	}
}

func editEncounter(c *gin.Context) {
	currentUser, isLoggedIn := L.GetCurrentUser(c)
	if isLoggedIn {
		encounterID, err := H.Atou(c.Param("id"))
		H.ErrorCheck(err)

		encounter := DB.GetEncounterByID(encounterID)
		if currentUser.ID != encounter.UserID {
			c.Redirect(http.StatusSeeOther, "/encounter/"+H.Utoa(encounter.ID))
		}

		patient := DB.GetPatientByID(encounter.PatientID)
		user, _ := DB.GetUserByID(encounter.UserID)
		c.HTML(http.StatusOK, "encounter_edit.tmpl.html", gin.H{
			"Header":    gin.H{"CurrentUser": currentUser, "Request": c.Request},
			"Encounter": encounter,
			"Patient":   patient,
			"User":      user,
		})
	}
}

func saveEncounter(c *gin.Context) {
	currentUser, isLoggedIn := L.GetCurrentUser(c)
	if isLoggedIn {
		encounterID, err := H.Atou(c.Param("id"))
		H.ErrorCheck(err)

		encounter := DB.GetEncounterByID(encounterID)
		if currentUser.ID == encounter.UserID {
			history, _ := c.GetPostForm("history")
			physical, _ := c.GetPostForm("physical")
			plan, _ := c.GetPostForm("plan")
			encounter.History = history
			encounter.Physical = physical
			encounter.Plan = plan

			DB.SaveEncounter(&encounter)
		}
	}
	c.Redirect(http.StatusSeeOther, "/encounter/"+c.Param("id"))
}

func deleteEncounter(c *gin.Context) {
	currentUser, isLoggedIn := L.GetCurrentUser(c)
	if isLoggedIn {
		encounterID, err := H.Atou(c.Param("id"))
		H.ErrorCheck(err)

		encounter := DB.GetEncounterByID(encounterID)
		if currentUser.ID == encounter.UserID {
			DB.DeleteEncounter(&encounter)
		}
	}
}
