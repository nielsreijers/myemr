package logger

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"

	"gorm.io/gorm"

	DB "myemr/db"
	H "myemr/helpers"
	L "myemr/login"
)

type LoggerTrace struct {
	gorm.Model
	UserID   uint      `gorm:"not null"`
	User     DB.User   ``
	Time     time.Time `gorm:"not null"`
	UnixTime int64     `gorm:"not null"`
	Type     string
	Data     string
	X        int
	Y        int
}

type KeyLoggerEvent struct {
	UnixTime int64
	Type     string
	Data     string
	X        int
	Y        int
}

func AutoMigrate() {
	db := DB.GetDbConnection()
	H.ErrorCheck(db.AutoMigrate(&LoggerTrace{}))
}

func KeyLogger(c *gin.Context) {
	currentUser, isLoggedIn := L.GetLoggedOnUser(c)
	if isLoggedIn {
		body, err := c.GetRawData()
		H.ErrorCheck(err)

		var events []LoggerTrace
		err = json.Unmarshal([]byte(body), &events)
		H.ErrorCheck(err)

		for i, event := range events {
			events[i].UserID = currentUser.ID
			sec := event.UnixTime / 1000
			nsec := (event.UnixTime % 1000) * 1000 * 1000
			time := time.Unix(sec, nsec)
			events[i].Time = time
		}

		db := DB.GetDbConnection()
		db.Create(&events)
	} else {
		c.Status(http.StatusUnauthorized)
	}
}

func VideoLogger(c *gin.Context) {
	currentUser, isLoggedIn := L.GetLoggedOnUser(c)
	if isLoggedIn {
		starttime, _ := c.GetPostForm("starttime")
		location, _ := c.GetPostForm("location")
		base64data, _ := c.GetPostForm("base64data")

		binarydata, err := base64.StdEncoding.DecodeString(base64data)
		filename := fmt.Sprintf("videos/%s-%s-%s.raw.webm", currentUser.Username, location, starttime)
		H.ErrorCheck(err)

		f, err := os.OpenFile(filename, os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0600)
		H.ErrorCheck(err)
		defer f.Close()

		_, err = f.Write(binarydata)
		H.ErrorCheck(err)
	} else {
		c.Status(http.StatusUnauthorized)
	}
}
