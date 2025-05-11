package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"redops/models"
	"redops/repositories"
	"redops/websocket"
)

type NotificationHandler struct {
	repo *repositories.NotificationRepository
	hub  *websocket.Hub
}

func NewNotificationHandler(repo *repositories.NotificationRepository, hub *websocket.Hub) *NotificationHandler {
	return &NotificationHandler{
		repo: repo,
		hub:  hub,
	}
}

// GetNotifications returns all notifications for the current user
func (h *NotificationHandler) GetNotifications(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id").(string)

	notifications, err := h.repo.GetByUserID(userID)
	if err != nil {
		http.Error(w, "Error fetching notifications", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(notifications)
}

// MarkAsRead marks a notification as read
func (h *NotificationHandler) MarkAsRead(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id").(string)
	notificationID := r.URL.Query().Get("id")

	err := h.repo.MarkAsRead(notificationID, userID)
	if err != nil {
		http.Error(w, "Error marking notification as read", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

// MarkAllAsRead marks all notifications as read for the current user
func (h *NotificationHandler) MarkAllAsRead(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id").(string)

	err := h.repo.MarkAllAsRead(userID)
	if err != nil {
		http.Error(w, "Error marking all notifications as read", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

// CreateNotification creates a new notification
func (h *NotificationHandler) CreateNotification(w http.ResponseWriter, r *http.Request) {
	var notification models.Notification
	if err := json.NewDecoder(r.Body).Decode(&notification); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	notification.CreatedAt = time.Now()
	notification.Read = false

	err := h.repo.Create(&notification)
	if err != nil {
		http.Error(w, "Error creating notification", http.StatusInternalServerError)
		return
	}

	// Broadcast notification to all connected clients
	h.hub.BroadcastNotification(websocket.Notification{
		Type:    "notification",
		Payload: notification,
	})

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(notification)
}
