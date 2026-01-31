package models

import "time"

type Trade struct {
	ID           uint       `gorm:"primaryKey" json:"id"`
	UserID       uint       `json:"user_id"`
	BotID        uint       `json:"bot_id"`
	DerivTradeID string     `json:"deriv_trade_id"` // Deriv's trade ID
	Symbol       string     `json:"symbol"`
	TradeType    string     `json:"trade_type"` // "CALL", "PUT"
	Stake        float64    `json:"stake"`
	Payout       float64    `json:"payout"`
	ProfitLoss   float64    `json:"profit_loss"` // Actual P&L
	Status       string     `json:"status"`      // "open", "won", "lost"
	OpenTime     time.Time  `json:"open_time"`
	CloseTime    *time.Time `json:"close_time,omitempty"`
	CreatedAt    time.Time  `json:"created_at"`
}
