"use strict";

const fs = require("fs");
const path = require("path");

// 前 17 位的加权因子与余数对应的校验码（GB 11643-1999）
const WEIGHTS = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
const CHECK_CODES = "10X98765432";

// data.json 位于仓库根目录
const DATA_FILE = path.join(__dirname, "..", "data.json");

/** 计算前 17 位数字对应的校验码。 */
function expectedCheckCode(body) {
  let sum = 0;
  for (let i = 0; i < WEIGHTS.length; i++) {
    sum += Number(body[i]) * WEIGHTS[i];
  }
  return CHECK_CODES[sum % 11];
}

/**
 * 解析并校验身份证号码。
 * @returns {{regionCode: string, birthDate: string, gender: "男"|"女"}}
 * @throws {Error} 号码不合法时抛出
 */
function parse(idcard) {
  if (typeof idcard !== "string" || idcard.length !== 18) {
    throw new Error("长度必须为 18 位");
  }
  const body = idcard.slice(0, 17);
  if (!/^\d{17}$/.test(body)) {
    throw new Error("前 17 位必须为数字");
  }
  if (idcard[17].toUpperCase() !== expectedCheckCode(body)) {
    throw new Error("校验码不匹配");
  }
  return {
    regionCode: idcard.slice(0, 6),
    birthDate: idcard.slice(6, 14),
    gender: Number(idcard[16]) % 2 ? "男" : "女",
  };
}

/** 判断身份证号码是否合法。 */
function isValid(idcard) {
  try {
    parse(idcard);
    return true;
  } catch {
    return false;
  }
}

/** 加载行政区划代码到名称的映射表。 */
function loadRegions(file = DATA_FILE) {
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

function main(argv) {
  const idcard = argv[2];
  if (!idcard) {
    console.log(`用法: node ${path.basename(argv[1])} <身份证号码>`);
    return 2;
  }
  let info;
  try {
    info = parse(idcard);
  } catch (err) {
    console.log(`<身份证不合法> ${err.message}`);
    return 1;
  }
  const region = loadRegions()[info.regionCode] ?? "未知";
  console.log("<身份证合法>");
  console.log(`性别：${info.gender}`);
  console.log(`出生日期：${info.birthDate}`);
  console.log(`归属地：${region}`);
  return 0;
}

module.exports = { parse, isValid, loadRegions, expectedCheckCode, WEIGHTS, CHECK_CODES };

if (require.main === module) {
  process.exit(main(process.argv));
}
