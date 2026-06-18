"use strict";

// 前 17 位的加权因子与余数对应的校验码（GB 11643-1999）
const WEIGHTS = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
const CHECK_CODES = "10X98765432";

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

/** 表单查询按钮的处理函数。 */
async function query() {
  const idcard = document.getElementById("idcard").value.trim();
  const $ = (id) => document.getElementById(id);
  $("sex").textContent = $("birth").textContent = $("addr").textContent = "";

  let info;
  try {
    info = parse(idcard);
  } catch (err) {
    $("valid").textContent = `<身份证非法> ${err.message}`;
    return;
  }

  const regions = await fetch("../data.json").then((r) => r.json());
  $("valid").textContent = "<身份证合法>";
  $("sex").textContent = info.gender;
  $("birth").textContent = info.birthDate;
  $("addr").textContent = regions[info.regionCode] ?? "未知";
}
