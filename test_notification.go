package main

import (
	"github.com/keyadaniel56/algocdk/internal/database"
	services "github.com/keyadaniel56/algocdk/service"
	"log"
)

func main() {
	// Initialize database
	database.InitDB()

	// Get notification service
	notificationService := services.GetNotificationService()

	// Test sending a notification
	err := notificationService.SendAccountAlert(1, "Test Notification", "This is a test notification to verify the system is working.")
	if err != nil {
		log.Printf("Error sending notification: %v", err)
	} else {
		log.Println("Test notification sent successfully!")
	}

	// Test getting notifications
	notifications, err := notificationService.GetUserNotifications(1)
	if err != nil {
		log.Printf("Error getting notifications: %v", err)
	} else {
		log.Printf("Found %d notifications for user 1", len(notifications))
		for _, notif := range notifications {
			log.Printf("- %s: %s", notif.Title, notif.Message)
		}
	}
}
