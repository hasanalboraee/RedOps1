package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ToolType string

const (
	TypeReconnaissance   ToolType = "reconnaissance"
	TypeVulnerability    ToolType = "vulnerability"
	TypeExploitation     ToolType = "exploitation"
	TypePostExploitation ToolType = "post_exploitation"
)

type Tool struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name         string             `bson:"name" json:"name"`
	Type         ToolType           `bson:"type" json:"type"`
	Description  string             `bson:"description" json:"description"`
	Command      string             `bson:"command" json:"command"`
	Arguments    map[string]string  `bson:"arguments" json:"arguments"`
	OutputFormat string             `bson:"output_format" json:"output_format"`
	IsActive     bool               `bson:"is_active" json:"is_active"`
	CreatedAt    time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt    time.Time          `bson:"updated_at" json:"updated_at"`
}

type ToolExecution struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	ToolID    primitive.ObjectID `bson:"tool_id" json:"tool_id"`
	TaskID    primitive.ObjectID `bson:"task_id" json:"task_id"`
	Command   string             `bson:"command" json:"command"`
	Arguments map[string]string  `bson:"arguments" json:"arguments"`
	Output    string             `bson:"output" json:"output"`
	Status    string             `bson:"status" json:"status"`
	StartTime time.Time          `bson:"start_time" json:"start_time"`
	EndTime   time.Time          `bson:"end_time" json:"end_time"`
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
}
