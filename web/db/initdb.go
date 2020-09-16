package db

import (
	"fmt"

	H "myemr/helpers"
)

func initDbIfEmpty() {
	db := GetDbConnection()

	var users []User
	result := db.Find(&users)
	H.ErrorCheck(result.Error)

	if len(users) == 0 {
		user1 := User{}
		user1.Username = "niels"
		user1.Salt = ""
		user1.Password = "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4"
		db.Create(&user1)

		for i := 0; i < 6; i++ {
			step := Step{}
			step.Number = i + 1
			step.Type = "DescribeImage"
			step.Data = fmt.Sprintf("assets/images/%d.jpg", i+1)
			step.Template = "step_picture.tmpl.html"
			db.Create(&step)
		}
	}
}
