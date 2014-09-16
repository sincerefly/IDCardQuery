import pickle
 
pickle_file = open('data.pkl', 'rb')
city = pickle.load(pickle_file)
 
str = input('请输入身份证号码：')
cid = str[:6]
birth = str[6:14]
cname = city[cid]
 
num = int(str[1])
tmpsum = int(str[0])*7 + int(str[1])*9 + int(str[2])*10 + int(str[3])*5 + int(str[4])*8 \
        + int(str[5])*4 + int(str[6])*2 + int(str[7])*1 + int(str[8])*6 + int(str[9])*3 \
        + int(str[10])*7 + int(str[11])*9 + int(str[12])*10 + int(str[13])*5 \
        + int(str[14])*8 + int(str[15])*4 + int(str[16])*2;
 
remainder = tmpsum % 11
 
sex = int(str[16]) % 2
if sex == 1:
    sex = '男'
else :
    sex = '女'
 
maptable = {0: '1', 1: '0', 2: 'x', 3: '9', 4: '8', 5: '7', 6: '6', 7: '5', 8: '4', 9: '3', 10: '2'}
if maptable[remainder] == str[17]:
    print('<身份证合法>')
    print('性别：' + sex)
    print('出生日期:' + birth)
    print('归属地:' + cname)
else :
    print('<身份证不合法>')
