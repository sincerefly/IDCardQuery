// CLI 入口：node src/query.ts <身份证号码>

import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { parse, loadRegions, InvalidIDCardError } from "./idcard.ts";

// data.json 位于仓库根目录
const here = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(here, "..", "..", "data.json");

function main(argv: string[]): number {
  const idcard = argv[2];
  if (!idcard) {
    console.log("用法: node src/query.ts <身份证号码>");
    return 2;
  }
  try {
    const info = parse(idcard);
    const region = loadRegions(DATA_FILE)[info.regionCode] ?? "未知";
    console.log("<身份证合法>");
    console.log(`性别：${info.gender}`);
    console.log(`出生日期：${info.birthDate}`);
    console.log(`归属地：${region}`);
    return 0;
  } catch (err) {
    if (err instanceof InvalidIDCardError) {
      console.log(`<身份证不合法> ${err.message}`);
      return 1;
    }
    throw err;
  }
}

process.exit(main(process.argv));
