package service

import (
	"fmt"
	"strconv"
	"time"

	"github.com/gorilla/websocket"
	"github.com/keyadaniel56/algocdk/internal/models"
)

type DerivService struct {
	wsURL string
}

func NewDerivService() *DerivService {
	return &DerivService{wsURL: "wss://ws.derivws.com/websockets/v3?app_id=1089"}
}

func (s *DerivService) AuthenticateAndGetUserInfo(apiToken string) (*models.DerivUserInfo, error) {
	response, err := s.authorize(apiToken)
	if err != nil {
		return nil, err
	}

	userInfo := &models.DerivUserInfo{
		LoginID:        response.Authorize.LoginID,
		Email:          response.Authorize.Email,
		Country:        response.Authorize.Country,
		Currency:       response.Authorize.Currency,
		FullName:       response.Authorize.FullName,
		IsVirtual:      response.Authorize.IsVirtual == 1,
		LandingCompany: response.Authorize.LandingCompanyName,
	}

	if loginIDUint, err := strconv.ParseUint(userInfo.LoginID, 10, 32); err == nil {
		GetNotificationService().SendAccountAlert(
			uint(loginIDUint),
			"Account Login",
			fmt.Sprintf("Welcome back, %s!", userInfo.FullName),
		)
	}

	return userInfo, nil
}

func (s *DerivService) GetAccountList(apiToken string) (*models.DerivAccountList, error) {
	response, err := s.authorize(apiToken)
	if err != nil {
		return nil, err
	}
	return &models.DerivAccountList{Accounts: response.Authorize.AccountList}, nil
}

func (s *DerivService) SwitchAccount(apiToken, loginID string) (*models.DerivUserInfo, error) {
	response, err := s.authorize(apiToken)
	if err != nil {
		return nil, err
	}

	var targetAccount models.DerivAccount
	for _, account := range response.Authorize.AccountList {
		if account.LoginID == loginID {
			targetAccount = account
			break
		}
	}
	if targetAccount.LoginID == "" {
		return nil, fmt.Errorf("account %s not found", loginID)
	}

	balance, _ := s.GetBalance(apiToken)
	balanceValue := 0.0
	if balance != nil {
		balanceValue = balance.Balance
	}

	userInfo := &models.DerivUserInfo{
		LoginID:        loginID,
		Email:          response.Authorize.Email,
		Country:        response.Authorize.Country,
		Currency:       targetAccount.Currency,
		Balance:        balanceValue,
		FullName:       response.Authorize.FullName,
		IsVirtual:      targetAccount.IsVirtual == 1,
		AccountType:    targetAccount.AccountType,
		LandingCompany: response.Authorize.LandingCompanyName,
	}

	if loginIDUint, err := strconv.ParseUint(loginID, 10, 32); err == nil {
		GetNotificationService().SendAccountAlert(
			uint(loginIDUint),
			"Account Switched",
			fmt.Sprintf("Switched to %s (%s)", loginID, targetAccount.Currency),
		)
	}

	return userInfo, nil
}

func (s *DerivService) GetBalance(apiToken string) (*models.DerivBalance, error) {
	conn, err := s.connectWebSocket()
	if err != nil {
		return nil, err
	}
	defer conn.Close()

	if err := s.sendRequest(conn, map[string]interface{}{"authorize": apiToken}); err != nil {
		return nil, err
	}
	var authResponse models.DerivWSResponse
	if err := conn.ReadJSON(&authResponse); err != nil || authResponse.Error.Code != "" {
		return nil, fmt.Errorf("auth failed")
	}

	if err := s.sendRequest(conn, map[string]interface{}{"balance": 1, "subscribe": 0}); err != nil {
		return nil, err
	}
	var balanceResponse models.DerivWSResponse
	if err := conn.ReadJSON(&balanceResponse); err != nil || balanceResponse.Error.Code != "" {
		return nil, fmt.Errorf("balance request failed")
	}

	return &models.DerivBalance{
		Balance:   balanceResponse.Balance.Balance,
		Currency:  balanceResponse.Balance.Currency,
		LoginID:   balanceResponse.Balance.LoginID,
		IsVirtual: authResponse.Authorize.IsVirtual == 1,
	}, nil
}

