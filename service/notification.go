package service

import (
	"log"

	"github.com/keyadaniel56/algocdk/internal/database"
	"github.com/keyadaniel56/algocdk/internal/models"
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
