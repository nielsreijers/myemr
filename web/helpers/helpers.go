package helpers

import (
	"strconv"
)

func ErrorCheck(err error) {
	if err != nil {
		panic(err.Error())
	}
}

func Utoa(val uint) string {
	return strconv.FormatUint(uint64(val), 10)
}
func Atou(s string) (uint, error) {
	val, err := strconv.ParseUint(s, 10, 32)
	if err == nil {
		return uint(val), err
	} else {
		return 0, err
	}
}
