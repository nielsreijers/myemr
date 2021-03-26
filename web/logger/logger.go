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
	Type     string    ``
	Data     string    ``
	X        int       ``
	Y        int       ``
	UUID     []byte    `gorm:"not null;type:binary(16)"`
}

type Request struct {
	Uuid   string
	Events []LoggerTrace
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

		var req Request
		err = json.Unmarshal([]byte(body), &req)
		H.ErrorCheck(err)

		uuidArray, err := H.StringToUuidArray(req.Uuid)

		for i, event := range req.Events {
			req.Events[i].UserID = currentUser.ID
			sec := event.UnixTime / 1000
			nsec := (event.UnixTime % 1000) * 1000 * 1000
			time := time.Unix(sec, nsec)
			req.Events[i].Time = time
			req.Events[i].UUID = uuidArray
		}

		db := DB.GetDbConnection()
		db.Create(&req.Events)
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
		filename := fmt.Sprintf("data/videos/%s-%s-%s.raw.webm", currentUser.Username, location, starttime)
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

func AudioLogger(c *gin.Context) {
	currentUser, isLoggedIn := L.GetLoggedOnUser(c)
	if isLoggedIn {
		starttime, _ := c.GetPostForm("starttime")
		fragment_number, _ := c.GetPostForm("fragment_number")
		fragment_endtime, _ := c.GetPostForm("fragment_endtime")
		location, _ := c.GetPostForm("location")
		base64data, _ := c.GetPostForm("base64data")

		binarydata, err := base64.StdEncoding.DecodeString(base64data)
		directoryname := fmt.Sprintf("data/videos/%s-%s-%s", currentUser.Username, location, starttime)
		filename := fmt.Sprintf("%s/%s-%s.wav", directoryname, fragment_number, fragment_endtime)
		H.ErrorCheck(err)

		if _, err := os.Stat(directoryname); os.IsNotExist(err) {
			os.Mkdir(directoryname, 0600)
		}

		f, err := os.OpenFile(filename, os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0600)
		H.ErrorCheck(err)
		defer f.Close()

		_, err = f.Write(binarydata)
		H.ErrorCheck(err)
	} else {
		c.Status(http.StatusUnauthorized)
	}
}
