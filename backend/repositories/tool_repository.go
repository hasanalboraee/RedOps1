package repositories

import (
	"context"
	"time"

	"redops/database"
	"redops/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type ToolRepository struct {
	collection *mongo.Collection
}

func NewToolRepository() *ToolRepository {
	return &ToolRepository{
		collection: database.Tools,
	}
}

func (r *ToolRepository) Create(tool *models.Tool) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	tool.CreatedAt = time.Now()
	tool.UpdatedAt = time.Now()

	result, err := r.collection.InsertOne(ctx, tool)
	if err != nil {
		return err
	}

	tool.ID = result.InsertedID.(primitive.ObjectID)
	return nil
}

func (r *ToolRepository) GetByID(id primitive.ObjectID) (*models.Tool, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var tool models.Tool
	err := r.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&tool)
	if err != nil {
		return nil, err
	}

	return &tool, nil
}

func (r *ToolRepository) Update(tool *models.Tool) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	tool.UpdatedAt = time.Now()

	_, err := r.collection.UpdateOne(
		ctx,
		bson.M{"_id": tool.ID},
		bson.M{"$set": tool},
	)
	return err
}

func (r *ToolRepository) Delete(id primitive.ObjectID) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := r.collection.DeleteOne(ctx, bson.M{"_id": id})
	return err
}

func (r *ToolRepository) List() ([]models.Tool, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := r.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var tools []models.Tool
	if err = cursor.All(ctx, &tools); err != nil {
		return nil, err
	}

	return tools, nil
}

func (r *ToolRepository) GetByType(toolType models.ToolType) ([]models.Tool, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := r.collection.Find(ctx, bson.M{"type": toolType})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var tools []models.Tool
	if err = cursor.All(ctx, &tools); err != nil {
		return nil, err
	}

	return tools, nil
}

func (r *ToolRepository) GetActiveTools() ([]models.Tool, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := r.collection.Find(ctx, bson.M{"is_active": true})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var tools []models.Tool
	if err = cursor.All(ctx, &tools); err != nil {
		return nil, err
	}

	return tools, nil
}

func (r *ToolRepository) UpdateStatus(id primitive.ObjectID, isActive bool) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := r.collection.UpdateOne(
		ctx,
		bson.M{"_id": id},
		bson.M{
			"$set": bson.M{
				"is_active":  isActive,
				"updated_at": time.Now(),
			},
		},
	)
	return err
}
