//! 中国大陆 18 位居民身份证号码的校验与解析（GB 11643-1999）。

use std::collections::HashMap;
use std::fmt;

/// 前 17 位的加权因子与余数对应的校验码。
const WEIGHTS: [u32; 17] = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
const CHECK_CODES: &[u8; 11] = b"10X98765432";

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Gender {
    Female,
    Male,
}

impl fmt::Display for Gender {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(match self {
            Gender::Male => "男",
            Gender::Female => "女",
        })
    }
}

/// 从合法身份证号码中解析出的信息。
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct IdCard {
    pub region_code: String, // 前 6 位行政区划代码
    pub birth_date: String,  // 第 7-14 位，格式 YYYYMMDD
    pub gender: Gender,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ParseError {
    Length,
    Digit,
    Check,
}

impl fmt::Display for ParseError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(match self {
            ParseError::Length => "长度必须为 18 位",
            ParseError::Digit => "前 17 位必须为数字",
            ParseError::Check => "校验码不匹配",
        })
    }
}

impl std::error::Error for ParseError {}

/// 计算前 17 位数字 `body` 对应的校验码（`b'0'`-`b'9'` 或 `b'X'`）。
pub fn expected_check_code(body: &[u8]) -> u8 {
    let sum: u32 = (0..17).map(|i| u32::from(body[i] - b'0') * WEIGHTS[i]).sum();
    CHECK_CODES[(sum % 11) as usize]
}

/// 解析并校验身份证号码。
pub fn parse(id: &str) -> Result<IdCard, ParseError> {
    let bytes = id.as_bytes();
    if bytes.len() != 18 {
        return Err(ParseError::Length);
    }
    let body = &bytes[..17];
    if !body.iter().all(u8::is_ascii_digit) {
        return Err(ParseError::Digit);
    }
    if bytes[17].to_ascii_uppercase() != expected_check_code(body) {
        return Err(ParseError::Check);
    }
    // body 已确认为 ASCII 数字，按字节切片不会越过字符边界。
    let gender = if (bytes[16] - b'0') % 2 == 1 {
        Gender::Male
    } else {
        Gender::Female
    };
    Ok(IdCard {
        region_code: id[..6].to_string(),
        birth_date: id[6..14].to_string(),
        gender,
    })
}

/// 判断身份证号码是否合法。
pub fn is_valid(id: &str) -> bool {
    parse(id).is_ok()
}

/// 加载行政区划代码到名称的映射表。
pub fn load_regions(path: &str) -> std::io::Result<HashMap<String, String>> {
    let content = std::fs::read_to_string(path)?;
    Ok(parse_flat_json(&content))
}

/// 解析形如 `{"key":"value", ...}` 的扁平字符串对象。
/// data.json 不含转义字符，因此可按引号切分。
fn parse_flat_json(s: &str) -> HashMap<String, String> {
    let quoted: Vec<&str> = s
        .split('"')
        .enumerate()
        .filter_map(|(i, tok)| (i % 2 == 1).then_some(tok))
        .collect();
    quoted
        .chunks_exact(2)
        .map(|kv| (kv[0].to_string(), kv[1].to_string()))
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parse_valid() {
        assert_eq!(
            parse("431025197610125362").unwrap(),
            IdCard {
                region_code: "431025".into(),
                birth_date: "19761012".into(),
                gender: Gender::Female,
            }
        );
        let male = parse("110101199001010015").unwrap();
        assert_eq!(male.region_code, "110101");
        assert_eq!(male.birth_date, "19900101");
        assert_eq!(male.gender, Gender::Male);
    }

    #[test]
    fn check_code_x_case_insensitive() {
        assert!(is_valid("11010119900101100X"));
        assert!(is_valid("11010119900101100x"));
    }

    #[test]
    fn parse_invalid() {
        assert_eq!(parse("431025197610125361"), Err(ParseError::Check));
        assert_eq!(parse("12345"), Err(ParseError::Length));
        assert_eq!(parse("A31025197610125362"), Err(ParseError::Digit));
        assert_eq!(parse(""), Err(ParseError::Length));
    }

    #[test]
    fn check_code_fn() {
        assert_eq!(expected_check_code(b"43102519761012536"), b'2');
        assert_eq!(expected_check_code(b"11010119900101100"), b'X');
    }

    #[test]
    fn gender_display() {
        assert_eq!(Gender::Male.to_string(), "男");
        assert_eq!(Gender::Female.to_string(), "女");
    }

    #[test]
    fn flat_json_parsing() {
        let map = parse_flat_json(r#"{"431025":"湖南省临武县","110101":"北京市东城区"}"#);
        assert_eq!(map.get("431025").map(String::as_str), Some("湖南省临武县"));
        assert_eq!(map.get("110101").map(String::as_str), Some("北京市东城区"));
        assert_eq!(map.len(), 2);
    }
}
