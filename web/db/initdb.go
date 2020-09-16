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
			step.Type = "image description"
			step.Data = fmt.Sprintf("/assets/images/%d.jpg", i+1)
			step.Template = "step_picture.tmpl.html"
			db.Create(&step)
		}

		step := Step{}
		step.Number = 7
		step.Type = "text copy"
		step.Data = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
		step.Template = "step_copytext.tmpl.html"
		db.Create(&step)
	}
}
