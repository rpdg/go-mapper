package mapper

import (
	_ "embed"
	"encoding/json"
	"github.com/dop251/goja"
	"os"
)

//go:embed "convertor.js"
var convertorJS string

type JsFuncBodyString string

type ConvertorNode struct {
	From   string            `json:"from,omitempty"`
	To     string            `json:"to,omitempty"`
	Render *JsFuncBodyString `json:"render,omitempty"`
	Map    []*ConvertorNode  `json:"map,omitempty"`
}

type ConvertorConfigure struct {
	Convertors []*ConvertorNode `json:"convertors"`
}

var jsConvert func(any, []*ConvertorNode) any

func init() {
	vm := goja.New()
	vm.SetFieldNameMapper(goja.TagFieldNameMapper("json", true))
	_, err := vm.RunString(convertorJS)
	if err != nil {
		panic(err)
	}

	err = vm.ExportTo(vm.Get("convert"), &jsConvert)
	if err != nil {
		panic(err)
	}
}

func ConvertWithConfig[T any](input any, convertCfg ConvertorConfigure) (output T, err error) {
	result := jsConvert(input, convertCfg.Convertors)
	resultStr, _ := json.Marshal(result)
	err = json.Unmarshal([]byte(resultStr), &output)
	return
}

func ConvertWithJSON[T any](input any, jsonPath string) (output T, err error) {
	tmplJson, err := os.ReadFile(jsonPath)
	if err != nil {
		return
	}
	var transCfg ConvertorConfigure
	err = json.Unmarshal(tmplJson, &transCfg)
	if err != nil {
		return
	}

	return ConvertWithConfig[T](input, transCfg)
}
