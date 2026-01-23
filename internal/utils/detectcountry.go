package utils

import (
	"fmt"
	"io"
	"net/http"
	"strings"
)

func DetectCountry(ip string) (string, error) {
	resp, err := http.Get(fmt.Sprintf("https://ipapi.co/%s/country_name/", ip))
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	country := strings.TrimSpace(string(body))
	if country == "" {
		country = "Uknown"
	}
	return country, nil
}
