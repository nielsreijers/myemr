package main

import (
	"html/template"
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	Config "myemr/config"
	DB "myemr/db"
	H "myemr/helpers"
	Logger "myemr/logger"
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

	// UI
	router.GET("/", func(c *gin.Context) { c.Redirect(http.StatusSeeOther, "/patientlist") })
	router.GET("/login", func(c *gin.Context) { c.HTML(http.StatusOK, "login.tmpl.html", gin.H{"Message": "Login:"}) })
	router.POST("/login", login)
	router.GET("/logout", logout)
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
	// router.POST("/logger/videologger", Logger.VideoLogger)

	Logger.AutoMigrate()

	router.Run(addr)
}

func getCurrentUser(c *gin.Context) (DB.User, bool) {
	cookie, err := c.Request.Cookie("user")
	if err == nil && cookie.Value != "" {
		userID, err := H.Atou(cookie.Value)
		if err == nil {
			user, found := DB.GetUserByID(userID)
			if found {
				return user, true
			}
		}
	}
	c.Redirect(http.StatusSeeOther, "/login")
	return DB.User{}, false
}

func login(c *gin.Context) {
	username, _ := c.GetPostForm("username")
	password, _ := c.GetPostForm("password")
	user, found := DB.GetUserByName(username)

	if !found || user.Password != password {
		c.HTML(http.StatusOK, "login.tmpl.html", gin.H{
			"Message": "Login failed",
		})
	} else {
		var cookie http.Cookie
		cookie.Name = "user"
		cookie.Value = H.Utoa(user.ID)
		http.SetCookie(c.Writer, &cookie)
		c.Redirect(http.StatusSeeOther, "/patientlist")
	}
}

func logout(c *gin.Context) {
	cookie, err := c.Request.Cookie("user")
	if err == nil {
		cookie.Value = ""
		http.SetCookie(c.Writer, cookie)
	}
	c.Redirect(http.StatusTemporaryRedirect, "/login")
}

func patientlist(c *gin.Context) {
	currentUser, isLoggedIn := getCurrentUser(c)
	if isLoggedIn {
		patients := DB.GetPatients()

		c.HTML(http.StatusOK, "patientlist.tmpl.html", gin.H{
			"CurrentUser": currentUser,
			"Patients":    patients,
		})
	}
}

func addPatient(c *gin.Context) {
	_, isLoggedIn := getCurrentUser(c)
	if isLoggedIn {
		name, _ := c.GetPostForm("name")
		patientID := DB.AddPatient(name)

		c.Redirect(http.StatusSeeOther, "/patient/"+H.Utoa(patientID))
	}
}

func patient(c *gin.Context) {
	currentUser, isLoggedIn := getCurrentUser(c)
	if isLoggedIn {
		patientID, err := H.Atou(c.Param("id"))
		H.ErrorCheck(err)

		patient := DB.GetPatientByID(patientID)
		encounters := DB.GetEncountersByPatientID(patientID)
		c.HTML(http.StatusOK, "patient.tmpl.html", gin.H{
			"CurrentUser": currentUser,
			"Patient":     patient,
			"Encounters":  encounters,
		})
	}
}

func addEncounter(c *gin.Context) {
	currentUser, isLoggedIn := getCurrentUser(c)
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
	currentUser, isLoggedIn := getCurrentUser(c)
	if isLoggedIn {
		encounterID, err := H.Atou(c.Param("id"))
		H.ErrorCheck(err)

		encounter := DB.GetEncounterByID(encounterID)
		patient := DB.GetPatientByID(encounter.PatientID)
		user, _ := DB.GetUserByID(encounter.UserID)
		c.HTML(http.StatusOK, "encounter.tmpl.html", gin.H{
			"CurrentUser": currentUser,
			"Encounter":   encounter,
			"Patient":     patient,
			"User":        user,
		})
	}
}

func editEncounter(c *gin.Context) {
	currentUser, isLoggedIn := getCurrentUser(c)
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
			"CurrentUser": currentUser,
			"Encounter":   encounter,
			"Patient":     patient,
			"User":        user,
		})
	}
}

func saveEncounter(c *gin.Context) {
	currentUser, isLoggedIn := getCurrentUser(c)
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
	currentUser, isLoggedIn := getCurrentUser(c)
	if isLoggedIn {
		encounterID, err := H.Atou(c.Param("id"))
		H.ErrorCheck(err)

		encounter := DB.GetEncounterByID(encounterID)
		if currentUser.ID == encounter.UserID {
			DB.DeleteEncounter(&encounter)
		}
	}
}
