package models

import "time"

// DerivCredentials stores Deriv API token with account type
type DerivCredentials struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	UserID      uint      `json:"user_id" gorm:"not null;index"`
	APIToken    string    `json:"api_token" gorm:"type:text;not null"`
	LoginID     string    `json:"loginid" gorm:"size:50"`
	AccountType string    `json:"account_type" gorm:"size:10;default:'demo'"`
	IsActive    bool      `json:"is_active" gorm:"default:true;index"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// DerivUserInfo contains user account information
type DerivUserInfo struct {
	LoginID        string  `json:"loginid"`
	Email          string  `json:"email"`
	Country        string  `json:"country"`
	Currency       string  `json:"currency"`
	Balance        float64 `json:"balance"`
	AccountType    string  `json:"account_type"`
	IsVirtual      bool    `json:"is_virtual"`
	FullName       string  `json:"fullname"`
	LandingCompany string  `json:"landing_company_name"`
}

// DerivBalance represents account balance
type DerivBalance struct {
	Balance  float64 `json:"balance"`
	Currency string  `json:"currency"`
	LoginID  string  `json:"loginid"`
}

// DerivAccountDetails contains detailed account information
type DerivAccountDetails struct {
	AccountType       string  `json:"account_type"`
	Balance           float64 `json:"balance"`
	Country           string  `json:"country"`
	Currency          string  `json:"currency"`
	Email             string  `json:"email"`
	FullName          string  `json:"fullname"`
	IsVirtual         bool    `json:"is_virtual"`
	LandingCompany    string  `json:"landing_company_name"`
	LoginID           string  `json:"loginid"`
	PreferredLanguage string  `json:"preferred_language"`
}

// DerivAccountList represents list of available accounts
type DerivAccountList struct {
	Accounts []DerivAccount `json:"accounts"`
}

// DerivAccount represents a single Deriv account
type DerivAccount struct {
	LoginID         string `json:"loginid"`
	Currency        string `json:"currency"`
	IsVirtual       int    `json:"is_virtual"` // ✅ int not bool
	IsDisabled      int    `json:"is_disabled"`
	LandingCompany  string `json:"landing_company_name"`
	AccountCategory string `json:"account_category"`
	AccountType     string `json:"account_type"`
}

// SwitchAccountRequest for switching between accounts
type SwitchAccountRequest struct {
	APIToken string `json:"api_token" binding:"required"`
	LoginID  string `json:"loginid" binding:"required"`
}

// WebSocket response structure
type DerivWSResponse struct {
	Authorize struct {
		LoginID            string         `json:"loginid"`
		Email              string         `json:"email"`
		Country            string         `json:"country"`
		Currency           string         `json:"currency"`
		FullName           string         `json:"fullname"`
		IsVirtual          int            `json:"is_virtual"`
		LandingCompanyName string         `json:"landing_company_name"`
		AccountList        []DerivAccount `json:"account_list"`
	} `json:"authorize"`
	Balance struct {
		Balance  float64 `json:"balance"`
		Currency string  `json:"currency"`
		LoginID  string  `json:"loginid"`
	} `json:"balance"`
	AccountList struct {
		Accounts []DerivAccount `json:"account_list"`
	} `json:"account_list"`
	Error struct {
		Code    string `json:"code"`
		Message string `json:"message"`
	} `json:"error"`
	MsgType string `json:"msg_type"`
}

func (DerivCredentials) TableName() string {
	return "deriv_credentials"
}

// SaveTokenRequest is the request to save a new API token
type SaveTokenRequest struct {
	APIToken string `json:"api_token" binding:"required"`
}

// UpdateAccountTypeRequest is the request to update preferred account
type UpdateAccountTypeRequest struct {
	LoginID     string `json:"loginid" binding:"required"`
	AccountType string `json:"account_type" binding:"required,oneof=demo real"`
}
