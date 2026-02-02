package database

import (
	"fmt"
	"log"

	"github.com/keyadaniel56/algocdk/internal/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func GetDB() *gorm.DB {
	return DB
}

func InitDB() {
	var err error
	DB, err = gorm.Open(sqlite.Open("app.db"), &gorm.Config{})
	if err != nil {
		log.Fatalf("%v", err.Error())
	}
	DB.AutoMigrate(
		&models.User{},
		&models.Bot{},
		&models.Favorite{},
		&models.BotUser{},
		&models.Admin{},
		&models.AdminRequest{},
		&models.Site{},
		&models.SiteUser{},
		&models.Transaction{},
		&models.SalesHistory{},
		&models.UserBot{},
		&models.Sale{},
		&models.DerivCredentials{},
		&models.SuperAdmin{},
		&models.Notification{},
		&models.NotificationPreference{},
		&models.Trade{},
	)
	fmt.Println("database connected")
}
