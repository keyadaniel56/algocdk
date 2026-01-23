package handlers

import (
	"fmt"
	"net/http"
	"os"
	"sort"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/keyadaniel56/algocdk/internal/database"
	"github.com/keyadaniel56/algocdk/internal/models"
)

// MarketplaceHandler godoc
// @Summary Get marketplace bots
// @Description Retrieves a paginated list of bots available in the marketplace. If the user is authenticated, their favorite bots are marked as is_favorite=true and sorted to appear first in the list.
// @Tags marketplace
// @Produce json
// @Param page query int false "Page number (default: 1)" default(1)
// @Param limit query int false "Number of bots per page (default: 10)" default(10)
// @Security ApiKeyAuth
// @Success 200 {object} map[string]interface{} "Successful response with paginated bots"
// @Failure 500 {object} map[string]string "Internal server error"
// @Router /api/marketplace [get]
func MarketplaceHandler(c *gin.Context) {
	userIDVal, exists := c.Get("user_id")
	var userID uint
	if exists {
		userID = userIDVal.(uint)
	}

	pageStr := c.DefaultQuery("page", "1")
	limitStr := c.DefaultQuery("limit", "10")

	page, _ := strconv.Atoi(pageStr)
	limit, _ := strconv.Atoi(limitStr)

	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}

	offset := (page - 1) * limit

	var bots []models.Bot
	var total int64

	database.DB.Model(&models.Bot{}).Count(&total)

	if err := database.DB.
		Preload("Owner"). // <-- this tells GORM to fetch the creator
		Order("created_at desc").
		Limit(limit).
		Offset(offset).
		Find(&bots).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to fetch bots"})
		return
	}

	favoriteMap := make(map[uint]bool)

	if userID != 0 {
		var favorites []models.Favorite
		if err := database.DB.
			Where("user_id = ?", userID).
			Find(&favorites).Error; err == nil {

			for _, f := range favorites {
				favoriteMap[f.BotID] = true
			}
		}
	}

	var botList []gin.H
	for _, b := range bots {
		baseURL := os.Getenv("BASE_URL")
		if baseURL == "" {
			baseURL = "http://localhost:3000"
		}

		botPath := strings.TrimPrefix(b.HTMLFile, "uploads/")
		botLink := fmt.Sprintf("%s/uploads/%s", baseURL, botPath)

		botList = append(botList, gin.H{
			"id":          b.ID,
			"name":        b.Name,
			"image":       b.Image,
			"price":       b.Price,
			"rent_price":  b.RentPrice,
			"strategy":    b.Strategy,
			"status":      b.Status,
			"bot_link":    botLink,
			"is_favorite": favoriteMap[b.ID],
			"creator": gin.H{
				"id":   b.Owner.ID,
				"name": b.Owner.Name,
			},
		})

	}

	// Sort bots so favorites appear first (stable sort)
	sort.SliceStable(botList, func(i, j int) bool {
		return botList[i]["is_favorite"].(bool) && !botList[j]["is_favorite"].(bool)
	})

	c.JSON(http.StatusOK, gin.H{
		"message":     "Marketplace bots fetched successfully",
		"page":        page,
		"limit":       limit,
		"total_bots":  total,
		"total_pages": (total + int64(limit) - 1) / int64(limit),
		"bots":        botList,
	})
}
