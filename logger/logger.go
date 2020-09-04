package logger

import (
	"encoding/json"
	"time"

	"github.com/gin-gonic/gin"

	"gorm.io/gorm"

	DB "myemr/db"
	H "myemr/helpers"
)

type LoggerTrace struct {
	gorm.Model
	UserID uint      `gorm:"not null"`
	User   DB.User   ``
	Time   time.Time `gorm:"unique;not null"`
	Type   string
	Data   string
	X      int
	Y      int
}

type KeyLoggerEvent struct {
	Time int64
	Type string
	Data string
	X    int
	Y    int
}

func AutoMigrate() {
	db := DB.GetDbConnection()
	H.ErrorCheck(db.AutoMigrate(&LoggerTrace{}))
}

func KeyLogger(c *gin.Context) {
	cookie, err := c.Request.Cookie("user")
	if err == nil && cookie.Value != "" {
		userID, err := H.Atou(cookie.Value)
		if err == nil {
			body, err := c.GetRawData()
			H.ErrorCheck(err)

			var events []KeyLoggerEvent
			err = json.Unmarshal([]byte(body), &events)
			H.ErrorCheck(err)

			records := make([]LoggerTrace, len(events))
			for i, event := range events {
				records[i].UserID = userID
				sec := event.Time / 1000
				nsec := (event.Time % 1000) * 1000 * 1000
				time := time.Unix(sec, nsec)
				records[i].Time = time
				records[i].Type = event.Type
				records[i].Data = event.Data
				records[i].X = event.X
				records[i].Y = event.Y
			}

			db := DB.GetDbConnection()
			db.Create(&records)
		}
	}
}

func VideoLogger(c *gin.Context) {
	// <?php

	// $filename = $_POST['filename'];
	// $binarydata = base64_decode($_POST['binarydata']);

	// if (!empty($binarydata)) {
	// 	// log to file
	// 	$file = fopen('videos/' . $filename, 'a+');
	// 	fwrite($file, $binarydata);
	// 	fclose($file);
	// 	print("Successfully Logged to " . $filename);
	// } else {
	// 	print("EntiyBody is empty.");
	// }
	// ?>
}
