package repository

import (
	"github.com/keyadaniel56/algocdk/internal/database"
	"github.com/keyadaniel56/algocdk/internal/models"
)

func CreateUser(email, password string) (*models.User, error) {
	var err error
	var user models.User
	if err = database.DB.Where("email=?", user.Email).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}
