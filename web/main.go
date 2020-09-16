package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"strconv"
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
	router.GET("/createaccount", L.CreateAccount)
	router.POST("/createaccount", L.CreateAccount)
	router.GET("/nextstep", nextStep)
	router.GET("/step/:number", step)
	router.POST("/step/:number", step)

	router.GET("/start", start)

	// Logger
	router.Static("/assets", "./assets")
	router.POST("/logger/keylogger", Logger.KeyLogger)
	router.POST("/logger/videologger", Logger.VideoLogger)

	Logger.AutoMigrate()

	router.RunTLS(addr, "./cert/server.pem", "./cert/server.key")
}

func getResultsForUser(userID uint) ([]DB.Step, int, int) {
	steps := DB.GetStepsWithResultsByUserID(userID)

	completedCount := 0
	nextStepNumber := -1
	for _, step := range steps {
		if len(step.Results) == 0 {
			completedCount++
			if step.Number < nextStepNumber || nextStepNumber == -1 {
				nextStepNumber = step.Number
			}
		}
	}
	return steps, completedCount, nextStepNumber
}

func start(c *gin.Context) {
	currentUser, isLoggedIn := L.GetLoggedOnUser(c)
	if isLoggedIn {
		steps, completedCount, _ := getResultsForUser(currentUser.ID)

		c.HTML(http.StatusOK, "start_loggedin.tmpl.html", gin.H{
			"Header":         gin.H{"CurrentUser": currentUser, "Request": c.Request},
			"Steps":          steps,
			"Completed":      completedCount == len(steps),
			"CompletedCount": completedCount,
		})
	} else {
		c.HTML(http.StatusOK, "start_notloggedin.tmpl.html", gin.H{})
	}
}

func nextStep(c *gin.Context) {
	currentUser, isLoggedIn := L.GetLoggedOnUserOrRedirect(c)
	if isLoggedIn {
		steps, completedCount, nextStepNumber := getResultsForUser(currentUser.ID)
		if completedCount == len(steps) {
			c.Redirect(http.StatusFound, "/start")
		} else {
			c.Redirect(http.StatusFound, fmt.Sprintf("/step/%d", nextStepNumber))
		}
	}
}

func step(c *gin.Context) {
	currentUser, isLoggedIn := L.GetLoggedOnUserOrRedirect(c)
	if isLoggedIn {
		stepnumber, err := strconv.Atoi(c.Param("number"))
		H.ErrorCheck(err)
		step, found := DB.GetStepByNumber(stepnumber)
		steps, completedCount, _ := getResultsForUser(currentUser.ID)

		if !found {
			c.Redirect(http.StatusSeeOther, "/start")
		} else {
			if c.Request.Method == "GET" {
				c.HTML(http.StatusOK, step.Template, gin.H{
					"Header":         gin.H{"CurrentUser": currentUser, "Request": c.Request},
					"Step":           step,
					"TotalCount":     len(steps),
					"CompletedCount": completedCount,
				})
			} else if c.Request.Method == "POST" {
				switch step.Type {
				case "DescribeImage":
					description, _ := c.GetPostForm("description")
					DB.SaveStepResult(currentUser, step, description)
				}

				c.Redirect(http.StatusFound, "/nextstep")
			}
		}
	}
}
