package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserRole string

const (
	RoleAdmin    UserRole = "admin"
	RoleTeamLead UserRole = "team_lead"
	RoleMember   UserRole = "member"
)

type User struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Username  string             `bson:"username" json:"username"`
	Email     string             `bson:"email" json:"email"`
	Password  string             `bson:"password" json:"-"`
	Role      UserRole           `bson:"role" json:"role"`
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt time.Time          `bson:"updated_at" json:"updated_at"`
}

type UserResponse struct {
	ID        primitive.ObjectID `json:"id"`
	Username  string             `json:"username"`
	Email     string             `json:"email"`
	Role      UserRole           `json:"role"`
	CreatedAt time.Time          `json:"created_at"`
}
