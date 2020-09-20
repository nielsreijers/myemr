package login

import (
	"crypto/sha256"
	"encoding/hex"
	"math/rand"
	"net/http"
	"strconv"

	"github.com/satori/uuid"

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
	cookieUserID, err1 := c.Request.Cookie("user")
	cookieToken, err2 := c.Request.Cookie("token")
	if err1 == nil && err2 == nil && cookieUserID.Value != "" {
		userID, err := H.Atou(cookieUserID.Value)
		if err == nil {
			user, found := DB.GetUserByID(userID)
			if found && user.Token == cookieToken.Value {
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

func setLoginCookies(c *gin.Context, user DB.User) {
	var cookieUserID http.Cookie
	cookieUserID.Name = "user"
	cookieUserID.Value = H.Utoa(user.ID)
	http.SetCookie(c.Writer, &cookieUserID)

	var cookieToken http.Cookie
	cookieToken.Name = "token"
	cookieToken.Value = user.Token
	http.SetCookie(c.Writer, &cookieToken)
}

func clearLoginCookies(c *gin.Context) {
	cookie, err := c.Request.Cookie("user")
	if err == nil {
		cookie.Value = ""
		http.SetCookie(c.Writer, cookie)
	}
	cookie, err = c.Request.Cookie("token")
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
				user.Token = uuid.NewV4().String()
				setLoginCookies(c, user)
				DB.SaveUser(user)
				c.Redirect(http.StatusSeeOther, "/start")
			} else {
				c.HTML(http.StatusOK, "login.tmpl.html", gin.H{"Message": "Login failed"})
			}
		}
	}
}

func Logout(c *gin.Context) {
	clearLoginCookies(c)
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

					// Log in the new user
					user, _ := DB.GetUserByID(userID)
					user.Token = uuid.NewV4().String()
					DB.SaveUser(user)

					setLoginCookies(c, user)
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
