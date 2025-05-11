package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Result represents a task result in the database
type Result struct {
	ID                 primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	TaskID             primitive.ObjectID `bson:"taskId" json:"taskId"`
	Start              string             `bson:"start,omitempty" json:"start,omitempty"`
	End                string             `bson:"end,omitempty" json:"end,omitempty"`
	SourceIP           string             `bson:"sourceIP,omitempty" json:"sourceIP,omitempty"`
	DestinationIP      string             `bson:"destinationIP,omitempty" json:"destinationIP,omitempty"`
	DestinationPort    string             `bson:"destinationPort,omitempty" json:"destinationPort,omitempty"`
	DestinationSystem  string             `bson:"destinationSystem,omitempty" json:"destinationSystem,omitempty"`
	PivotIP            string             `bson:"pivotIP,omitempty" json:"pivotIP,omitempty"`
	PivotPort          string             `bson:"pivotPort,omitempty" json:"pivotPort,omitempty"`
	URL                string             `bson:"url,omitempty" json:"url,omitempty"`
	ToolApp            string             `bson:"toolApp,omitempty" json:"toolApp,omitempty"`
	Command            string             `bson:"command,omitempty" json:"command,omitempty"`
	Description        string             `bson:"description,omitempty" json:"description,omitempty"`
	Output             string             `bson:"output,omitempty" json:"output,omitempty"`
	Result             string             `bson:"result,omitempty" json:"result,omitempty"`
	SystemModification string             `bson:"systemModification,omitempty" json:"systemModification,omitempty"`
	Comments           string             `bson:"comments,omitempty" json:"comments,omitempty"`
	OperatorName       string             `bson:"operatorName,omitempty" json:"operatorName,omitempty"`
	CreatedAt          time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt          time.Time          `bson:"updatedAt" json:"updatedAt"`
}
