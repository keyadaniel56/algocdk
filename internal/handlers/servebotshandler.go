package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/keyadaniel56/algocdk/internal/database"
	"github.com/keyadaniel56/algocdk/internal/models"
)

func ServeBotHandler(c *gin.Context) {
	botID := c.Param("id")

	var bot models.Bot
	if err := database.DB.First(&bot, botID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "bot not found"})
		return
	}

	c.File(bot.HTMLFile) // serves the HTML file directly
}
