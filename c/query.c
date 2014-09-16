#include <stdio.h>
#include <stdlib.h>
#include <string.h>
 
#define IDLEN 18
#define AREALEN 6
#define BIRTHLEN 8
#define FILEURL "./data.txt"
 
int LegalInput(char p[])
{
    int i;
    printf("Please input you ID card\n>");
    fgets(p, (sizeof(char)+1)*IDLEN, stdin);
     
    /* 判断输入数据的长度是否合法 */
    if((strlen(p)-1) != IDLEN) {
        printf("Error! You need input the '18' length ID card\n");
        return EXIT_FAILURE;
    }
     
    /* 判断输入的前17位是否为数字 */
    for(i = 0; i<IDLEN-1; i++) {
        if(!isdigit(p[i])) {
            printf("Error! You need input the right num\n");
            return EXIT_FAILURE;
        }
    }
         
    /* 判断第18位是否为数字或是字符'X|x'*/
    if(!isdigit(p[IDLEN-1]) && (p[IDLEN-1] != 'x') && (p[IDLEN-1] != 'X')) {
        printf("Error! You need input the right num\n");
        return EXIT_FAILURE;       
    }
         
    return EXIT_SUCCESS;
}
 
int LegalID(char p[], int q[])
{
    int i, sum, remainder;
 
    /*将输入的字符转化为数字*/
    for(i = 0; i< IDLEN-1; i++)
        q[i+1] =  p[i] - '0';
     
    //1，求出前17位和系数相乘的和
    //  对应的系数为 7 9 10 5 8 4 2 1 6 3 7 9 10 5 8 4 2
    sum = q[1]*7 + q[2]*9 + q[3]*10 + q[4]*5 + q[5]*8 + q[6]*4 + q[7]*2 
           + q[8]*1 + q[9]*6 + q[10]*3 +q[11]*7 + q[12]*9 + q[13]*10
           + q[14]*5  + q[15]*8 + q[16]*4 + q[17]*2; 
     
    // 2，求余       
    remainder = sum % 11;
 
    //3，余数只可能有0～10这11个结果
     //对应的最后一位身份证号码为1 0 X 9 8 7 6 5 4 3 2
    char tmp[12] = {'1', '0', 'x', '9', '8', '7', '6', '5', '4', '3', '2'};
    if(remainder == 2) {
        if(p[IDLEN-1] != 'x' && p[IDLEN-1] != 'X') {
            printf("Error! You need input the right num\n");
            return EXIT_FAILURE;
        }
    }
    else {
        if(p[IDLEN-1] != tmp[remainder]) {
            printf("Error! You need input the right num\n");
            return EXIT_FAILURE;
        }
    }
     
    return EXIT_SUCCESS;
}
 
int main(void)
{
    int i, sex;
    char buf[1024], *p1, *p2;
    char userInput_char[IDLEN+1];
    int userInput_int[IDLEN+1]; //从[1]开始使用
    char userInputArea[AREALEN+1];
    char userInputBirth[BIRTHLEN+1];
    char tmp[AREALEN+1];
    char Area[30];
 
    FILE * fpr;
    /* 打开文件 */
    if((fpr = fopen(FILEURL, "r")) == NULL)
    {
        printf("Open file failed.\n");
        return EXIT_FAILURE;
    }
     
    memset(buf, 0, sizeof(buf));
     
    /* 判断输入是否合法 */
    int ret = -1;
    while(ret != EXIT_SUCCESS) {
        if(LegalInput(userInput_char) == EXIT_SUCCESS)
            ret = LegalID(userInput_char, userInput_int);
    }
     
    /* 保存前1-6位 地区 */
    for(i = 0; i<AREALEN; i++)
        userInputArea[i] = userInput_char[i];
     
    /* 保存第7-14为 出生日期 */
    int ii = 0;
    for(i = AREALEN; i<AREALEN+BIRTHLEN; i++)
        userInputBirth[ii++] = userInput_char[i];
    userInputBirth[ii] = 0;
     
    /* 第17位 代表性别 sex=1 男, sex=0 女*/
    if((userInput_int[17] % 2) == 0)
        sex = 0;
    else
        sex = 1;
     
    /* 从文件中读取数据 */
    while(fgets(buf, sizeof(buf), fpr) != NULL)
    {
        /* p1指向第一个":"，p2指向第二个":" */    
        p1 = strstr(buf, ":");
        p1++;
        p2 = p1+7;
         
        /* 获得文件中的地区ID */
        for(i = 0; i< AREALEN; i++)
            tmp[i] = p1[i];
        tmp[i] = 0;
         
        /* 输出所在地 */
        if(strcmp(userInputArea, tmp) == 0) {
            //printf("%s\n", p2);
            strcpy(Area, p2);
            break;
        }
        /* 清楚内存 */
        memset(buf, 0, sizeof(buf));
    }
    fclose(fpr);
     
    printf("出生地：%s", Area);
    printf("出生日期：%s\n", userInputBirth);
    if(sex == 1)
        printf("性别：男\n");
    else
        printf("性别：女\n");
         
    return 0;
}
