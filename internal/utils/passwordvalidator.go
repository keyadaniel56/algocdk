package utils

import "unicode"

func IsValidPassword(password string) bool {
	if len(password) < 8 {
		return false
	}

	var hasupCase, haloCase, hasPunc, hasNum bool

	for _, char := range password {
		if unicode.IsUpper(char) {
			hasupCase = true
		}
		if unicode.IsLower(char) {
			haloCase = true
		}
		if unicode.IsNumber(char) {
			hasNum = true
		}
		if unicode.IsSymbol(char) || unicode.IsPunct(char) {
			hasPunc = true
		}
	}
	return haloCase && hasupCase && hasNum && hasPunc
}
