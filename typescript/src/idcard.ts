// 中国大陆 18 位居民身份证号码的校验与解析（GB 11643-1999）。

import { readFileSync } from "node:fs";

// 前 17 位的加权因子与余数对应的校验码。
const WEIGHTS = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2] as const;
const CHECK_CODES = "10X98765432";

export type Gender = "男" | "女";

export interface IDCard {
  regionCode: string; // 前 6 位行政区划代码
  birthDate: string; // 第 7-14 位，格式 YYYYMMDD
  gender: Gender;
}

export class InvalidIDCardError extends Error {}

/** 计算前 17 位数字对应的校验码。 */
export function expectedCheckCode(body: string): string {
  let sum = 0;
  for (let i = 0; i < WEIGHTS.length; i++) {
    sum += Number(body[i]) * WEIGHTS[i];
  }
  return CHECK_CODES[sum % 11];
}

/** 解析并校验身份证号码，不合法时抛出 {@link InvalidIDCardError}。 */
export function parse(idcard: string): IDCard {
  if (idcard.length !== 18) {
    throw new InvalidIDCardError("长度必须为 18 位");
  }
  const body = idcard.slice(0, 17);
  if (!/^\d{17}$/.test(body)) {
    throw new InvalidIDCardError("前 17 位必须为数字");
  }
  if (idcard[17].toUpperCase() !== expectedCheckCode(body)) {
    throw new InvalidIDCardError("校验码不匹配");
  }
  return {
    regionCode: idcard.slice(0, 6),
    birthDate: idcard.slice(6, 14),
    gender: Number(idcard[16]) % 2 ? "男" : "女",
  };
}

/** 判断身份证号码是否合法。 */
export function isValid(idcard: string): boolean {
  try {
    parse(idcard);
    return true;
  } catch {
    return false;
  }
}

/** 加载行政区划代码到名称的映射表。 */
export function loadRegions(path: string): Record<string, string> {
  return JSON.parse(readFileSync(path, "utf-8")) as Record<string, string>;
}
