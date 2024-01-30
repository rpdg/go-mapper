This is a data structure conversion tool written in Golang.



Sample structure:

```go
// source
type Person struct {
	Name string `json:"name"`
	Age  int    `json:"age"`
}

// target
type User struct {
	Profile struct {
		UserName string `json:"userName"`
	} `json:"profile"`
	IsTeenager bool `json:"isTeenager"`
}
```

cfg.json

```json
{
  "convertors": [
    {
      "from": "name",
      "to": "profile.userName"
    },
    {
      "from": "age",
      "to": "isTeenager",
      "render": "return val < 20;"
    }
  ]
}
```

Usage:
```go
p := Person{Age: 15, Name: "Tom"}
u, _ := ConvertWithJSON[User](u, "./cfg.json")
// output
// User{Profile{UserName:"Tom"}, IsTeenager:true}
```

