package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type TaskStatus string

const (
	StatusPending    TaskStatus = "pending"
	StatusInProgress TaskStatus = "in_progress"
	StatusCompleted  TaskStatus = "completed"
	StatusBlocked    TaskStatus = "blocked"
)

type Task struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	OperationID primitive.ObjectID `bson:"operation_id" json:"operation_id"`
	Title       string             `bson:"title" json:"title"`
	Description string             `bson:"description" json:"description"`
	AssignedTo  primitive.ObjectID `bson:"assigned_to" json:"assigned_to"`
	Status      TaskStatus         `bson:"status" json:"status"`
	Phase       OperationPhase     `bson:"phase" json:"phase"`
	MITREID     string             `bson:"mitre_id" json:"mitre_id"`
	OWASPID     string             `bson:"owasp_id" json:"owasp_id"`
	Results     string             `bson:"results" json:"results"`
	Tools       []string           `bson:"tools" json:"tools"`
	StartDate   time.Time          `bson:"start_date" json:"start_date"`
	EndDate     time.Time          `bson:"end_date" json:"end_date"`
	CreatedAt   time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt   time.Time          `bson:"updated_at" json:"updated_at"`
}

type TaskResponse struct {
	ID          primitive.ObjectID `json:"id"`
	OperationID primitive.ObjectID `json:"operation_id"`
	Title       string             `json:"title"`
	Description string             `json:"description"`
	AssignedTo  UserResponse       `json:"assigned_to"`
	Status      TaskStatus         `json:"status"`
	Phase       OperationPhase     `json:"phase"`
	MITREID     string             `json:"mitre_id"`
	OWASPID     string             `json:"owasp_id"`
	Results     string             `json:"results"`
	Tools       []string           `json:"tools"`
	StartDate   time.Time          `json:"start_date"`
	EndDate     time.Time          `json:"end_date"`
	CreatedAt   time.Time          `json:"created_at"`
}
