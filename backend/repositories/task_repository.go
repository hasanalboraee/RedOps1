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

type TaskRepository struct {
	collection *mongo.Collection
}

func NewTaskRepository() *TaskRepository {
	return &TaskRepository{
		collection: database.Tasks,
	}
}

func (r *TaskRepository) Create(task *models.Task) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	task.CreatedAt = time.Now()
	task.UpdatedAt = time.Now()

	result, err := r.collection.InsertOne(ctx, task)
	if err != nil {
		return err
	}

	task.ID = result.InsertedID.(primitive.ObjectID)
	return nil
}

func (r *TaskRepository) GetByID(id primitive.ObjectID) (*models.Task, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var task models.Task
	err := r.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&task)
	if err != nil {
		return nil, err
	}

	return &task, nil
}

func (r *TaskRepository) Update(task *models.Task) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	task.UpdatedAt = time.Now()

	_, err := r.collection.UpdateOne(
		ctx,
		bson.M{"_id": task.ID},
		bson.M{"$set": task},
	)
	return err
}

func (r *TaskRepository) Delete(id primitive.ObjectID) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := r.collection.DeleteOne(ctx, bson.M{"_id": id})
	return err
}

func (r *TaskRepository) List() ([]models.Task, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := r.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var tasks []models.Task
	if err = cursor.All(ctx, &tasks); err != nil {
		return nil, err
	}

	return tasks, nil
}

func (r *TaskRepository) GetByOperationID(operationID primitive.ObjectID) ([]models.Task, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := r.collection.Find(ctx, bson.M{"operation_id": operationID})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var tasks []models.Task
	if err = cursor.All(ctx, &tasks); err != nil {
		return nil, err
	}

	return tasks, nil
}

func (r *TaskRepository) GetByAssignedUser(userID primitive.ObjectID) ([]models.Task, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := r.collection.Find(ctx, bson.M{"assigned_to": userID})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var tasks []models.Task
	if err = cursor.All(ctx, &tasks); err != nil {
		return nil, err
	}

	return tasks, nil
}

func (r *TaskRepository) UpdateStatus(id primitive.ObjectID, status models.TaskStatus) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := r.collection.UpdateOne(
		ctx,
		bson.M{"_id": id},
		bson.M{
			"$set": bson.M{
				"status":     status,
				"updated_at": time.Now(),
			},
		},
	)
	return err
}

func (r *TaskRepository) UpdateResults(id primitive.ObjectID, results string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := r.collection.UpdateOne(
		ctx,
		bson.M{"_id": id},
		bson.M{
			"$set": bson.M{
				"results":    results,
				"updated_at": time.Now(),
			},
		},
	)
	return err
}
