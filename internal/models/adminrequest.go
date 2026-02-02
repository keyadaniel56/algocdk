package models

import (
	"time"

	"github.com/keyadaniel56/algocdk/internal/utils"
)

type AdminRequest struct {
	ID          uint                `json:"id" gorm:"primaryKey"`
	UserID      uint                `json:"user_id" gorm:"not null"`
	User        User                `json:"user" gorm:"foreignKey:UserID"`
	Reason      string              `json:"reason" gorm:"type:text"`
	Status      string              `json:"status" gorm:"default:pending"` // pending, approved, rejected
	ReviewedBy  *uint               `json:"reviewed_by"`
	Reviewer    *SuperAdmin         `json:"reviewer" gorm:"foreignKey:ReviewedBy"`
	ReviewedAt  *time.Time          `json:"reviewed_at"`
	ReviewNotes string              `json:"review_notes" gorm:"type:text"`
	CreatedAt   utils.FormattedTime `json:"created_at"`
	UpdatedAt   utils.FormattedTime `json:"updated_at"`
}
