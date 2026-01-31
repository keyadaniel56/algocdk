package handlers

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type MarketData struct {
	Symbol        string  `json:"symbol"`
	Price         float64 `json:"price"`
	Change        float64 `json:"change"`
	ChangePercent float64 `json:"changePercent"`
	Volume        int64   `json:"volume"`
	Type          string  `json:"type"`
	High          float64 `json:"high"`
	Low           float64 `json:"low"`
}

type WebSocketMessage struct {
	Type string      `json:"type"`
	Data interface{} `json:"data"`
}

// GetMarketData returns current market data
func GetMarketData(c *gin.Context) {
	markets := []MarketData{
		{Symbol: "EUR/USD", Price: 1.0850, Change: 0.0012, ChangePercent: 0.11, Volume: 1250000, Type: "forex", High: 1.0875, Low: 1.0820},
		{Symbol: "GBP/USD", Price: 1.2650, Change: -0.0025, ChangePercent: -0.20, Volume: 980000, Type: "forex", High: 1.2680, Low: 1.2630},
		{Symbol: "USD/JPY", Price: 149.85, Change: 0.45, ChangePercent: 0.30, Volume: 1100000, Type: "forex", High: 150.20, Low: 149.40},
		{Symbol: "BTC/USD", Price: 43250.00, Change: 1250.00, ChangePercent: 2.98, Volume: 45000, Type: "crypto", High: 44100, Low: 42800},
		{Symbol: "ETH/USD", Price: 2650.00, Change: -85.00, ChangePercent: -3.11, Volume: 125000, Type: "crypto", High: 2720, Low: 2580},
		{Symbol: "XAU/USD", Price: 2025.50, Change: 12.30, ChangePercent: 0.61, Volume: 85000, Type: "metals", High: 2035, Low: 2010},
	}

	c.JSON(http.StatusOK, gin.H{
		"markets": markets,
		"status":  "success",
	})
}

// GetChartData returns chart data for a specific symbol
func GetChartData(c *gin.Context) {
	symbol := c.Param("symbol")
	timeframe := c.DefaultQuery("timeframe", "1m")

	// Generate sample chart data
	data := generateSampleChartData(symbol, timeframe)

	c.JSON(http.StatusOK, gin.H{
		"symbol":    symbol,
		"timeframe": timeframe,
		"candles":   data,
	})
}

func generateSampleChartData(symbol, timeframe string) []map[string]interface{} {
	data := make([]map[string]interface{}, 100)
	basePrice := 1.0850
	if symbol == "BTC/USD" {
		basePrice = 43250.0
	} else if symbol == "ETH/USD" {
		basePrice = 2650.0
	}

	currentTime := time.Now().Unix() - 86400
	price := basePrice

	for i := 0; i < 100; i++ {
		open := price
		change := (float64(i%10) - 5) * 0.001 * basePrice
		close := open + change
		high := maxFloat(open, close) + (float64(i%3) * 0.0005 * basePrice)
		low := minFloat(open, close) - (float64(i%3) * 0.0005 * basePrice)

		data[i] = map[string]interface{}{
			"time":  currentTime,
			"open":  round(open, 4),
			"high":  round(high, 4),
			"low":   round(low, 4),
			"close": round(close, 4),
		}

		currentTime += 900 // 15 minutes
		price = close
	}

	return data
}

// WebSocket handler for real-time market data
func MarketWebSocket(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Printf("WebSocket upgrade error: %v", err)
		return
	}
	defer conn.Close()

	log.Println("WebSocket client connected")

	// Send initial market data
	markets := []MarketData{
		{Symbol: "EUR/USD", Price: 1.0850, Change: 0.0012, ChangePercent: 0.11, Volume: 1250000, Type: "forex", High: 1.0875, Low: 1.0820},
		{Symbol: "GBP/USD", Price: 1.2650, Change: -0.0025, ChangePercent: -0.20, Volume: 980000, Type: "forex", High: 1.2680, Low: 1.2630},
		{Symbol: "USD/JPY", Price: 149.85, Change: 0.45, ChangePercent: 0.30, Volume: 1100000, Type: "forex", High: 150.20, Low: 149.40},
		{Symbol: "BTC/USD", Price: 43250.00, Change: 1250.00, ChangePercent: 2.98, Volume: 45000, Type: "crypto", High: 44100, Low: 42800},
		{Symbol: "ETH/USD", Price: 2650.00, Change: -85.00, ChangePercent: -3.11, Volume: 125000, Type: "crypto", High: 2720, Low: 2580},
		{Symbol: "XAU/USD", Price: 2025.50, Change: 12.30, ChangePercent: 0.61, Volume: 85000, Type: "metals", High: 2035, Low: 2010},
	}

	initialMsg := WebSocketMessage{
		Type: "initial_data",
		Data: markets,
	}

	if err := conn.WriteJSON(initialMsg); err != nil {
		log.Printf("WebSocket write error: %v", err)
		return
	}

	// Send periodic updates
	ticker := time.NewTicker(2 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			// Simulate market updates
			for i := range markets {
				change := (float64(time.Now().Unix()%10) - 5) * 0.0001 * markets[i].Price
				markets[i].Price += change
				markets[i].Change = change
				markets[i].ChangePercent = (change / markets[i].Price) * 100
			}

			updateMsg := WebSocketMessage{
				Type: "market_update",
				Data: markets,
			}

			if err := conn.WriteJSON(updateMsg); err != nil {
				log.Printf("WebSocket write error: %v", err)
				return
			}

		default:
			// Check for client messages
			_, _, err := conn.ReadMessage()
			if err != nil {
				if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
					log.Printf("WebSocket error: %v", err)
				}
				return
			}
		}
	}
}

