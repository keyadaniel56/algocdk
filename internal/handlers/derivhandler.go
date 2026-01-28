package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/keyadaniel56/algocdk/internal/database"
	"github.com/keyadaniel56/algocdk/internal/models"
	services "github.com/keyadaniel56/algocdk/service"
	"gorm.io/gorm"
)

var derivService = services.NewDerivService()

// ============================================
// PUBLIC DERIV HANDLERS (No Auth Required)
// ============================================

// AuthenticateDeriv authenticates user with Deriv API token
func AuthenticateDeriv(c *gin.Context) {
	var req struct {
		APIToken string `json:"api_token" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request",
			"details": err.Error(),
		})
		return
	}

	userInfo, err := derivService.AuthenticateAndGetUserInfo(req.APIToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "Authentication failed",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":   true,
		"message":   "Authentication successful",
		"user_info": userInfo,
	})
}

// GetDerivUserInfo fetches user information from Deriv
func GetDerivUserInfo(c *gin.Context) {
	var req struct {
		APIToken string `json:"api_token" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request",
			"details": err.Error(),
		})
		return
	}

	userInfo, err := derivService.AuthenticateAndGetUserInfo(req.APIToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "Failed to fetch user info",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    userInfo,
	})
}

// GetDerivBalance fetches account balance
func GetDerivBalance(c *gin.Context) {
	var req struct {
		APIToken string `json:"api_token" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request",
			"details": err.Error(),
		})
		return
	}

	balance, err := derivService.GetBalance(req.APIToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "Failed to fetch balance",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    balance,
	})
}

// GetDerivAccountList fetches all accounts (demo + real)
func GetDerivAccountList(c *gin.Context) {
	var req struct {
		APIToken string `json:"api_token" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request",
			"details": err.Error(),
		})
		return
	}

	accountList, err := derivService.GetAccountList(req.APIToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "Failed to fetch account list",
			"details": err.Error(),
		})
		return
	}

	// Separate demo and real accounts with proper bool conversion
	demoAccounts := []map[string]interface{}{}
	realAccounts := []map[string]interface{}{}

	for _, account := range accountList.Accounts {
		// Convert to map with proper boolean values
		accountMap := map[string]interface{}{
			"loginid":              account.LoginID,
			"currency":             account.Currency,
			"is_virtual":           account.IsVirtual == 1,
			"is_disabled":          account.IsDisabled == 1,
			"landing_company_name": account.LandingCompany,
			"account_category":     account.AccountCategory,
			"account_type":         account.AccountType,
		}

		if account.IsVirtual == 1 {
			demoAccounts = append(demoAccounts, accountMap)
		} else {
			realAccounts = append(realAccounts, accountMap)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"total_accounts": len(accountList.Accounts),
			"demo_accounts":  demoAccounts,
			"real_accounts":  realAccounts,
		},
	})
}

// SwitchDerivAccount switches between demo and real accounts
func SwitchDerivAccount(c *gin.Context) {
	var req struct {
		APIToken string `json:"api_token" binding:"required"`
		LoginID  string `json:"loginid" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request",
			"details": err.Error(),
		})
		return
	}

	userInfo, err := derivService.SwitchAccount(req.APIToken, req.LoginID)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "Failed to switch account",
			"details": err.Error(),
		})
		return
	}

	accountType := "real"
	if userInfo.IsVirtual {
		accountType = "demo"
	}

	c.JSON(http.StatusOK, gin.H{
		"success":      true,
		"message":      "Account switched successfully",
		"account_type": accountType,
		"user_info":    userInfo,
	})
}

// ============================================
// PROTECTED DERIV HANDLERS (Auth Required)
// ============================================

// GetDerivAccountDetails fetches detailed account information
func GetDerivAccountDetails(c *gin.Context) {
	apiToken := c.GetHeader("X-API-Token")
	if apiToken == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "API token required in X-API-Token header",
		})
		return
	}

	details, err := derivService.GetAccountDetails(apiToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "Failed to fetch account details",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    details,
	})
}

// ValidateDerivToken validates Deriv API token
func ValidateDerivToken(c *gin.Context) {
	var req struct {
		APIToken string `json:"api_token" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request",
			"details": err.Error(),
		})
		return
	}

	valid, err := derivService.ValidateToken(req.APIToken)
	if !valid {
		c.JSON(http.StatusUnauthorized, gin.H{
			"valid": false,
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"valid":   true,
		"message": "Token is valid",
	})
}

// ============================================
// TOKEN MANAGEMENT HANDLERS (With Stored Tokens)
// ============================================

