# -*- coding: utf-8 -*-
"""query 模块的单元测试。运行： python3 -m pytest 或 python3 -m unittest"""
import unittest

import query
from query import Gender, IDCard, InvalidIDCard


class TestParse(unittest.TestCase):
    def test_valid_female(self):
        info = query.parse("431025197610125362")
        self.assertEqual(
            info, IDCard(region_code="431025", birth_date="19761012", gender=Gender.FEMALE)
        )

    def test_valid_male(self):
        info = query.parse("110101199001010015")
        self.assertEqual(info.region_code, "110101")
        self.assertEqual(info.birth_date, "19900101")
        self.assertEqual(info.gender, Gender.MALE)

    def test_check_code_x_uppercase(self):
        self.assertEqual(query.parse("11010119900101100X").gender, Gender.FEMALE)

    def test_check_code_x_lowercase(self):
        # 校验码 X 大小写均应接受
        self.assertTrue(query.is_valid("11010119900101100x"))

    def test_wrong_check_code(self):
        with self.assertRaises(InvalidIDCard):
            query.parse("431025197610125361")

    def test_wrong_length(self):
        with self.assertRaises(InvalidIDCard):
            query.parse("12345")

    def test_non_digit_body(self):
        with self.assertRaises(InvalidIDCard):
            query.parse("43102519761012536A")


class TestIsValid(unittest.TestCase):
    def test_valid(self):
        self.assertTrue(query.is_valid("431025197610125362"))

    def test_invalid(self):
        self.assertFalse(query.is_valid("431025197610125361"))
        self.assertFalse(query.is_valid(""))


class TestRegions(unittest.TestCase):
    def test_lookup(self):
        regions = query.load_regions()
        self.assertEqual(regions["431025"], "湖南省临武县")
        self.assertEqual(regions["110101"], "北京市东城区")


if __name__ == "__main__":
    unittest.main()
