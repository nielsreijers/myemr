package connect

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"

	Conf "myemr/config"
)

func TestConnect(c *gin.Context) {
	var db, errdb = Conf.ConnectDb()

	if errdb != nil {
		c.JSON(http.StatusNotFound, gin.H{"result": "Missing connection"})
		log.Println("Missing connection")
		return
	}
	db.Close()
	c.JSON(http.StatusOK, gin.H{"result": "Success Connection"})
}
