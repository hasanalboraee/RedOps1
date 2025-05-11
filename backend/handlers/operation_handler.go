package handlers

import (
	"net/http"
	"redops/models"
	"redops/repositories"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type OperationHandler struct {
	repo *repositories.OperationRepository
}

func NewOperationHandler(repo *repositories.OperationRepository) *OperationHandler {
	return &OperationHandler{repo: repo}
}

func (h *OperationHandler) CreateOperation(c *gin.Context) {
	var operation models.Operation
	if err := c.ShouldBindJSON(&operation); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.repo.Create(&operation); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, operation)
}

func (h *OperationHandler) GetOperation(c *gin.Context) {
	id := c.Param("id")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	operation, err := h.repo.GetByID(objectID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Operation not found"})
		return
	}

	// Fetch team lead user
	userRepo := repositories.NewUserRepository()
	teamLead, _ := userRepo.GetByID(operation.TeamLead)

	// Fetch members
	var members []models.User
	for _, memberID := range operation.Members {
		member, err := userRepo.GetByID(memberID)
		if err == nil {
			members = append(members, *member)
		}
	}

	// Fetch tasks for this operation
	taskRepo := repositories.NewTaskRepository()
	tasks, _ := taskRepo.GetByOperationID(operation.ID)

	c.JSON(http.StatusOK, gin.H{
		"_id":           operation.ID,
		"name":          operation.Name,
		"type":          operation.Type,
		"description":   operation.Description,
		"scope":         operation.Scope,
		"roe":           operation.ROE,
		"team_lead":     teamLead,
		"members":       members,
		"current_phase": operation.CurrentPhase,
		"status":        operation.Status,
		"start_date":    operation.StartDate,
		"end_date":      operation.EndDate,
		"created_at":    operation.CreatedAt,
		"updated_at":    operation.UpdatedAt,
		"tasks":         tasks,
	})
}

func (h *OperationHandler) UpdateOperation(c *gin.Context) {
	id := c.Param("id")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var operation models.Operation
	if err := c.ShouldBindJSON(&operation); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	operation.ID = objectID
	if err := h.repo.Update(&operation); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, operation)
}

func (h *OperationHandler) DeleteOperation(c *gin.Context) {
	id := c.Param("id")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	if err := h.repo.Delete(objectID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Operation deleted successfully"})
}

func (h *OperationHandler) ListOperations(c *gin.Context) {
	operations, err := h.repo.List()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, operations)
}

func (h *OperationHandler) GetOperationsByTeamMember(c *gin.Context) {
	userID := c.Param("user_id")
	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID format"})
		return
	}

	operations, err := h.repo.GetByTeamMember(objectID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, operations)
}

func (h *OperationHandler) UpdateOperationPhase(c *gin.Context) {
	id := c.Param("id")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var phase models.OperationPhase
	if err := c.ShouldBindJSON(&phase); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.repo.UpdatePhase(objectID, phase); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Operation phase updated successfully"})
}
