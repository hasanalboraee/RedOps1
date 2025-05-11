package repositories

import (
	"context"
	"time"

	"redops/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type NotificationRepository struct {
	collection *mongo.Collection
}

func NewNotificationRepository(db *mongo.Database) *NotificationRepository {
	return &NotificationRepository{
		collection: db.Collection("notifications"),
	}
}

func (r *NotificationRepository) Create(notification *models.Notification) error {
	notification.CreatedAt = time.Now()
	notification.UpdatedAt = time.Now()

	result, err := r.collection.InsertOne(context.Background(), notification)
	if err != nil {
		return err
	}

	notification.ID = result.InsertedID.(primitive.ObjectID)
	return nil
}

func (r *NotificationRepository) GetByUserID(userID string) ([]models.Notification, error) {
	cursor, err := r.collection.Find(context.Background(), bson.M{"user_id": userID})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var notifications []models.Notification
	if err := cursor.All(context.Background(), &notifications); err != nil {
		return nil, err
	}

	return notifications, nil
}

func (r *NotificationRepository) MarkAsRead(id string, userID string) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	update := bson.M{
		"$set": bson.M{
			"read":       true,
			"updated_at": time.Now(),
		},
	}

	_, err = r.collection.UpdateOne(
		context.Background(),
		bson.M{"_id": objectID, "user_id": userID},
		update,
	)

	return err
}

func (r *NotificationRepository) MarkAllAsRead(userID string) error {
	update := bson.M{
		"$set": bson.M{
			"read":       true,
			"updated_at": time.Now(),
		},
	}

	_, err := r.collection.UpdateMany(
		context.Background(),
		bson.M{"user_id": userID, "read": false},
		update,
	)

	return err
}

func (r *NotificationRepository) Delete(id string, userID string) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	_, err = r.collection.DeleteOne(
		context.Background(),
		bson.M{"_id": objectID, "user_id": userID},
	)

	return err
}
