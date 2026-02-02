# Algocdk - Advanced Trading Platform

![Algocdk Logo](https://img.shields.io/badge/Algocdk-Trading%20Platform-FF4500?style=for-the-badge)

A comprehensive trading platform built with Go (Gin), featuring bot management, real-time market data, admin site creation, and Deriv API integration.

## 🚀 Features

### Core Platform
- **User Management**: Registration, authentication, profile management
- **Trading Bots**: Create, manage, and deploy automated trading bots
- **Real-time Market Data**: Live market feeds with WebSocket support
- **Trading Interface**: Multiple contract types (Digits, Up/Down, Touch, Barriers, etc.)
- **Payment Integration**: Paystack payment gateway integration

### Admin Features
- **Bot Management**: Create and manage trading bots for users
- **Site Builder**: Create custom websites with HTML/CSS/JS editor
- **Member Management**: Add/remove members from created sites
- **Transaction Tracking**: Monitor all platform transactions
- **Analytics Dashboard**: Platform performance metrics

### SuperAdmin Features
- **User Administration**: Manage all platform users and admins
- **Admin Request System**: Review and approve admin status requests
- **Platform Analytics**: Comprehensive platform statistics
- **System Management**: Full platform oversight and control

### Deriv Integration
- **API Authentication**: Secure Deriv API token management
- **Account Management**: Multiple account support and switching
- **Real-time Trading**: Live trade execution through Deriv API
- **Balance Tracking**: Real-time account balance updates

## 🛠️ Technology Stack

- **Backend**: Go 1.21+ with Gin framework
- **Database**: SQLite with GORM ORM
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Real-time**: WebSocket connections
- **Documentation**: Swagger/OpenAPI
- **Payments**: Paystack API
- **Trading**: Deriv API integration

## 📋 Prerequisites

- Go 1.21 or higher
- SQLite3
- Git

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/keyadaniel56/algocdk.git
   cd algocdk
   ```

2. **Install dependencies**
   ```bash
   go mod download
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Build the application**
   ```bash
   go build -o algocdk main.go
   ```

5. **Run the application**
   ```bash
   ./algocdk
   ```

The server will start on `http://localhost:3000`

## 🌐 API Documentation

Access the Swagger documentation at: `http://localhost:3000/swagger/index.html`

### Key Endpoints

#### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot_password` - Password reset

#### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `POST /api/user/request-admin` - Request admin status

#### Trading
- `GET /api/market/data` - Get market data
- `GET /api/market/deriv` - Get Deriv market data
- `POST /api/user/trades` - Record trade
- `GET /api/user/trades` - Get user trades

#### Admin Features
- `POST /api/admin/create-bot` - Create trading bot
- `POST /api/admin/create-site` - Create website
- `GET /api/admin/sites` - Get admin sites
- `PUT /api/admin/update-site/{id}` - Update site

#### SuperAdmin Features
- `GET /api/superadmin/admin-requests` - Get pending admin requests
- `POST /api/superadmin/admin-requests/{id}/review` - Review admin request
- `GET /api/superadmin/users` - Get all users

## 🏗️ Project Structure

```
algocdk/
├── cmd/api/                 # API entry points
├── docs/                    # Swagger documentation
├── frontend/                # Frontend HTML/CSS/JS files
├── internal/
│   ├── config/             # Configuration management
│   ├── database/           # Database connection and setup
│   ├── handlers/           # HTTP request handlers
│   ├── middleware/         # HTTP middleware
│   ├── models/             # Database models
│   ├── paystack/           # Payment integration
│   ├── routes/             # Route definitions
│   └── utils/              # Utility functions
├── sites/                  # User-created websites storage
├── main.go                 # Application entry point
├── go.mod                  # Go module definition
└── README.md              # This file
```

## 🔐 Security Features

- JWT-based authentication
- Role-based access control (User, Admin, SuperAdmin)
- Secure file storage for user-generated content
- Input validation and sanitization
- CORS protection
- SQL injection prevention with GORM

## 🌟 Site Builder Feature

Admins can create custom websites with:
- **HTML Editor**: Rich HTML content creation
- **CSS Styling**: Custom styling with live preview
- **JavaScript**: Interactive functionality
- **Member Management**: Add/remove site members
- **Public/Private Sites**: Control site visibility
- **File-based Storage**: Secure content storage

### Site URL Structure
- Admin sites: `http://localhost:3000/site/{slug}`
- Static assets: `http://localhost:3000/sites/user_{id}/{slug}/`

## 📊 Admin Request System

Users can request admin privileges through a structured workflow:
1. User submits admin request with reason
2. Request stored with "pending" status
3. SuperAdmin reviews and approves/rejects
4. Automatic role promotion upon approval
5. Persistent request tracking until reviewed

## 🔄 Real-time Features

- **Market Data**: Live price feeds via WebSocket
- **Trading Updates**: Real-time trade execution status
- **Balance Updates**: Live account balance changes
- **Notifications**: Real-time system notifications

## 🧪 Testing

Run tests for all modules:
```bash
go test ./...
```

Build verification:
```bash
go build -o algocdk main.go
```

## 📝 Environment Variables

```env
# Database
DB_PATH=app.db

# Server
PORT=3000
JWT_SECRET=your-jwt-secret

# Paystack
PAYSTACK_SECRET_KEY=your-paystack-secret
PAYSTACK_PUBLIC_KEY=your-paystack-public

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 🚀 Deployment

### Production Build
```bash
go build -ldflags="-s -w" -o algocdk main.go
```

### Docker Deployment
```dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY . .
RUN go build -o algocdk main.go

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/algocdk .
COPY --from=builder /app/frontend ./frontend
CMD ["./algocdk"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact: support@algocdk.com
- Documentation: [API Docs](http://localhost:3000/swagger/index.html)

## 🎯 Roadmap

- [ ] Mobile app development
- [ ] Advanced charting tools
- [ ] Multi-broker integration
- [ ] Social trading features
- [ ] Advanced analytics dashboard
- [ ] API rate limiting
- [ ] Redis caching
- [ ] Microservices architecture

---

**Built with ❤️ by the Algocdk Team**

![Go](https://img.shields.io/badge/Go-00ADD8?style=flat&logo=go&logoColor=white)
![Gin](https://img.shields.io/badge/Gin-00ADD8?style=flat&logo=go&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat&logo=sqlite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)