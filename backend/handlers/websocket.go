package handlers

import (
	"log"
	"net/http"

	"redops/websocket"

	gorilla "github.com/gorilla/websocket"
)

var upgrader = gorilla.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // TODO: Implement proper origin checking
	},
}

type WebSocketHandler struct {
	hub *websocket.Hub
}

func NewWebSocketHandler(hub *websocket.Hub) *WebSocketHandler {
	return &WebSocketHandler{
		hub: hub,
	}
}

func (h *WebSocketHandler) ServeWS(w http.ResponseWriter, r *http.Request) {
	// Get user ID from context (assuming it's set by auth middleware)
	userID := r.Context().Value("user_id").(string)

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Error upgrading connection: %v", err)
		return
	}

	client := &websocket.Client{
		Conn:   conn,
		Send:   make(chan []byte, 256),
		Hub:    h.hub,
		UserID: userID,
	}

	client.Hub.Register <- client

	// Start goroutines for reading and writing
	go client.WritePump()
	go client.ReadPump()
}
