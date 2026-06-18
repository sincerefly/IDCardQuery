#include "idcard.h"

#include <stdio.h>
#include <string.h>

#define DATA_FILE "./data.txt"
#define LINE_MAX 256

/* 在 data.txt 中按区划代码查询归属地，写入 name（容量 size）。
 * data.txt 每行格式为 ":代码:名称"。找到返回 1，否则返回 0。 */
static int lookup_region(const char *code, char *name, size_t size)
{
    FILE *fp = fopen(DATA_FILE, "r");
    if (fp == NULL) {
        return 0;
    }

    char line[LINE_MAX];
    int found = 0;
    while (fgets(line, sizeof(line), fp) != NULL) {
        /* 行格式 ":110101:北京市东城区\n" */
        if (line[0] != ':' || strncmp(line + 1, code, 6) != 0) {
            continue;
        }
        char *value = line + 1 + 6 + 1; /* 跳过 ':代码:' */
        value[strcspn(value, "\r\n")] = '\0';
        snprintf(name, size, "%s", value);
        found = 1;
        break;
    }

    fclose(fp);
    return found;
}

int main(int argc, char *argv[])
{
    char buf[64];
    const char *id;

    if (argc == 2) {
        id = argv[1];
    } else {
        printf("请输入 18 位身份证号码:\n> ");
        if (fgets(buf, sizeof(buf), stdin) == NULL) {
            return 1;
        }
        buf[strcspn(buf, "\r\n")] = '\0';
        id = buf;
    }

    idcard_t info;
    idcard_status_t status = idcard_parse(id, &info);
    if (status != IDCARD_OK) {
        printf("<身份证不合法> %s\n", idcard_strerror(status));
        return 1;
    }

    char region[64];
    if (!lookup_region(info.region_code, region, sizeof(region))) {
        snprintf(region, sizeof(region), "未知");
    }

    printf("<身份证合法>\n");
    printf("性别：%s\n", info.gender == GENDER_MALE ? "男" : "女");
    printf("出生日期：%s\n", info.birth_date);
    printf("归属地：%s\n", region);
    return 0;
}
