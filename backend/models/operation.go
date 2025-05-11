package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type OperationType string

const (
	TypeRedTeam                 OperationType = "red_team"
	TypePenTest                 OperationType = "pen_test"
	TypeVulnerabilityAssessment OperationType = "vulnerability_assessment"
)

type OperationPhase string

const (
	PhaseReconnaissance      OperationPhase = "reconnaissance"
	PhaseInitialAccess       OperationPhase = "initial_access"
	PhaseExecution           OperationPhase = "execution"
	PhasePersistence         OperationPhase = "persistence"
	PhasePrivilegeEscalation OperationPhase = "privilege_escalation"
	PhaseDefenseEvasion      OperationPhase = "defense_evasion"
	PhaseCredentialAccess    OperationPhase = "credential_access"
	PhaseDiscovery           OperationPhase = "discovery"
	PhaseLateralMovement     OperationPhase = "lateral_movement"
	PhaseCollection          OperationPhase = "collection"
	PhaseCommandAndControl   OperationPhase = "command_and_control"
	PhaseExfiltration        OperationPhase = "exfiltration"
	PhaseImpact              OperationPhase = "impact"
)

type Operation struct {
	ID           primitive.ObjectID   `bson:"_id,omitempty" json:"_id"`
	Name         string               `bson:"name" json:"name"`
	Type         OperationType        `bson:"type" json:"type"`
	Description  string               `bson:"description" json:"description"`
	Scope        string               `bson:"scope" json:"scope"`
	ROE          string               `bson:"roe" json:"roe"` // Rules of Engagement
	TeamLead     primitive.ObjectID   `bson:"team_lead" json:"team_lead"`
	Members      []primitive.ObjectID `bson:"members" json:"members"`
	CurrentPhase OperationPhase       `bson:"current_phase" json:"current_phase"`
	Status       string               `bson:"status" json:"status"`
	StartDate    time.Time            `bson:"start_date" json:"start_date"`
	EndDate      time.Time            `bson:"end_date" json:"end_date"`
	CreatedAt    time.Time            `bson:"created_at" json:"created_at"`
	UpdatedAt    time.Time            `bson:"updated_at" json:"updated_at"`
}

type OperationResponse struct {
	ID           primitive.ObjectID `json:"id"`
	Name         string             `json:"name"`
	Type         OperationType      `json:"type"`
	Description  string             `json:"description"`
	Scope        string             `json:"scope"`
	ROE          string             `json:"roe"`
	TeamLead     UserResponse       `json:"team_lead"`
	Members      []UserResponse     `json:"members"`
	CurrentPhase OperationPhase     `json:"current_phase"`
	Status       string             `json:"status"`
	StartDate    time.Time          `json:"start_date"`
	EndDate      time.Time          `json:"end_date"`
	CreatedAt    time.Time          `json:"created_at"`
}
