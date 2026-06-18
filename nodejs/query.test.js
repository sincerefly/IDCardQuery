"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { parse, isValid, loadRegions } = require("./query");

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

test("校验码错误抛出异常", () => {
  assert.throws(() => parse("431025197610125361"));
});

test("长度错误抛出异常", () => {
  assert.throws(() => parse("12345"));
});

test("前 17 位含非数字抛出异常", () => {
  assert.throws(() => parse("43102519761012536A"));
});

test("isValid 判断", () => {
  assert.ok(isValid("431025197610125362"));
  assert.ok(!isValid("431025197610125361"));
  assert.ok(!isValid(""));
});

test("行政区划查询", () => {
  const regions = loadRegions();
  assert.equal(regions["431025"], "湖南省临武县");
  assert.equal(regions["110101"], "北京市东城区");
});
