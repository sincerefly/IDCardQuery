package idcard

import (
	"os"
	"path/filepath"
	"testing"
)

func TestParseValid(t *testing.T) {
	tests := []struct {
		id     string
		region string
		birth  string
		gender Gender
	}{
		{"431025197610125362", "431025", "19761012", Female},
		{"110101199001010015", "110101", "19900101", Male},
		{"11010119900101100X", "110101", "19900101", Female},
		{"11010119900101100x", "110101", "19900101", Female}, // 小写 x 亦可
	}
	for _, tt := range tests {
		got, err := Parse(tt.id)
		if err != nil {
			t.Fatalf("Parse(%q) 返回错误: %v", tt.id, err)
		}
		if got.RegionCode != tt.region || got.BirthDate != tt.birth || got.Gender != tt.gender {
			t.Errorf("Parse(%q) = %+v, 期望 region=%s birth=%s gender=%s",
				tt.id, got, tt.region, tt.birth, tt.gender)
		}
	}
}

func TestParseInvalid(t *testing.T) {
	tests := []struct {
		id  string
		err error
	}{
		{"431025197610125361", ErrCheck},
		{"12345", ErrLength},
		{"A31025197610125362", ErrDigit},
		{"", ErrLength},
	}
	for _, tt := range tests {
		if _, err := Parse(tt.id); err != tt.err {
			t.Errorf("Parse(%q) 错误 = %v, 期望 %v", tt.id, err, tt.err)
		}
	}
}

func TestIsValid(t *testing.T) {
	if !IsValid("431025197610125362") {
		t.Error("期望合法")
	}
	if IsValid("431025197610125361") {
		t.Error("期望不合法")
	}
}

func TestGenderString(t *testing.T) {
	if Male.String() != "男" || Female.String() != "女" {
		t.Error("性别字符串不正确")
	}
}

func TestLoadRegions(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "data.json")
	if err := os.WriteFile(path, []byte(`{"431025":"湖南省临武县"}`), 0o644); err != nil {
		t.Fatal(err)
	}
	regions, err := LoadRegions(path)
	if err != nil {
		t.Fatal(err)
	}
	if regions["431025"] != "湖南省临武县" {
		t.Errorf("归属地 = %q", regions["431025"])
	}
}
