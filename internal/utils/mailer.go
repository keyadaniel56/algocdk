package utils

import (
	"fmt"
	"log"
	"net/smtp"
	"os"
)

// SendEmail sends a generic email message
func SendEmail(to, msg string) {
	mode := os.Getenv("EMAIL_MODE")
	from := os.Getenv("EMAIL_FROM")
	sendEmail(to, from, msg, mode)
}

// SendResetEmail sends a password reset link to a user.
// It supports 3 modes: "console", "smtp", or "mailhog".
func SendResetEmail(to, resetLink string) {
	mode := os.Getenv("EMAIL_MODE") // "console", "smtp", or "mailhog"
	from := os.Getenv("EMAIL_FROM") // e.g., no-reply@myapp.com

	msg := fmt.Sprintf(
		"Subject: Password Reset\n\nClick the link to reset your password:\n%s\n\nThis link expires in 15 minutes.",
		resetLink,
	)

	sendEmail(to, from, msg, mode)
}

// SendVerificationEmail sends an email verification link to a user.
func SendVerificationEmail(to, verificationLink string) {
	mode := os.Getenv("EMAIL_MODE")
	from := os.Getenv("EMAIL_FROM")

	msg := fmt.Sprintf(
		"Subject: Email Verification\n\nPlease verify your email by clicking the link below:\n%s\n\nThis link will expire in 24 hours.",
		verificationLink,
	)

	sendEmail(to, from, msg, mode)
}

func sendEmail(to, from, msg, mode string) {
	switch mode {
	case "console":
		// Just log the email to console
		log.Println("===== EMAIL =====")
		log.Println("To:", to)
		log.Println("From:", from)
		log.Println("Message:\n", msg)
		log.Println("=================")

	case "mailhog":
		// Use local MailHog SMTP server
		host := os.Getenv("EMAIL_HOST") // localhost
		port := os.Getenv("EMAIL_PORT") // usually "1025"
		auth := smtp.PlainAuth("", "", "", host)
		err := smtp.SendMail(host+":"+port, auth, from, []string{to}, []byte(msg))
		if err != nil {
			log.Println("MAILHOG ERROR:", err)
		} else {
			log.Println("MailHog: email sent to", to)
		}

	case "smtp":
		// Use real SMTP (Mailtrap, Gmail, your domain)
		host := os.Getenv("EMAIL_HOST")
		port := os.Getenv("EMAIL_PORT")
		username := os.Getenv("EMAIL_USERNAME")
		password := os.Getenv("EMAIL_PASSWORD")

		auth := smtp.PlainAuth("", username, password, host)

		err := smtp.SendMail(host+":"+port, auth, from, []string{to}, []byte(msg))
		if err != nil {
			log.Println("SMTP ERROR:", err)
		} else {
			log.Println("SMTP: email sent to", to)
		}

	default:
		log.Println("EMAIL_MODE not set or invalid. Email not sent. Use console/mailhog/smtp")
	}
}
