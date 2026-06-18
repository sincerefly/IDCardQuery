import test from "node:test";
import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { parse, isValid, loadRegions, expectedCheckCode } from "./idcard.ts";

test("解析合法号码（女）", () => {
  assert.deepEqual(parse("431025197610125362"), {
    regionCode: "431025",
    birthDate: "19761012",
    gender: "女",
  });
});

test("解析合法号码（男）", () => {
  const info = parse("110101199001010015");
  assert.equal(info.regionCode, "110101");
  assert.equal(info.birthDate, "19900101");
  assert.equal(info.gender, "男");
});

test("校验码 X 大小写均接受", () => {
  assert.equal(parse("11010119900101100X").gender, "女");
  assert.ok(isValid("11010119900101100x"));
});

test("非法号码抛出 InvalidIDCardError", () => {
  assert.throws(() => parse("431025197610125361"), { message: "校验码不匹配" });
  assert.throws(() => parse("12345"), { message: "长度必须为 18 位" });
  assert.throws(() => parse("A31025197610125362"), { message: "前 17 位必须为数字" });
});

test("isValid 判断", () => {
  assert.ok(isValid("431025197610125362"));
  assert.ok(!isValid("431025197610125361"));
  assert.ok(!isValid(""));
});

test("expectedCheckCode 计算", () => {
  assert.equal(expectedCheckCode("43102519761012536"), "2");
  assert.equal(expectedCheckCode("11010119900101100"), "X");
});

test("行政区划查询", () => {
  const path = join(tmpdir(), "idcard_test_data.json");
  writeFileSync(path, JSON.stringify({ "431025": "湖南省临武县" }));
  assert.equal(loadRegions(path)["431025"], "湖南省临武县");
});
