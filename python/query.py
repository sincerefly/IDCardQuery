#!/bin/env python
# -*- coding: utf-8 -*-

from sys import platform
import json

with open('data.json', 'r') as json_data:
    city = json.load(json_data)

def convert_encode(string):

    ''' Windows 输出需转换编码
    '''
    return string if platform != "win32" else string.decode('utf-8').encode('gbk')

idcard = str(input(convert_encode('请输入身份证号码：')))

# 城市编码, 出生日期, 归属地 
city_id = idcard[:6]
birth = idcard[6:14]
city_name = city[city_id].encode('utf-8')

# 根据规则校验身份证是否符合规则
idcard_tuple = [int(num) for num in list(idcard[:-1])]
coefficient = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
sum_value = sum([idcard_tuple[i] * coefficient[i] for i in range(17)])

remainder = sum_value % 11

maptable = {0: '1', 1: '0', 2: 'x', 3: '9', 4: '8', 5: '7', 6: '6', 7: '5', 8: '4', 9: '3', 10: '2'}
if maptable[remainder] == idcard[17]:
    print(convert_encode('<身份证合法>'))
    sex = int(idcard[16]) % 2
    sex = '男' if sex == 1 else '女'
    print(convert_encode('性别：' + sex))
    print(convert_encode('出生日期:') + birth)
    print(convert_encode('归属地:' + city_name))
else :
    print(convert_encode('<身份证不合法>'))


