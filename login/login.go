package login

import (
	"net/http"

	"github.com/gin-gonic/gin"

	DB "myemr/db"
	H "myemr/helpers"
)

func GetCurrentUser(c *gin.Context) (DB.User, bool) {
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
