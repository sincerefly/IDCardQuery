package main

import (
	"fmt"
	"os"

	"github.com/sincerefly/IDCardQuery/golang/idcard"
)

// dataCandidates 是 data.json 可能所在的相对路径（兼容不同的运行目录）。
var dataCandidates = []string{"data.json", "../data.json", "../../data.json"}

func loadRegions() map[string]string {
	for _, path := range dataCandidates {
		if regions, err := idcard.LoadRegions(path); err == nil {
			return regions
		}
	}
	return nil
}

func main() {
	if len(os.Args) != 2 {
		fmt.Printf("用法: %s <身份证号码>\n", os.Args[0])
		os.Exit(2)
	}

	info, err := idcard.Parse(os.Args[1])
	if err != nil {
		fmt.Printf("<身份证不合法> %v\n", err)
		os.Exit(1)
	}

	region := "未知"
	if name, ok := loadRegions()[info.RegionCode]; ok {
		region = name
	}

	fmt.Println("<身份证合法>")
	fmt.Printf("性别：%s\n", info.Gender)
	fmt.Printf("出生日期：%s\n", info.BirthDate)
	fmt.Printf("归属地：%s\n", region)
}
