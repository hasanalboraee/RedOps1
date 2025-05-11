package middleware

import (
	"log"
	"net/http"
	"strings"

	"redops/utils"

	"github.com/gin-gonic/gin"
)

// AuthMiddleware checks for valid JWT token in Authorization header
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		log.Printf("Auth header: %s", authHeader)

		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
			c.Abort()
			return
		}

		// Check if the header has the Bearer prefix
		parts := strings.Split(authHeader, " ")
		log.Printf("Auth header parts: %v", parts)

		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization header format"})
			c.Abort()
			return
		}

		// Validate the token
		claims, err := utils.ValidateToken(parts[1])
		if err != nil {
			log.Printf("Token validation error: %v", err)
			status := http.StatusUnauthorized
			if err == utils.ErrExpiredToken {
				status = http.StatusForbidden
			}
			c.JSON(status, gin.H{"error": err.Error()})
			c.Abort()
			return
		}

		log.Printf("Token validated successfully for user: %s", claims.Username)

		// Set user info in context
		c.Set("userID", claims.UserID)
		c.Set("username", claims.Username)
		c.Set("role", claims.Role)

		c.Next()
	}
}
