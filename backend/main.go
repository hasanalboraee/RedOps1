package main

import (
	"crypto/rand"
	"encoding/base64"
	"log"

	"redops/database"
	"redops/handlers"
	"redops/models"
	"redops/repositories"
	"redops/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	// Connect to MongoDB
	if err := database.ConnectDB(); err != nil {
		log.Fatal("Failed to connect to MongoDB:", err)
	}
	log.Println("Connected to MongoDB!")

	// Auto-create team lead if users collection is empty
	userRepo := repositories.NewUserRepository()
	userCount, err := database.Users.CountDocuments(nil, map[string]interface{}{})
	if err != nil {
		log.Fatal("Failed to check user count:", err)
	}
	if userCount == 0 {
		username := "admin"
		password := generateRandomPassword(12)
		user := &models.User{
			Username: username,
			Email:    "admin@redops.local",
			Role:     "team_lead",
			Password: hashPassword(password),
		}
		err := userRepo.Create(user)
		if err != nil {
			log.Fatal("Failed to create default team lead:", err)
		}
		log.Println("==============================")
		log.Println("RedOps Framework Initial Team Lead Account:")
		log.Printf("Username: %s\nPassword: %s\n", username, password)
		log.Println("==============================")
	}

	// Initialize repositories
	operationRepo := repositories.NewOperationRepository()
	taskRepo := repositories.NewTaskRepository()
	toolRepo := repositories.NewToolRepository()
	resultRepo := repositories.NewResultRepository()

	// Initialize handlers
	userHandler := handlers.NewUserHandler(userRepo)
	operationHandler := handlers.NewOperationHandler(operationRepo)
	taskHandler := handlers.NewTaskHandler(taskRepo)
	toolHandler := handlers.NewToolHandler(toolRepo)
	resultHandler := handlers.NewResultHandler(resultRepo)

	// Create router
	router := gin.Default()

	// Configure CORS
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "Accept"},
		ExposeHeaders:    []string{"Authorization", "Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * 60 * 60, // 12 hours
	}))

	// Setup routes
	routes.SetupRoutes(router, userHandler, operationHandler, taskHandler, toolHandler, resultHandler)

	// Start server
	log.Println("Server starting on :8080")
	if err := router.Run(":8080"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

func generateRandomPassword(length int) string {
	b := make([]byte, length)
	_, err := rand.Read(b)
	if err != nil {
		return "changeme123!" // fallback
	}
	return base64.StdEncoding.EncodeToString(b)[:length]
}

func hashPassword(password string) string {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return password // fallback
	}
	return string(hash)
}
