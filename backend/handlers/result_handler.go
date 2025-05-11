package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/xuri/excelize/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"redops/models"
	"redops/repositories"
)

type ResultHandler struct {
	repo *repositories.ResultRepository
}

func NewResultHandler(repo *repositories.ResultRepository) *ResultHandler {
	return &ResultHandler{repo: repo}
}

// GetTaskResults retrieves all results for a specific task
func (h *ResultHandler) GetTaskResults(c *gin.Context) {
	taskID := c.Param("taskId")

	// Convert string ID to ObjectID
	objectID, err := primitive.ObjectIDFromHex(taskID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
		return
	}

	results, err := h.repo.GetByTaskID(objectID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching results"})
		return
	}

	c.JSON(http.StatusOK, results)
}

// ImportResults imports results from an Excel file
func (h *ResultHandler) ImportResults(c *gin.Context) {
	taskID := c.Param("taskId")

	// Convert string ID to ObjectID
	objectID, err := primitive.ObjectIDFromHex(taskID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
		return
	}

	// Get the uploaded file
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}

	// Open the file
	src, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error opening file"})
		return
	}
	defer src.Close()

	// Read the Excel file
	f, err := excelize.OpenReader(src)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Excel file"})
		return
	}

	// Get the first sheet
	sheetName := f.GetSheetName(0)
	rows, err := f.GetRows(sheetName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error reading Excel file"})
		return
	}

	// Skip header row and process data
	var results []models.Result
	for i, row := range rows {
		if i == 0 {
			continue // Skip header row
		}

		result := models.Result{
			TaskID:             objectID,
			Start:              getCellValue(row, 0),
			End:                getCellValue(row, 1),
			SourceIP:           getCellValue(row, 2),
			DestinationIP:      getCellValue(row, 3),
			DestinationPort:    getCellValue(row, 4),
			DestinationSystem:  getCellValue(row, 5),
			PivotIP:            getCellValue(row, 6),
			PivotPort:          getCellValue(row, 7),
			URL:                getCellValue(row, 8),
			ToolApp:            getCellValue(row, 9),
			Command:            getCellValue(row, 10),
			Description:        getCellValue(row, 11),
			Output:             getCellValue(row, 12),
			Result:             getCellValue(row, 13),
			SystemModification: getCellValue(row, 14),
			Comments:           getCellValue(row, 15),
			OperatorName:       getCellValue(row, 16),
		}
		results = append(results, result)
	}

	// Insert all results
	if err := h.repo.CreateMany(results); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error inserting results"})
		return
	}

	// Fetch and return the updated results
	updatedResults, err := h.repo.GetByTaskID(objectID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching updated results"})
		return
	}

	c.JSON(http.StatusOK, updatedResults)
}

// DeleteTaskResults deletes all results for a specific task
func (h *ResultHandler) DeleteTaskResults(c *gin.Context) {
	taskID := c.Param("taskId")

	// Convert string ID to ObjectID
	objectID, err := primitive.ObjectIDFromHex(taskID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
		return
	}

	if err := h.repo.DeleteByTaskID(objectID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error deleting results"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Results deleted successfully"})
}

// Helper function to safely get cell value
func getCellValue(row []string, index int) string {
	if index < len(row) {
		return row[index]
	}
	return ""
}
