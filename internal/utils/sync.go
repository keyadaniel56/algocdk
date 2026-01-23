package utils

import "sync"

var (
	ipCountryCache = make(map[string]string)
	cacheMutex     sync.RWMutex
)
