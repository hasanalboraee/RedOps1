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

type OperationRepository struct {
	collection *mongo.Collection
}

func NewOperationRepository() *OperationRepository {
	return &OperationRepository{
		collection: database.Operations,
	}
}

func (r *OperationRepository) Create(operation *models.Operation) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	operation.CreatedAt = time.Now()
	operation.UpdatedAt = time.Now()

	result, err := r.collection.InsertOne(ctx, operation)
	if err != nil {
		return err
	}

	operation.ID = result.InsertedID.(primitive.ObjectID)
	return nil
}

func (r *OperationRepository) GetByID(id primitive.ObjectID) (*models.Operation, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var operation models.Operation
	err := r.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&operation)
	if err != nil {
		return nil, err
	}

	return &operation, nil
}

func (r *OperationRepository) Update(operation *models.Operation) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	operation.UpdatedAt = time.Now()

	_, err := r.collection.UpdateOne(
		ctx,
		bson.M{"_id": operation.ID},
		bson.M{"$set": operation},
	)
	return err
}

func (r *OperationRepository) Delete(id primitive.ObjectID) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := r.collection.DeleteOne(ctx, bson.M{"_id": id})
	return err
}

func (r *OperationRepository) List() ([]models.Operation, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := r.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var operations []models.Operation
	if err = cursor.All(ctx, &operations); err != nil {
		return nil, err
	}

	return operations, nil
}

func (r *OperationRepository) GetByTeamMember(userID primitive.ObjectID) ([]models.Operation, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{
		"$or": []bson.M{
			{"team_lead": userID},
			{"members": userID},
		},
	}

	cursor, err := r.collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var operations []models.Operation
	if err = cursor.All(ctx, &operations); err != nil {
		return nil, err
	}

	return operations, nil
}

func (r *OperationRepository) UpdatePhase(id primitive.ObjectID, phase models.OperationPhase) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := r.collection.UpdateOne(
		ctx,
		bson.M{"_id": id},
		bson.M{
			"$set": bson.M{
				"current_phase": phase,
				"updated_at":    time.Now(),
			},
		},
	)
	return err
}
