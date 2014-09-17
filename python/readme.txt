使用已定义成字典形式的“ data.txt”生成pickle
city = {'110000':'北京市',
        '110100':'北京市市辖区',
        ...
       }
import pickle
pickle_file = open('cityid_data.pkl', 'wb')
pickle.dump(city, pickle_file)
pickle_file.close()

然后直接运行query.py程序进行查询

