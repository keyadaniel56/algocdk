package models

import (
	"time"

	"github.com/keyadaniel56/algocdk/internal/utils"
)

type User struct {
	ID                   uint                `json:"id" gorm:"primaryKey"`
	Name                 string              `json:"name"`
	Email                string              `json:"email" gorm:"uniqueIndex"`
	Password             string              `json:"-"`
	Role                 string              `json:"role" gorm:"default:user"`
	Country              string              `json:"country"`
	Membership           string              `json:"member_ship_type" gorm:"default:freemium"`
	EmailVerified        bool                `gorm:"default:false"`
	RefreshToken         string              `json:"refresh_token"`
	ResetToken           string              `json:"-"`
	ResetExpiry          time.Time           `json:"-"`
	CreatedAt            utils.FormattedTime `json:"created_at"`
	UpdatedAt            utils.FormattedTime `json:"updated_at"`
	TotalProfits         uint                `json:"total_profits"`
	ActiveBots           uint                `json:"active_bots"`
	TotalTrades          uint                `json:"total_trades"`
	SubscriptionExpiry   time.Time           `json:"subscription_expiry"`
	UpgradeRequestStatus string              `json:"upgrade_request_status" gorm:"type:varchar(20);default:null"`
}
