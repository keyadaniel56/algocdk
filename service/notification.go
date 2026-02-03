package service

import (
	"fmt"
	"log"
	"os"

	"github.com/keyadaniel56/algocdk/internal/database"
	"github.com/keyadaniel56/algocdk/internal/models"
	"github.com/keyadaniel56/algocdk/internal/utils"
)

type NotificationService struct{}

var notificationService *NotificationService

func GetNotificationService() *NotificationService {
	if notificationService == nil {
		notificationService = &NotificationService{}
	}
	return notificationService
}

func (ns *NotificationService) SendAccountAlert(userID uint, title, message string) error {
	notification := &models.Notification{
		UserID:   userID,
		Type:     "in_app",
		Category: "account",
		Title:    title,
		Message:  message,
		Status:   "sent",
		Priority: "normal",
	}

	db := database.GetDB()
	if err := db.Create(notification).Error; err != nil {
		log.Printf("Failed to create notification: %v", err)
		return err
	}

	// Send email notification
	ns.sendEmailNotification(userID, title, message)

	log.Printf("Notification sent to user %d: %s", userID, title)
	return nil
}

func (ns *NotificationService) SendTradeAlert(userID uint, title, message string) error {
	notification := &models.Notification{
		UserID:   userID,
		Type:     "in_app",
		Category: "trade",
		Title:    title,
		Message:  message,
		Status:   "sent",
		Priority: "high",
	}

	db := database.GetDB()
	if err := db.Create(notification).Error; err != nil {
		log.Printf("Failed to create trade notification: %v", err)
		return err
	}

	// Send email notification for high priority trade alerts
	ns.sendEmailNotification(userID, title, message)

	log.Printf("Trade notification sent to user %d: %s", userID, title)
	return nil
}

func (ns *NotificationService) GetUserNotifications(userID uint) ([]models.Notification, error) {
	var notifications []models.Notification
	db := database.GetDB()

	err := db.Where("user_id = ?", userID).
		Order("created_at DESC").
		Limit(50).
		Find(&notifications).Error

	return notifications, err
}

func (ns *NotificationService) SendEmailAlert(userID uint, title, message string) error {
	ns.sendEmailNotification(userID, title, message)
	return nil
}

func (ns *NotificationService) sendEmailNotification(userID uint, title, message string) {
	db := database.GetDB()
	var user models.User

	if err := db.First(&user, userID).Error; err != nil {
		log.Printf("Failed to get user for email notification: %v", err)
		return
	}

	if user.Email == "" {
		log.Printf("User %d has no email address", userID)
		return
	}

	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		frontendURL = "http://localhost:8080"
	}

	emailMsg := fmt.Sprintf(
		"Subject: %s\n\n%s\n\nView your notifications: %s/notifications",
		title, message, frontendURL,
	)

	utils.SendEmail(user.Email, emailMsg)
}
