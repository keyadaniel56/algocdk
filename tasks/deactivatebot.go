package tasks

import (
	"log"
	"time"

	"github.com/keyadaniel56/algocdk/internal/database"
	"github.com/keyadaniel56/algocdk/internal/models"
)

func DeactivateExpiredBots() {
	log.Println("[Scheduler] Checking for expired rented bots...")

	var expiredBots []models.UserBot

	database.DB.Where("access_type = ? AND expiry_date < ? AND is_active = ?", "rent", time.Now(), true).Find(&expiredBots)

	if len(expiredBots) == 0 {
		log.Println("[Scheduler] No expired bots found.")
		return
	}

	for _, bot := range expiredBots {
		bot.IsActive = false
		database.DB.Save(&bot)
		log.Printf("[Scheduler] Deactivated bot ID %d (UserID: %d)\n", bot.BotID, bot.UserID)
	}
}
