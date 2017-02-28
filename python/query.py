#!/bin/env python
# -*- coding: utf-8 -*-

import pickle

pickle_file = open('data.pkl', 'rb')
city = pickle.load(pickle_file)

idcard_number = str(input('请输入身份证号码：'))
i = idcard_number
cid = idcard_number[:6]
birth = idcard_number[6:14]
cname = city[cid]

num = int(i[1])
tmpsum = int(i[0])*7 + int(i[1])*9 + int(i[2])*10 + int(i[3])*5 + int(i[4])*8 \
        + int(i[5])*4 + int(i[6])*2 + int(i[7])*1 + int(i[8])*6 + int(i[9])*3 \
        + int(i[10])*7 + int(i[11])*9 + int(i[12])*10 + int(i[13])*5 \
        + int(i[14])*8 + int(i[15])*4 + int(i[16])*2;

remainder = tmpsum % 11

maptable = {0: '1', 1: '0', 2: 'x', 3: '9', 4: '8', 5: '7', 6: '6', 7: '5', 8: '4', 9: '3', 10: '2'}
if maptable[remainder] == i[17]:
    print('<身份证合法>')

    sex = int(i[16]) % 2
    sex = '男' if sex == 1 else '女'
    print('性别：' + sex)

    print('出生日期:' + birth)
    print('归属地:' + cname)
else :
    print('<身份证不合法>')



