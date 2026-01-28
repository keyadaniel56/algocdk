package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/keyadaniel56/algocdk/internal/handlers"
	"github.com/keyadaniel56/algocdk/internal/middleware"
	"github.com/keyadaniel56/algocdk/internal/paystack"

	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	_ "github.com/keyadaniel56/algocdk/docs" // <-- important: generated Swagger docs
)

func SetUpRouter(router *gin.Engine) {
	router.Use(middleware.CORSMiddleware())
	router.Static("/uploads", "./uploads")
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	api := router.Group("/api")
	api.GET("/marketplace", handlers.MarketplaceHandler)
	router.GET("/api/paystack/callback", paystack.HandleCallbackRedirect)
	router.SetTrustedProxies(nil)
	router.GET("/bots/:id", handlers.ServeBotHandler)
	{
		auth := api.Group("/auth")
		{
			auth.POST("/signup", handlers.SignupHandler)
			auth.POST("/login", handlers.LoginHandler)
			auth.POST("/forgot_password/", handlers.ForgotPasswordHandler)
		}

		user := api.Group("/user")
		user.Use(middleware.AuthMiddleware())
		{
			user.GET("/profile", handlers.ProfileHandler)
			user.PUT("/profile", handlers.UpdateProfile)
			user.DELETE("/account", handlers.DeleteAccountHandler)
			user.POST("/reset-password", handlers.ResetPasswordHandler)

			user.POST("/favorite/:bot_id", handlers.ToggleFavorite)
			user.GET("/favorite", handlers.GetUserFavorites)
		}

		superadmin := api.Group("/superadmin")
		superadmin.Use(middleware.AuthMiddleware())
		{
			superadmin.POST("/auth/signup", handlers.SuperAdminRegisterHandler)
			superadmin.POST("/auth/login", handlers.SuperAdminLoginHandler)
			superadmin.GET("/profile/:id", handlers.SuperAdminProfileHandler)
			superadmin.GET("/superadmindashboard/:id", handlers.SuperAdminDashboardHandler)
			superadmin.POST("/create_user", handlers.CreateUser)
			superadmin.POST("/update_user/:id", handlers.UpdateUser)
			superadmin.DELETE("/delete_user/:id", handlers.DeleteUser)
			superadmin.GET("/users", handlers.GetAllUsers)
			superadmin.GET("/user/:id", handlers.GetUserByID)
			//All requests that deal with admins
			superadmin.POST("/create_admin", handlers.CreateAdmin)
			superadmin.GET("/get_all_admins", handlers.GetAllAdmins)
			superadmin.GET("/toggle_admin_status", handlers.ToggleAdminStatus)
			superadmin.POST("/update_admin/:id", handlers.UpdateAdmin)
			superadmin.DELETE("/delete_admin", handlers.DeleteAdmin)
			superadmin.POST("/update_admin_password", handlers.UpdateAdminPassword)
			//All requests that deal with bots
			superadmin.GET("/bots", handlers.GetBotsHandler)
			superadmin.GET("/scan_bots", handlers.ScanAllBotsHandler)
		}

		admin := api.Group("/admin")
		admin.Use(middleware.AuthMiddleware())
		{
			admin.GET("/dashboard", handlers.AdminDashboardHandler)
			admin.POST("/create-bot", handlers.CreateBotHandler)
			admin.PUT("/update-bot/:id", handlers.UpdateBotHandler)
			admin.DELETE("/delete-bot/:id", handlers.DeleteBotHandler)
			admin.GET("/bots", handlers.ListAdminBotsHandler)
			admin.GET("/profile", handlers.AdminProfileHandler)
			admin.PUT("/bank-details", handlers.UpdateAdminBankDetails)
			admin.GET("/transactions", handlers.GetAdminTransactions)
			admin.POST("/transactions", handlers.RecordTransaction)
			admin.GET("/bots/:id/users", handlers.BotUsersHandler)
			admin.DELETE("/bots/:bot_id/users/:user_id", handlers.RemoveUserFromBotHandler)
			admin.POST("/reset_password/:id", handlers.ResetPasswordHandler)
		}

		paystackGroup := api.Group("/payment")
		{
			paystackGroup.Use(middleware.AuthMiddleware())
			{
				paystackGroup.POST("/initialize", paystack.InitializePayment)
				paystackGroup.GET("/verify", paystack.VerifyPayment)
				paystackGroup.POST("/callback", paystack.FrontendCallback)
				paystackGroup.POST("update-transaction", paystack.UpdateTransaction)
			}
			paystackGroup.POST("/webhook", paystack.PaystackCallback)
		}

		// ============================================
		// DERIV BROKER INTEGRATION
		// ============================================
		derivGroup := api.Group("/deriv")
		{
			// Public endpoints - no auth required
			derivGroup.POST("/auth", handlers.AuthenticateDeriv)
			derivGroup.POST("/user/info", handlers.GetDerivUserInfo)
			derivGroup.POST("/user/balance", handlers.GetDerivBalance)
			derivGroup.POST("/accounts/list", handlers.GetDerivAccountList)
			derivGroup.POST("/accounts/switch", handlers.SwitchDerivAccount)

			// Protected endpoints - requires authentication
			derivGroup.Use(middleware.AuthMiddleware())
			{
				// Account details & validation
				derivGroup.GET("/account/details", handlers.GetDerivAccountDetails)
				derivGroup.POST("/validate", handlers.ValidateDerivToken)

				// Token management
				derivGroup.POST("/token/save", handlers.SaveDerivToken)
				derivGroup.GET("/token", handlers.GetUserDerivToken)
				derivGroup.DELETE("/token", handlers.DeleteDerivToken)

				// Account preference
				derivGroup.PUT("/account/preference", handlers.UpdateDerivAccountPreference)

				// Use stored token (no need to send token in request)
				derivGroup.GET("/me/info", handlers.GetDerivUserInfoWithStoredToken)
				derivGroup.GET("/me/balance", handlers.GetDerivBalanceWithStoredToken)
				derivGroup.GET("/me/accounts", handlers.GetDerivAccountListWithStoredToken)
			}
		}
	}

	// Frontend path
	frontendPath := "./frontend"

	// Serve assets
	router.Static("/assets", frontendPath)

	// Serve HTML files manually
	router.GET("/", func(c *gin.Context) {
		c.File(frontendPath + "/index.html")
	})
	router.GET("/auth", func(c *gin.Context) {
		c.File(frontendPath + "/auth.html")
	})
	router.GET("/settings", func(c *gin.Context) {
		c.File(frontendPath + "/settings.html")
	})
	router.GET("/profile", func(c *gin.Context) {
		c.File(frontendPath + "/userprofile.html")
	})
	router.GET("/app", func(c *gin.Context) {
		c.File(frontendPath + "/app.html")
	})
	router.GET("/mybots", func(c *gin.Context) {
		c.File(frontendPath + "/mybots.html")
	})
	router.GET("/botstore", func(c *gin.Context) {
		c.File(frontendPath + "/botstore.html")
	})
	router.GET("/superadmin", func(c *gin.Context) {
		c.File(frontendPath + "/superadmin_dashboard.html")
	})
	router.GET("/support", func(c *gin.Context) {
		c.File(frontendPath + "/support.html")
	})
	router.GET("/privacy", func(c *gin.Context) {
		c.File(frontendPath + "/privacy.html")
	})
	router.GET("/terms", func(c *gin.Context) {
		c.File(frontendPath + "/terms.html")
	})
	router.GET("/legal", func(c *gin.Context) {
		c.File(frontendPath + "/legal.html")
	})
	router.GET("/marketchart", func(c *gin.Context) {
		c.File(frontendPath + "/marketchart.html")
	})
	router.GET("/test_upgrade", func(c *gin.Context) {
		c.File(frontendPath + "/test_upgrade.html")
	})
	router.GET("/video", func(c *gin.Context) {
		c.File(frontendPath + "/video.html")
	})
	router.GET("/admin", func(c *gin.Context) {
		c.File(frontendPath + "/admin_dashboard.html")
	})
	// SPA fallback
	// router.NoRoute(func(c *gin.Context) {
	// 	c.File(frontendPath + "/index.html")
	// })
}
