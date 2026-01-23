package utils

func DetectCountryCached(ip string) (string, error) {
	// Read lock
	cacheMutex.RLock()
	country, found := ipCountryCache[ip]
	cacheMutex.RUnlock()

	if found {
		return country, nil
	}

	// Call API
	country, err := DetectCountry(ip)
	if err != nil {
		return "", err
	}

	// Write lock
	cacheMutex.Lock()
	ipCountryCache[ip] = country
	cacheMutex.Unlock()

	return country, nil
}
