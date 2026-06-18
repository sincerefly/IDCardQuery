#include "idcard.h"

#include <stdio.h>
#include <string.h>

static int failures = 0;

#define CHECK(cond)                                                  \
    do {                                                             \
        if (cond) {                                                  \
            printf("  ok: %s\n", #cond);                             \
        } else {                                                     \
            printf("FAIL: %s (%s:%d)\n", #cond, __FILE__, __LINE__); \
            failures++;                                              \
        }                                                            \
    } while (0)

static void test_valid_female(void)
{
    idcard_t info;
    CHECK(idcard_parse("431025197610125362", &info) == IDCARD_OK);
    CHECK(strcmp(info.region_code, "431025") == 0);
    CHECK(strcmp(info.birth_date, "19761012") == 0);
    CHECK(info.gender == GENDER_FEMALE);
}

static void test_valid_male(void)
{
    idcard_t info;
    CHECK(idcard_parse("110101199001010015", &info) == IDCARD_OK);
    CHECK(strcmp(info.region_code, "110101") == 0);
    CHECK(info.gender == GENDER_MALE);
}

static void test_check_code_x(void)
{
    idcard_t info;
    CHECK(idcard_parse("11010119900101100X", &info) == IDCARD_OK);
    CHECK(idcard_parse("11010119900101100x", &info) == IDCARD_OK); /* 小写亦可 */
}

static void test_errors(void)
{
    idcard_t info;
    CHECK(idcard_parse("431025197610125361", &info) == IDCARD_ERR_CHECK);
    CHECK(idcard_parse("12345", &info) == IDCARD_ERR_LENGTH);
    CHECK(idcard_parse("A31025197610125362", &info) == IDCARD_ERR_DIGIT);
    CHECK(idcard_parse(NULL, &info) == IDCARD_ERR_LENGTH);
}

static void test_check_code_fn(void)
{
    CHECK(idcard_check_code("43102519761012536") == '2');
    CHECK(idcard_check_code("11010119900101100") == 'X');
}

int main(void)
{
    test_valid_female();
    test_valid_male();
    test_check_code_x();
    test_errors();
    test_check_code_fn();

    if (failures == 0) {
        printf("\nAll tests passed.\n");
        return 0;
    }
    printf("\n%d test(s) failed.\n", failures);
    return 1;
}
