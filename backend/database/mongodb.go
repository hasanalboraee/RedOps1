package database

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	Client     *mongo.Client
	Database   *mongo.Database
	Users      *mongo.Collection
	Operations *mongo.Collection
	Tasks      *mongo.Collection
	Tools      *mongo.Collection
)

func ConnectDB() error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	clientOptions := options.Client().ApplyURI("mongodb://18.188.248.46:27017")
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		return err
	}

	// Check the connection
	err = client.Ping(ctx, nil)
	if err != nil {
		return err
	}

	Client = client
	Database = client.Database("redops")

	// Initialize collections
	Users = Database.Collection("users")
	Operations = Database.Collection("operations")
	Tasks = Database.Collection("tasks")
	Tools = Database.Collection("tools")

	log.Println("Connected to MongoDB!")
	return nil
}

func CloseDB() error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := Client.Disconnect(ctx); err != nil {
		return err
	}

	log.Println("Disconnected from MongoDB!")
	return nil
}
