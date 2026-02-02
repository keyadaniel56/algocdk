package models

import (
	"time"
)

type Notification struct {
	ID        uint       `json:"id" gorm:"primaryKey"`
	UserID    uint       `json:"user_id" gorm:"not null;index"`
	Type      string     `json:"type" gorm:"not null;size:50"`     // email, push, in_app
	Category  string     `json:"category" gorm:"not null;size:50"` // trade, account, system, security
	Title     string     `json:"title" gorm:"not null;size:255"`
	Message   string     `json:"message" gorm:"not null;type:text"`
	Status    string     `json:"status" gorm:"not null;size:20;default:'pending'"`  // pending, sent, failed, read
	Priority  string     `json:"priority" gorm:"not null;size:20;default:'normal'"` // low, normal, high, critical
	Data      string     `json:"data,omitempty" gorm:"type:json"`                   // Additional metadata
	ReadAt    *time.Time `json:"read_at,omitempty"`
	SentAt    *time.Time `json:"sent_at,omitempty"`
	CreatedAt time.Time  `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time  `json:"updated_at" gorm:"autoUpdateTime"`

	// Relationships
	User User `json:"user,omitempty" gorm:"foreignKey:UserID"`
}

type NotificationPreference struct {
	ID              uint      `json:"id" gorm:"primaryKey"`
	UserID          uint      `json:"user_id" gorm:"not null;uniqueIndex"`
	EmailEnabled    bool      `json:"email_enabled" gorm:"default:true"`
	PushEnabled     bool      `json:"push_enabled" gorm:"default:true"`
	TradeAlerts     bool      `json:"trade_alerts" gorm:"default:true"`
	AccountAlerts   bool      `json:"account_alerts" gorm:"default:true"`
	SystemAlerts    bool      `json:"system_alerts" gorm:"default:true"`
	SecurityAlerts  bool      `json:"security_alerts" gorm:"default:true"`
	MarketingEmails bool      `json:"marketing_emails" gorm:"default:false"`
	CreatedAt       time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt       time.Time `json:"updated_at" gorm:"autoUpdateTime"`

	// Relationships
	User User `json:"user,omitempty" gorm:"foreignKey:UserID"`
}