func (s *DerivService) GetAccountDetails(apiToken string) (*models.DerivAccountDetails, error) {
	userInfo, err := s.AuthenticateAndGetUserInfo(apiToken)
	if err != nil {
		return nil, err
	}
	balance, _ := s.GetBalance(apiToken)
	balanceValue := 0.0
	if balance != nil {
		balanceValue = balance.Balance
	}
	return &models.DerivAccountDetails{
		LoginID:        userInfo.LoginID,
		Email:          userInfo.Email,
		Country:        userInfo.Country,
		Currency:       userInfo.Currency,
		FullName:       userInfo.FullName,
		IsVirtual:      userInfo.IsVirtual,
		LandingCompany: userInfo.LandingCompany,
		Balance:        balanceValue,
	}, nil
}

func (s *DerivService) ValidateToken(apiToken string) (bool, error) {
	_, err := s.authorize(apiToken)
	return err == nil, err
}

func (s *DerivService) PlaceTrade(apiToken, symbol, tradeType string, stake float64, duration int) (*models.DerivTradeResult, error) {
	conn, err := s.connectWebSocket()
	if err != nil {
		return nil, err
	}
	defer conn.Close()

	if err := s.sendRequest(conn, map[string]interface{}{"authorize": apiToken}); err != nil {
		return nil, err
	}
	var authResponse models.DerivWSResponse
	if err := conn.ReadJSON(&authResponse); err != nil || authResponse.Error.Code != "" {
		return nil, fmt.Errorf("auth failed")
	}

	tradeReq := map[string]interface{}{
		"buy": 1,
		"parameters": map[string]interface{}{
			"contract_type": tradeType,
			"symbol":        symbol,
			"amount":        stake,
			"duration":      duration,
			"duration_unit": "t",
			"basis":         "stake",
		},
	}

	if err := s.sendRequest(conn, tradeReq); err != nil {
		return nil, err
	}
	var tradeResponse models.DerivWSResponse
	if err := conn.ReadJSON(&tradeResponse); err != nil || tradeResponse.Error.Code != "" {
		return nil, fmt.Errorf("trade failed")
	}

	result := &models.DerivTradeResult{
		ContractID: fmt.Sprintf("REAL_%d", time.Now().Unix()),
		Payout:     stake * 1.85,
		Status:     "open",
	}

	if loginIDUint, err := strconv.ParseUint(authResponse.Authorize.LoginID, 10, 32); err == nil {
		GetNotificationService().SendTradeAlert(
			uint(loginIDUint),
			"Trade Placed",
			fmt.Sprintf("%s trade on %s for $%.2f placed", tradeType, symbol, stake),
		)
	}

	return result, nil
}

func (s *DerivService) connectWebSocket() (*websocket.Conn, error) {
	dialer := websocket.DefaultDialer
	dialer.HandshakeTimeout = 10 * time.Second
	conn, _, err := dialer.Dial(s.wsURL, nil)
	if err != nil {
		return nil, fmt.Errorf("WebSocket connection failed: %v", err)
	}
	return conn, nil
}

func (s *DerivService) sendRequest(conn *websocket.Conn, req map[string]interface{}) error {
	return conn.WriteJSON(req)
}

func (s *DerivService) authorize(apiToken string) (*models.DerivWSResponse, error) {
	conn, err := s.connectWebSocket()
	if err != nil {
		return nil, err
	}
	defer conn.Close()

	if err := s.sendRequest(conn, map[string]interface{}{"authorize": apiToken}); err != nil {
		return nil, err
	}

	var response models.DerivWSResponse
	if err := conn.ReadJSON(&response); err != nil {
		return nil, err
	}

	if response.Error.Code != "" {
		return nil, fmt.Errorf("API error: %s", response.Error.Message)
	}

	return &response, nil
}
