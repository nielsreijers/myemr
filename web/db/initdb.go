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

		db.Create(Step{
			Number:   7,
			Type:     "text copy",
			Data:     "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
			Template: "step_copytext.tmpl.html",
		})

		db.Create(Step{
			Number: 8,
			Type:   "text copy",
			Data: `Monkey takes selfies after stealing student's phone
			
			A Malaysian student whose cellphone was stolen while he was sleeping has tracked down the culprit: a monkey who took photo and video selfies with the device before abandoning it. Zackrydz Rodzi, 20, on Wednesday said that his mobile phone was missing from his bedroom when he woke up on Saturday. He found the phone's casing under his bed, but there was no sign of robbery in his house in Johor state.
			When his father saw a monkey the next day, he searched in the jungle behind his house. Using his brother's cellphone to call his own device, he found it covered in mud under a palm tree.
			However, a bigger surprise came when he found a series of monkey selfies and videos recorded in the phone. "My uncle was joking that maybe the monkey took some selfies with the phone... So when I checked my phone picture gallery, I was shocked. The suspect's face was plastered on the screen," Zackrydz said. "It was hilarious," he added.`,
			Template: "step_copytext.tmpl.html",
		})
	}
}
