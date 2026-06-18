CC ?= cc
CFLAGS ?= -std=c11 -Wall -Wextra -O2

.PHONY: all test clean

all: query

query: query.c idcard.c idcard.h
	$(CC) $(CFLAGS) -o query query.c idcard.c

test: test_idcard
	./test_idcard

test_idcard: test_idcard.c idcard.c idcard.h
	$(CC) $(CFLAGS) -o test_idcard test_idcard.c idcard.c

clean:
	rm -f query test_idcard
