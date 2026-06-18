# -*- coding: utf-8 -*-
"""中国大陆 18 位居民身份证号码的校验与信息解析。

校验规则参见 GB 11643-1999《公民身份号码》：
将前 17 位分别乘以对应加权因子求和，对 11 取模，余数映射到校验码。
"""
from __future__ import annotations

import json
import sys
from dataclasses import dataclass
from enum import Enum
from pathlib import Path

# 前 17 位的加权因子与余数对应的校验码（GB 11643-1999）
WEIGHTS = (7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2)
CHECK_CODES = "10X98765432"

# data.json 位于仓库根目录
DATA_FILE = Path(__file__).resolve().parent.parent / "data.json"


class Gender(Enum):
    MALE = "男"
    FEMALE = "女"


class InvalidIDCard(ValueError):
    """身份证号码不合法时抛出。"""


@dataclass(frozen=True)
class IDCard:
    """从合法身份证号码中解析出的信息。"""

    region_code: str  # 前 6 位行政区划代码
    birth_date: str   # 第 7-14 位，格式 YYYYMMDD
    gender: Gender


def _expected_check_code(body: str) -> str:
    """计算前 17 位数字对应的校验码。"""
    total = sum(int(ch) * weight for ch, weight in zip(body, WEIGHTS))
    return CHECK_CODES[total % 11]


def parse(idcard: str) -> IDCard:
    """解析并校验身份证号码，不合法时抛出 :class:`InvalidIDCard`。"""
    if len(idcard) != 18:
        raise InvalidIDCard("长度必须为 18 位")

    body, check = idcard[:17], idcard[17]
    if not body.isdigit():
        raise InvalidIDCard("前 17 位必须为数字")
    if check.upper() != _expected_check_code(body):
        raise InvalidIDCard("校验码不匹配")

    gender = Gender.MALE if int(idcard[16]) % 2 else Gender.FEMALE
    return IDCard(region_code=idcard[:6], birth_date=idcard[6:14], gender=gender)


def is_valid(idcard: str) -> bool:
    """判断身份证号码是否合法。"""
    try:
        parse(idcard)
        return True
    except InvalidIDCard:
        return False


def load_regions(path: Path = DATA_FILE) -> dict[str, str]:
    """加载行政区划代码到名称的映射表。"""
    with open(path, encoding="utf-8") as fp:
        return json.load(fp)


def main(argv: list[str] | None = None) -> int:
    argv = sys.argv if argv is None else argv
    if len(argv) != 2:
        print(f"用法: python3 {Path(argv[0]).name} <身份证号码>")
        return 2

    try:
        info = parse(argv[1])
    except InvalidIDCard as exc:
        print(f"<身份证不合法> {exc}")
        return 1

    region = load_regions().get(info.region_code, "未知")
    print("<身份证合法>")
    print(f"性别：{info.gender.value}")
    print(f"出生日期：{info.birth_date}")
    print(f"归属地：{region}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
