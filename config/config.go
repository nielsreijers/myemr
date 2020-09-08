package config

import (
	"fmt"
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

func ConnectGORM() (*gorm.DB, error) {
	addr := os.Getenv("MYSQL")
	if addr == "" {
		addr = "localhost"
	} else {
		fmt.Printf("Connecting to %s\n", addr)
	}

	dsn := "root:1234@tcp(" + addr + ":3306)/myemr?parseTime=true"
	return gorm.Open(mysql.Open(dsn), &gorm.Config{})
}
