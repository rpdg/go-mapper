package mapper

import "testing"

type Person struct {
	Name string `json:"name"`
	Age  int    `json:"age"`
}

type User struct {
	Profile struct {
		UserName string `json:"userName"`
	} `json:"profile"`
	IsTeenager bool `json:"isTeenager"`
}

func TestMapper(t *testing.T) {

	u := Person{Age: 15, Name: "Tom"}

	render := new(JsFuncBodyString)
	*render = "return val < 20;"
	mCfg := ConvertorConfigure{
		Convertors: []*ConvertorNode{
			{
				From: "name",
				To:   "profile.userName",
			},
			{
				From:   "age",
				To:     "isTeenager",
				Render: render,
			},
		},
	}
	stu, err := ConvertWithConfig[User](u, mCfg)
	if err != nil {
		t.Fatal(err)
	} else {
		t.Log(stu)
	}

	stu2, err2 := ConvertWithJSON[User](u, "./mapper_test_cfg.json")
	if err2 != nil {
		t.Fatal(err2)
	} else {
		t.Log(stu2)
	}
}
