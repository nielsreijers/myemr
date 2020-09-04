package config

import (
	"os"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	_ "github.com/go-sql-driver/mysql"
)

func MyPort() (string, error) {
	port := os.Getenv("PORT")
	if port == "" {
		port = "5001"
	}
	return ":" + port, nil
}

func ConnectDb() (*gorm.DB, error) {
	dsn := "root:1234@tcp(localhost:3306)/myemr?parseTime=true"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})

	return db, err
}
