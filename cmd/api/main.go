package main

import (
	"github.com/gin-gonic/gin"
	"github.com/keyadaniel56/algocdk/internal/database"
	"github.com/keyadaniel56/algocdk/internal/routes"
)

func main() {
	database.InitDB()

	r := gin.Default()
	r.SetTrustedProxies(nil)
	routes.SetUpRouter(r)
	r.Run()
}
