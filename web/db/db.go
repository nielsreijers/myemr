package db

import (
	"time"

	"gorm.io/gorm"

	Config "myemr/config"
	H "myemr/helpers"
)

type User struct {
	gorm.Model
	Username string `gorm:"unique;not null"`
	Salt     string `gorm:"not null"`
	Password string `gorm:"not null"`
	Results  []StepResult
}

type Step struct {
	gorm.Model
	Number   int    `gorm:"unique;not null"`
	Type     string `gorm:"not null"`
	Template string `gorm:"not null"`
	Data     string ``
	Results  []StepResult
}

type StepResult struct {
	gorm.Model
	UserID          uint      `gorm:"not null"`
	User            User      ``
	StepID          uint      `gorm:"not null"`
	Step            Step      ``
	CompletedAtTime time.Time `gorm:"not null"`
	Result          string    `gorm:"not null"`
}

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

var gormdb *gorm.DB

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
	H.ErrorCheck(db.AutoMigrate(&Step{}))
	H.ErrorCheck(db.AutoMigrate(&StepResult{}))
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

func AddUser(username, salt, password string) uint {
	db := GetDbConnection()

	user := User{}
	user.Username = username
	user.Salt = salt
	user.Password = password

	result := db.Create(&user)
	H.ErrorCheck(result.Error)

	return user.ID
}

func GetSteps() []Step {
	db := GetDbConnection()

	var steps []Step
	result := db.Find(&steps)
	H.ErrorCheck(result.Error)

	return steps
}

func GetStepByNumberWithResult(number int, userID uint) (Step, bool) {
	db := GetDbConnection()

	var step Step
	result := db.Preload("Results", "user_id = ?", userID).First(&step, "number = ?", number)

	if result.RowsAffected == 1 {
		return step, true
	} else {
		return step, false
	}
}

func GetStepsWithResultsByUserID(userID uint) []Step {
	db := GetDbConnection()

	var steps []Step
	result := db.Preload("Results", "user_id = ?", userID).Order("number").Find(&steps)
	H.ErrorCheck(result.Error)

	return steps
}

func DeleteStepResult(stepResultID uint) {
	db := GetDbConnection()

	db.Delete(&StepResult{}, stepResultID)
}

func SaveStepResult(user User, step Step, resultString string) {
	db := GetDbConnection()

	stepresult := StepResult{
		UserID:          user.ID,
		StepID:          step.ID,
		Result:          resultString,
		CompletedAtTime: time.Now(),
	}

	result := db.Create(&stepresult)
	H.ErrorCheck(result.Error)
}
