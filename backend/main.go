package main

import (
	"log"
	"net/http"

	"redops/handlers"
	"redops/repositories"
	"redops/websocket"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	// Connect to MongoDB
	client, err := mongo.Connect(nil, options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(nil)

	db := client.Database("redops")

	// Initialize repositories
	notificationRepo := repositories.NewNotificationRepository(db)

	// Initialize WebSocket hub
	hub := websocket.NewHub()
	go hub.Run()

	// Initialize handlers
	notificationHandler := handlers.NewNotificationHandler(notificationRepo, hub)
	wsHandler := handlers.NewWebSocketHandler(hub)

	// Create router
	r := mux.NewRouter()

	// WebSocket endpoint
	r.HandleFunc("/ws", wsHandler.ServeWS)

	// Notification endpoints
	r.HandleFunc("/api/notifications", notificationHandler.GetNotifications).Methods("GET")
	r.HandleFunc("/api/notifications", notificationHandler.CreateNotification).Methods("POST")
	r.HandleFunc("/api/notifications/read", notificationHandler.MarkAsRead).Methods("POST")
	r.HandleFunc("/api/notifications/read-all", notificationHandler.MarkAllAsRead).Methods("POST")

	// Start server
	log.Println("Server starting on :8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