// GetDerivMarketData integrates with Deriv API for real market data
func GetDerivMarketData(c *gin.Context) {
	// This would integrate with Deriv's WebSocket API
	// For now, return enhanced sample data
	markets := []MarketData{
		{Symbol: "R_10", Price: 1234.56, Change: 12.34, ChangePercent: 1.01, Volume: 500000, Type: "synthetic", High: 1245.67, Low: 1220.45},
		{Symbol: "R_25", Price: 2345.67, Change: -23.45, ChangePercent: -0.99, Volume: 750000, Type: "synthetic", High: 2370.12, Low: 2320.34},
		{Symbol: "R_50", Price: 3456.78, Change: 34.56, ChangePercent: 1.01, Volume: 600000, Type: "synthetic", High: 3490.34, Low: 3420.12},
		{Symbol: "R_75", Price: 4567.89, Change: -45.67, ChangePercent: -0.99, Volume: 450000, Type: "synthetic", High: 4612.56, Low: 4520.23},
		{Symbol: "R_100", Price: 5678.90, Change: 56.78, ChangePercent: 1.01, Volume: 800000, Type: "synthetic", High: 5734.68, Low: 5620.12},
		{Symbol: "BOOM1000", Price: 12345.67, Change: 123.45, ChangePercent: 1.01, Volume: 300000, Type: "crash_boom", High: 12468.12, Low: 12220.23},
		{Symbol: "CRASH1000", Price: 23456.78, Change: -234.56, ChangePercent: -0.99, Volume: 350000, Type: "crash_boom", High: 23690.34, Low: 23220.12},
	}

	c.JSON(http.StatusOK, gin.H{
		"markets": markets,
		"status":  "success",
		"source":  "deriv",
	})
}

// Helper functions
func maxFloat(a, b float64) float64 {
	if a > b {
		return a
	}
	return b
}

func minFloat(a, b float64) float64 {
	if a < b {
		return a
	}
	return b
}

func round(val float64, precision int) float64 {
	ratio := float64(1)
	for i := 0; i < precision; i++ {
		ratio *= 10
	}
	return float64(int(val*ratio+0.5)) / ratio
}

// GetEconomicCalendar returns economic events
func GetEconomicCalendar(c *gin.Context) {
	events := []map[string]interface{}{
		{
			"time":     "09:30",
			"event":    "USD Non-Farm Payrolls",
			"impact":   "high",
			"forecast": "180K",
			"previous": "175K",
			"currency": "USD",
		},
		{
			"time":     "11:00",
			"event":    "EUR CPI Flash Estimate",
			"impact":   "medium",
			"forecast": "2.4%",
			"previous": "2.6%",
			"currency": "EUR",
		},
		{
			"time":     "14:00",
			"event":    "USD Fed Interest Rate Decision",
			"impact":   "high",
			"forecast": "5.25%",
			"previous": "5.25%",
			"currency": "USD",
		},
		{
			"time":     "16:30",
			"event":    "GBP GDP Growth Rate",
			"impact":   "medium",
			"forecast": "0.2%",
			"previous": "0.1%",
			"currency": "GBP",
		},
	}

	c.JSON(http.StatusOK, gin.H{
		"events": events,
		"status": "success",
	})
}

// GetMarketNews returns financial news
func GetMarketNews(c *gin.Context) {
	filter := c.DefaultQuery("filter", "all")

	news := []map[string]interface{}{
		{
			"id":        1,
			"title":     "Federal Reserve Maintains Interest Rates",
			"summary":   "The Fed keeps rates steady amid inflation concerns",
			"category":  "forex",
			"impact":    "high",
			"timestamp": time.Now().Unix() - 3600,
			"source":    "Reuters",
		},
		{
			"id":        2,
			"title":     "Bitcoin Surges Above $43,000",
			"summary":   "Cryptocurrency markets rally on institutional adoption",
			"category":  "crypto",
			"impact":    "medium",
			"timestamp": time.Now().Unix() - 7200,
			"source":    "CoinDesk",
		},
		{
			"id":        3,
			"title":     "Gold Prices Hit Monthly High",
			"summary":   "Safe-haven demand drives precious metals higher",
			"category":  "commodities",
			"impact":    "medium",
			"timestamp": time.Now().Unix() - 10800,
			"source":    "Bloomberg",
		},
		{
			"id":        4,
			"title":     "EUR/USD Technical Analysis",
			"summary":   "Key resistance levels to watch in the coming week",
			"category":  "analysis",
			"impact":    "low",
			"timestamp": time.Now().Unix() - 14400,
			"source":    "FXStreet",
		},
	}

	// Filter news if requested
	if filter != "all" {
		filteredNews := []map[string]interface{}{}
		for _, item := range news {
			if item["category"] == filter {
				filteredNews = append(filteredNews, item)
			}
		}
		news = filteredNews
	}

	c.JSON(http.StatusOK, gin.H{
		"news":   news,
		"status": "success",
		"filter": filter,
	})
}
