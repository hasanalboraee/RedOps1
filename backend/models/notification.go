package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type NotificationType string

const (
	NotificationTypeSuccess NotificationType = "success"
	NotificationTypeError   NotificationType = "error"
	NotificationTypeWarning NotificationType = "warning"
	NotificationTypeInfo    NotificationType = "info"
)

type Notification struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID    string             `bson:"user_id" json:"user_id"`
	Type      NotificationType   `bson:"type" json:"type"`
	Title     string             `bson:"title" json:"title"`
	Message   string             `bson:"message" json:"message"`
	Read      bool               `bson:"read" json:"read"`
	Link      string             `bson:"link,omitempty" json:"link,omitempty"`
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt time.Time          `bson:"updated_at" json:"updated_at"`
}
