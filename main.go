package main

import (
	"log"
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

	v1 := router.Group("api/v1/logger")
	v1.GET("/testconnect", Connect.TestConnect)

	router.Run(addr)
}
