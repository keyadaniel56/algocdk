// package models

// import "time"

// type Bot struct {
// 	ID        uint      `json:"id" gorm:"primaryKey"`
// 	Name      string    `json:"name"`
// 	HTMLFile  string    `json:"html_file"`
// 	Image     string    `json:"image"`
// 	Price     float64   `json:"price"`      //  Main purchase price
// 	RentPrice float64   `json:"rent_price"` //  Rental price per period
// 	Strategy  string    `json:"strategy"`
// 	OwnerID   uint      `json:"owner_id"`
// 	CreatedAt time.Time `json:"created_at"`
// 	UpdatedAt time.Time `json:"updated_at"`
// 	Status    string    `json:"status" gorm:"default:'inactive'"`

// 	SubscriptionType   string `json:"subscription_type"`   // e.g. "monthly", "weekly", "lifetime"
// 	SubscriptionExpiry string `json:"subscription_expiry"` // optional: template expiry or plan info

// 	Description string `json:"description"`
// 	Category    string `json:"category"`
// 	Version     string `json:"version"`
// }

package models

import (
	"time"
)

type Bot struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Name      string    `json:"name"`
	HTMLFile  string    `json:"html_file"`
	Image     string    `json:"image"`
	Price     float64   `json:"price"`
	RentPrice float64   `json:"rent_price"`
	Strategy  string    `json:"strategy"`
	OwnerID   uint      `json:"owner_id"` // foreign key
	Owner     User      `json:"owner"`    // preload this
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Status    string    `json:"status" gorm:"default:'inactive'"`

	SubscriptionType   string `json:"subscription_type"`
	SubscriptionExpiry string `json:"subscription_expiry"`

	Description string `json:"description"`
	Category    string `json:"category"`
	Version     string `json:"version"`
}
