use std::process::exit;

use idcard::{load_regions, parse};

// data.json 可能所在的相对路径（兼容不同的运行目录）。
const DATA_CANDIDATES: [&str; 3] = ["data.json", "../data.json", "../../data.json"];

fn main() {
    let args: Vec<String> = std::env::args().collect();
    if args.len() != 2 {
        eprintln!("用法: {} <身份证号码>", args[0]);
        exit(2);
    }

    let info = match parse(&args[1]) {
        Ok(info) => info,
        Err(err) => {
            println!("<身份证不合法> {err}");
            exit(1);
        }
    };

    let region = DATA_CANDIDATES
        .iter()
        .find_map(|path| load_regions(path).ok())
        .and_then(|regions| regions.get(&info.region_code).cloned())
        .unwrap_or_else(|| "未知".to_string());

    println!("<身份证合法>");
    println!("性别：{}", info.gender);
    println!("出生日期：{}", info.birth_date);
    println!("归属地：{region}");
}
