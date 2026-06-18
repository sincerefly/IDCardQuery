#ifndef IDCARD_H
#define IDCARD_H

/* 中国大陆 18 位居民身份证号码的校验与解析（GB 11643-1999）。 */

typedef enum {
    GENDER_FEMALE = 0,
    GENDER_MALE = 1
} gender_t;

typedef struct {
    char region_code[7]; /* 前 6 位行政区划代码 + '\0' */
    char birth_date[9];  /* 第 7-14 位 YYYYMMDD + '\0' */
    gender_t gender;
} idcard_t;

typedef enum {
    IDCARD_OK = 0,
    IDCARD_ERR_LENGTH = -1, /* 长度不是 18 位 */
    IDCARD_ERR_DIGIT = -2,  /* 前 17 位含非数字 */
    IDCARD_ERR_CHECK = -3   /* 校验码不匹配 */
} idcard_status_t;

/* 计算前 17 位数字（body 至少 17 字符）对应的校验码，返回 '0'-'9' 或 'X'。 */
char idcard_check_code(const char *body);

/* 解析并校验身份证号码，成功时填充 *out 并返回 IDCARD_OK。 */
idcard_status_t idcard_parse(const char *id, idcard_t *out);

/* 返回状态码对应的中文描述。 */
const char *idcard_strerror(idcard_status_t status);

#endif /* IDCARD_H */
