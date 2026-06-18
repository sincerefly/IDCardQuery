#include "idcard.h"

#include <ctype.h>
#include <string.h>

#define ID_LEN 18
#define BODY_LEN 17

/* 前 17 位的加权因子与余数对应的校验码（GB 11643-1999）。 */
static const int WEIGHTS[BODY_LEN] = {7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2};
static const char CHECK_CODES[] = "10X98765432";

char idcard_check_code(const char *body)
{
    int sum = 0;
    for (int i = 0; i < BODY_LEN; i++) {
        sum += (body[i] - '0') * WEIGHTS[i];
    }
    return CHECK_CODES[sum % 11];
}

idcard_status_t idcard_parse(const char *id, idcard_t *out)
{
    if (id == NULL || strlen(id) != ID_LEN) {
        return IDCARD_ERR_LENGTH;
    }

    for (int i = 0; i < BODY_LEN; i++) {
        if (!isdigit((unsigned char)id[i])) {
            return IDCARD_ERR_DIGIT;
        }
    }

    if (toupper((unsigned char)id[BODY_LEN]) != idcard_check_code(id)) {
        return IDCARD_ERR_CHECK;
    }

    memcpy(out->region_code, id, 6);
    out->region_code[6] = '\0';
    memcpy(out->birth_date, id + 6, 8);
    out->birth_date[8] = '\0';
    out->gender = ((id[16] - '0') % 2) ? GENDER_MALE : GENDER_FEMALE;
    return IDCARD_OK;
}

const char *idcard_strerror(idcard_status_t status)
{
    switch (status) {
    case IDCARD_OK:         return "合法";
    case IDCARD_ERR_LENGTH: return "长度必须为 18 位";
    case IDCARD_ERR_DIGIT:  return "前 17 位必须为数字";
    case IDCARD_ERR_CHECK:  return "校验码不匹配";
    default:                return "未知错误";
    }
}
