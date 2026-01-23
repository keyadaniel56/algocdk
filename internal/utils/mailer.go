package utils

import (
	"fmt"
	"log"
	"net/smtp"
	"os"
)

// SendResetEmail sends a password reset link to a user.
// It supports 3 modes: "console", "smtp", or "mailhog".
func SendResetEmail(to, resetLink string) {
	mode := os.Getenv("EMAIL_MODE") // "console", "smtp", or "mailhog"
	from := os.Getenv("EMAIL_FROM") // e.g., no-reply@myapp.com

	msg := fmt.Sprintf(
		"Subject: Password Reset\n\nClick the link to reset your password:\n%s\n\nThis link expires in 15 minutes.",
		resetLink,
	)

	switch mode {
	case "console":
		// Just log the email to console
		log.Println("===== RESET EMAIL =====")
		log.Println("To:", to)
		log.Println("From:", from)
		log.Println("Message:\n", msg)
		log.Println("=======================")

	case "mailhog":
		// Use local MailHog SMTP server
		host := os.Getenv("EMAIL_HOST") // localhost
		port := os.Getenv("EMAIL_PORT") // usually "1025"
		auth := smtp.PlainAuth("", "", "", host)
		err := smtp.SendMail(host+":"+port, auth, from, []string{to}, []byte(msg))
		if err != nil {
			log.Println("MAILHOG ERROR:", err)
		} else {
			log.Println("MailHog: reset email sent to", to)
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
			log.Println("SMTP: reset email sent to", to)
		}

	default:
		log.Println("EMAIL_MODE not set or invalid. Email not sent. Use console/mailhog/smtp")
	}
}
