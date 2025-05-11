package utils

import (
	"errors"
	"log"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var (
	ErrInvalidToken = errors.New("invalid token")
	ErrExpiredToken = errors.New("token has expired")
)

type Claims struct {
	UserID   string `json:"user_id"`
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

func GenerateToken(userID, username, role string) (string, error) {
	// Get JWT secret from environment variable or use default
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "your-secret-key" // Change this in production
		log.Printf("Warning: Using default JWT secret key")
	}

	// Set expiration time to 24 hours
	expirationTime := time.Now().Add(24 * time.Hour)

	// Create claims with user data
	claims := &Claims{
		UserID:   userID,
		Username: username,
		Role:     role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	// Create token with claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Generate encoded token
	tokenString, err := token.SignedString([]byte(jwtSecret))
	if err != nil {
		return "", err
	}

	log.Printf("Generated token for user %s", username)
	return tokenString, nil
}

func ValidateToken(tokenString string) (*Claims, error) {
	// Get JWT secret from environment variable or use default
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "your-secret-key" // Change this in production
		log.Printf("Warning: Using default JWT secret key")
	}

	log.Printf("Validating token: %s", tokenString)

	// Parse the token
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(jwtSecret), nil
	})

	if err != nil {
		log.Printf("Token parsing error: %v", err)
		if errors.Is(err, jwt.ErrTokenExpired) {
			return nil, ErrExpiredToken
		}
		return nil, ErrInvalidToken
	}

	// Validate token
	if !token.Valid {
		log.Printf("Token is invalid")
		return nil, ErrInvalidToken
	}

	// Get claims
	claims, ok := token.Claims.(*Claims)
	if !ok {
		log.Printf("Failed to parse claims")
		return nil, ErrInvalidToken
	}

	log.Printf("Token validated successfully for user: %s", claims.Username)
	return claims, nil
}