// SaveDerivToken validates and saves user's Deriv API token
func SaveDerivToken(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "User not authenticated",
		})
		return
	}

	var req models.SaveTokenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request",
			"details": err.Error(),
		})
		return
	}

	// Validate token with Deriv API
	userInfo, err := derivService.AuthenticateAndGetUserInfo(req.APIToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "Invalid Deriv API token",
			"details": err.Error(),
		})
		return
	}

	// Deactivate existing tokens
	database.DB.Model(&models.DerivCredentials{}).
		Where("user_id = ?", userID).
		Update("is_active", false)

	// Save new token
	accountType := "demo"
	if !userInfo.IsVirtual {
		accountType = "real"
	}

	credentials := models.DerivCredentials{
		UserID:      userID.(uint),
		APIToken:    req.APIToken,
		LoginID:     userInfo.LoginID,
		AccountType: accountType,
		IsActive:    true,
	}

	if err := database.DB.Create(&credentials).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to save token",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Deriv API token saved successfully",
		"data": gin.H{
			"loginid":      userInfo.LoginID,
			"account_type": accountType,
			"is_virtual":   userInfo.IsVirtual,
		},
	})
}

// GetUserDerivToken retrieves user's saved Deriv token
func GetUserDerivToken(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "User not authenticated",
		})
		return
	}

	var credentials models.DerivCredentials
	if err := database.DB.Where("user_id = ? AND is_active = ?", userID, true).
		First(&credentials).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error":     "No Deriv token found",
				"has_token": false,
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve token",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"has_token":    true,
			"loginid":      credentials.LoginID,
			"account_type": credentials.AccountType,
			"created_at":   credentials.CreatedAt,
		},
	})
}

// DeleteDerivToken removes user's Deriv API token
func DeleteDerivToken(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "User not authenticated",
		})
		return
	}

	if err := database.DB.Where("user_id = ?", userID).
		Delete(&models.DerivCredentials{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to delete token",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Deriv API token removed successfully",
	})
}

// UpdateDerivAccountPreference updates user's preferred account
func UpdateDerivAccountPreference(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "User not authenticated",
		})
		return
	}

	var req models.UpdateAccountTypeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request",
			"details": err.Error(),
		})
		return
	}

	result := database.DB.Model(&models.DerivCredentials{}).
		Where("user_id = ? AND is_active = ?", userID, true).
		Updates(map[string]interface{}{
			"loginid":      req.LoginID,
			"account_type": req.AccountType,
		})

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update preference",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Account preference updated",
		"data": gin.H{
			"loginid":      req.LoginID,
			"account_type": req.AccountType,
		},
	})
}

// GetDerivUserInfoWithStoredToken fetches user info using stored token
func GetDerivUserInfoWithStoredToken(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "User not authenticated",
		})
		return
	}

	var credentials models.DerivCredentials
	if err := database.DB.Where("user_id = ? AND is_active = ?", userID, true).
		First(&credentials).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "No Deriv token found. Please add your API token first.",
		})
		return
	}

	userInfo, err := derivService.AuthenticateAndGetUserInfo(credentials.APIToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "Failed to fetch user info",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    userInfo,
	})
}

// GetDerivBalanceWithStoredToken fetches balance using stored token
func GetDerivBalanceWithStoredToken(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "User not authenticated",
		})
		return
	}

	var credentials models.DerivCredentials
	if err := database.DB.Where("user_id = ? AND is_active = ?", userID, true).
		First(&credentials).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "No Deriv token found",
		})
		return
	}

	balance, err := derivService.GetBalance(credentials.APIToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "Failed to fetch balance",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    balance,
	})
}

// GetDerivAccountListWithStoredToken fetches account list using stored token
func GetDerivAccountListWithStoredToken(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "User not authenticated",
		})
		return
	}

	var credentials models.DerivCredentials
	if err := database.DB.Where("user_id = ? AND is_active = ?", userID, true).
		First(&credentials).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "No Deriv token found",
		})
		return
	}

	accountList, err := derivService.GetAccountList(credentials.APIToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "Failed to fetch account list",
			"details": err.Error(),
		})
		return
	}

	demoAccounts := []map[string]interface{}{}
	realAccounts := []map[string]interface{}{}

	for _, account := range accountList.Accounts {
		accountMap := map[string]interface{}{
			"loginid":              account.LoginID,
			"currency":             account.Currency,
			"is_virtual":           account.IsVirtual == 1,
			"is_disabled":          account.IsDisabled == 1,
			"landing_company_name": account.LandingCompany,
			"account_category":     account.AccountCategory,
			"account_type":         account.AccountType,
		}

		if account.IsVirtual == 1 {
			demoAccounts = append(demoAccounts, accountMap)
		} else {
			realAccounts = append(realAccounts, accountMap)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"total_accounts": len(accountList.Accounts),
			"demo_accounts":  demoAccounts,
			"real_accounts":  realAccounts,
		},
	})
}
