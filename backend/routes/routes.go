package routes

import (
	"redops/handlers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine, userHandler *handlers.UserHandler, operationHandler *handlers.OperationHandler, taskHandler *handlers.TaskHandler, toolHandler *handlers.ToolHandler) {
	// User routes
	userRoutes := router.Group("/api/users")
	{
		userRoutes.POST("", userHandler.CreateUser)
		userRoutes.GET("", userHandler.ListUsers)
		userRoutes.GET("/:id", userHandler.GetUser)
		userRoutes.PUT("/:id", userHandler.UpdateUser)
		userRoutes.DELETE("/:id", userHandler.DeleteUser)
		userRoutes.GET("/email/:email", userHandler.GetUserByEmail)
	}

	// Operation routes
	operationRoutes := router.Group("/api/operations")
	{
		operationRoutes.POST("", operationHandler.CreateOperation)
		operationRoutes.GET("", operationHandler.ListOperations)
		operationRoutes.GET("/:id", operationHandler.GetOperation)
		operationRoutes.PUT("/:id", operationHandler.UpdateOperation)
		operationRoutes.DELETE("/:id", operationHandler.DeleteOperation)
		operationRoutes.GET("/user/:user_id", operationHandler.GetOperationsByTeamMember)
		operationRoutes.PUT("/:id/phase", operationHandler.UpdateOperationPhase)
	}

	// Task routes
	taskRoutes := router.Group("/api/tasks")
	{
		taskRoutes.POST("", taskHandler.CreateTask)
		taskRoutes.GET("", taskHandler.ListTasks)
		taskRoutes.GET("/:id", taskHandler.GetTask)
		taskRoutes.PUT("/:id", taskHandler.UpdateTask)
		taskRoutes.DELETE("/:id", taskHandler.DeleteTask)
		taskRoutes.GET("/operation/:operation_id", taskHandler.GetTasksByOperation)
		taskRoutes.GET("/user/:user_id", taskHandler.GetTasksByAssignedUser)
		taskRoutes.PUT("/:id/status", taskHandler.UpdateTaskStatus)
		taskRoutes.PUT("/:id/results", taskHandler.UpdateTaskResults)
	}

	// Tool routes
	toolRoutes := router.Group("/api/tools")
	{
		toolRoutes.POST("", toolHandler.CreateTool)
		toolRoutes.GET("", toolHandler.ListTools)
		toolRoutes.GET("/:id", toolHandler.GetTool)
		toolRoutes.PUT("/:id", toolHandler.UpdateTool)
		toolRoutes.DELETE("/:id", toolHandler.DeleteTool)
		toolRoutes.GET("/type/:type", toolHandler.GetToolsByType)
		toolRoutes.GET("/active", toolHandler.GetActiveTools)
		toolRoutes.PUT("/:id/status", toolHandler.UpdateToolStatus)
	}
}
