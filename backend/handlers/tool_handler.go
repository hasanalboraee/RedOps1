package handlers

import (
	"net/http"
	"redops/models"
	"redops/repositories"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ToolHandler struct {
	repo *repositories.ToolRepository
}

func NewToolHandler(repo *repositories.ToolRepository) *ToolHandler {
	return &ToolHandler{repo: repo}
}

func (h *ToolHandler) CreateTool(c *gin.Context) {
	var tool models.Tool
	if err := c.ShouldBindJSON(&tool); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.repo.Create(&tool); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, tool)
}

func (h *ToolHandler) GetTool(c *gin.Context) {
	id := c.Param("id")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	tool, err := h.repo.GetByID(objectID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tool not found"})
		return
	}

	c.JSON(http.StatusOK, tool)
}

func (h *ToolHandler) UpdateTool(c *gin.Context) {
	id := c.Param("id")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var tool models.Tool
	if err := c.ShouldBindJSON(&tool); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tool.ID = objectID
	if err := h.repo.Update(&tool); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, tool)
}

func (h *ToolHandler) DeleteTool(c *gin.Context) {
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

	c.JSON(http.StatusOK, gin.H{"message": "Tool deleted successfully"})
}

func (h *ToolHandler) ListTools(c *gin.Context) {
	tools, err := h.repo.List()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, tools)
}

func (h *ToolHandler) GetToolsByType(c *gin.Context) {
	toolType := models.ToolType(c.Param("type"))
	tools, err := h.repo.GetByType(toolType)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, tools)
}

func (h *ToolHandler) GetActiveTools(c *gin.Context) {
	tools, err := h.repo.GetActiveTools()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, tools)
}

func (h *ToolHandler) UpdateToolStatus(c *gin.Context) {
	id := c.Param("id")
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var isActive bool
	if err := c.ShouldBindJSON(&isActive); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.repo.UpdateStatus(objectID, isActive); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Tool status updated successfully"})
}
