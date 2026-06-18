// Package idcard 提供中国大陆 18 位居民身份证号码的校验与解析（GB 11643-1999）。
package idcard

import (
	"encoding/json"
	"errors"
	"os"
)

// weights 为前 17 位的加权因子，checkCodes 为余数对应的校验码。
var weights = [17]int{7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2}

const checkCodes = "10X98765432"

// Gender 表示性别。
type Gender int

const (
	Female Gender = iota
	Male
)

func (g Gender) String() string {
	if g == Male {
		return "男"
	}
	return "女"
}

// IDCard 是从合法身份证号码中解析出的信息。
type IDCard struct {
	RegionCode string // 前 6 位行政区划代码
	BirthDate  string // 第 7-14 位，格式 YYYYMMDD
	Gender     Gender
}

// 解析过程中可能返回的错误。
var (
	ErrLength = errors.New("长度必须为 18 位")
	ErrDigit  = errors.New("前 17 位必须为数字")
	ErrCheck  = errors.New("校验码不匹配")
)

// ExpectedCheckCode 计算前 17 位数字 body 对应的校验码（'0'-'9' 或 'X'）。
func ExpectedCheckCode(body string) byte {
	sum := 0
	for i := 0; i < 17; i++ {
		sum += int(body[i]-'0') * weights[i]
	}
	return checkCodes[sum%11]
}

// Parse 解析并校验身份证号码。
func Parse(id string) (IDCard, error) {
	if len(id) != 18 {
		return IDCard{}, ErrLength
	}
	body := id[:17]
	for i := 0; i < 17; i++ {
		if body[i] < '0' || body[i] > '9' {
			return IDCard{}, ErrDigit
		}
	}
	if toUpper(id[17]) != ExpectedCheckCode(body) {
		return IDCard{}, ErrCheck
	}
	gender := Female
	if (id[16]-'0')%2 == 1 {
		gender = Male
	}
	return IDCard{RegionCode: id[:6], BirthDate: id[6:14], Gender: gender}, nil
}

// IsValid 判断身份证号码是否合法。
func IsValid(id string) bool {
	_, err := Parse(id)
	return err == nil
}

// LoadRegions 加载行政区划代码到名称的映射表。
func LoadRegions(path string) (map[string]string, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	var regions map[string]string
	if err := json.Unmarshal(data, &regions); err != nil {
		return nil, err
	}
	return regions, nil
}

func toUpper(b byte) byte {
	if b >= 'a' && b <= 'z' {
		return b - 'a' + 'A'
	}
	return b
}
