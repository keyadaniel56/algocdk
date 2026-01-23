package utils

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func RefreshToken(email string) (string, error) {
	claims := jwt.MapClaims{
		"email": email,
		"exp":   time.Now().Add(time.Hour * 24 * 7).Unix(),
		"iat":   time.Now().Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(os.Getenv("REFRESH_TOKEN")))
	if err != nil {
		return "", err
	}
	return tokenString, nil
}
