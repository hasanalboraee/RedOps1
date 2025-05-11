package repositories

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	"redops/database"
	"redops/models"
)

type ResultRepository struct {
	collection *mongo.Collection
}

func NewResultRepository() *ResultRepository {
	return &ResultRepository{
		collection: database.Results,
	}
}

// Create inserts a new result into the database
func (r *ResultRepository) Create(result *models.Result) error {
	result.CreatedAt = time.Now()
	result.UpdatedAt = time.Now()

	_, err := r.collection.InsertOne(context.Background(), result)
	return err
}

// GetByTaskID retrieves all results for a specific task
func (r *ResultRepository) GetByTaskID(taskID primitive.ObjectID) ([]models.Result, error) {
	cursor, err := r.collection.Find(context.Background(), bson.M{"taskId": taskID})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var results []models.Result
	if err = cursor.All(context.Background(), &results); err != nil {
		return nil, err
	}

	return results, nil
}

// DeleteByTaskID deletes all results for a specific task
func (r *ResultRepository) DeleteByTaskID(taskID primitive.ObjectID) error {
	_, err := r.collection.DeleteMany(context.Background(), bson.M{"taskId": taskID})
	return err
}

// CreateMany inserts multiple results into the database
func (r *ResultRepository) CreateMany(results []models.Result) error {
	if len(results) == 0 {
		return nil
	}

	// Convert results to interface slice for bulk insert
	docs := make([]interface{}, len(results))
	for i, result := range results {
		result.CreatedAt = time.Now()
		result.UpdatedAt = time.Now()
		docs[i] = result
	}

	_, err := r.collection.InsertMany(context.Background(), docs)
	return err
}
