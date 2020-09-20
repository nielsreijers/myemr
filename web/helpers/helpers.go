package helpers

import (
	"strconv"

	"github.com/satori/uuid"
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

func StringToUuidArray(uuidString string) ([]byte, error) {
	uuidObj, err := uuid.FromString(uuidString)
	if err == nil {
		return uuidObj.MarshalBinary()
	}
	return nil, err
}
