package login

import (
	"crypto/sha256"
	"encoding/hex"
	"math/rand"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	DB "myemr/db"
	H "myemr/helpers"
)

func GetLoggedOnUserOrRedirect(c *gin.Context) (DB.User, bool) {
	user, found := GetLoggedOnUser(c)
	if !found {
		c.Redirect(http.StatusSeeOther, "/start")
	}
	return user, found
}

func GetLoggedOnUser(c *gin.Context) (DB.User, bool) {
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
	return DB.User{}, false
}

func checkPassword(password, salt, storedPassword string) bool {
	hashedBinary := sha256.Sum256([]byte(salt + password))
	hashedHex := hex.EncodeToString(hashedBinary[:])
	return storedPassword == hashedHex
}

func setCookie(c *gin.Context, userID uint) {
	var cookie http.Cookie
	cookie.Name = "user"
	cookie.Value = H.Utoa(userID)
	http.SetCookie(c.Writer, &cookie)
}

func clearCookie(c *gin.Context) {
	cookie, err := c.Request.Cookie("user")
	if err == nil {
		cookie.Value = ""
		http.SetCookie(c.Writer, cookie)
	}
}

func Login(c *gin.Context) {
	if c.Request.Method == "GET" {
		c.HTML(http.StatusOK, "login.tmpl.html", gin.H{"Message": "Login:"})
	} else if c.Request.Method == "POST" {
		username, _ := c.GetPostForm("username")
		password, _ := c.GetPostForm("password")
		user, found := DB.GetUserByName(username)

		if !found {
			c.HTML(http.StatusOK, "login.tmpl.html", gin.H{"Message": "Login failed"})
		} else {
			if checkPassword(password, user.Salt, user.Password) {
				// Login successful
				setCookie(c, user.ID)
				c.Redirect(http.StatusSeeOther, "/start")
			} else {
				c.HTML(http.StatusOK, "login.tmpl.html", gin.H{"Message": "Login failed"})
			}
		}
	}
}

func Logout(c *gin.Context) {
	clearCookie(c)
	c.Redirect(http.StatusTemporaryRedirect, "/start")
}

func ChangePassword(c *gin.Context) {
	user, isLoggedIn := GetLoggedOnUserOrRedirect(c)
	if isLoggedIn {
		if c.Request.Method == "GET" {
			c.HTML(http.StatusOK, "changepassword.tmpl.html", gin.H{"Message": "Change password:"})
		} else if c.Request.Method == "POST" {
			password, _ := c.GetPostForm("password")
			if checkPassword(password, user.Salt, user.Password) {
				passwordNew1, _ := c.GetPostForm("password_new1")
				passwordNew2, _ := c.GetPostForm("password_new2")
				if passwordNew1 == passwordNew2 {
					user.Salt = strconv.Itoa(rand.Intn(1000000))
					hashedBinary := sha256.Sum256([]byte(user.Salt + passwordNew1))
					hashedHex := hex.EncodeToString(hashedBinary[:])
					user.Password = hashedHex
					DB.SaveUser(user)
					c.Redirect(http.StatusSeeOther, "/start")
				} else {
					c.HTML(http.StatusOK, "changepassword.tmpl.html", gin.H{"Message": "Passwords don't match"})
				}
			} else {
				c.HTML(http.StatusOK, "changepassword.tmpl.html", gin.H{"Message": "Password incorrect"})
			}
		}
	}
}

func CreateAccount(c *gin.Context) {
	if c.Request.Method == "GET" {
		c.HTML(http.StatusOK, "createaccount.tmpl.html", gin.H{"Message": "Create new user:"})
	} else if c.Request.Method == "POST" {
		username, found := c.GetPostForm("username")
		if found && username != "" {
			_, found := DB.GetUserByName(username)
			if !found {
				passwordNew1, _ := c.GetPostForm("password_new1")
				passwordNew2, _ := c.GetPostForm("password_new2")
				if passwordNew1 == passwordNew2 {
					salt := strconv.Itoa(rand.Intn(1000000))
					hashedBinary := sha256.Sum256([]byte(salt + passwordNew1))
					password := hex.EncodeToString(hashedBinary[:])
					userID := DB.AddUser(username, salt, password)

					setCookie(c, userID)
					c.Redirect(http.StatusSeeOther, "/start")
				} else {
					c.HTML(http.StatusOK, "createaccount.tmpl.html", gin.H{"Message": "Passwords don't match"})
				}
			} else {
				c.HTML(http.StatusOK, "createaccount.tmpl.html", gin.H{"Message": "username already taken"})
			}
		} else {
			c.HTML(http.StatusOK, "createaccount.tmpl.html", gin.H{"Message": "username can't be empty"})
		}
	}
}
