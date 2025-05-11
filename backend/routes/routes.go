package routes

import (
	"redops/handlers"
	"redops/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine, userHandler *handlers.UserHandler, operationHandler *handlers.OperationHandler, taskHandler *handlers.TaskHandler, toolHandler *handlers.ToolHandler, resultHandler *handlers.ResultHandler) {
	// Group all routes under /api
	api := router.Group("/api")
	{
		// Auth routes
		api.POST("/auth/login", userHandler.Login)
		api.POST("/auth/register", userHandler.CreateUser)

		// Protected routes
		protected := api.Group("")
		protected.Use(middleware.AuthMiddleware())
		{
			// User routes
			protected.GET("/users", userHandler.ListUsers)
			protected.GET("/users/:id", userHandler.GetUser)
			protected.PUT("/users/:id", userHandler.UpdateUser)
			protected.DELETE("/users/:id", userHandler.DeleteUser)

			// Operation routes
			protected.GET("/operations", operationHandler.ListOperations)
			protected.POST("/operations", operationHandler.CreateOperation)
			protected.GET("/operations/:id", operationHandler.GetOperation)
			protected.PUT("/operations/:id", operationHandler.UpdateOperation)
			protected.DELETE("/operations/:id", operationHandler.DeleteOperation)

			// Task routes
			protected.GET("/operations/:id/tasks", taskHandler.GetTasksByOperation)
			protected.POST("/operations/:id/tasks", taskHandler.CreateTask)
			protected.GET("/operations/:id/tasks/:taskId", taskHandler.GetTask)
			protected.PUT("/operations/:id/tasks/:taskId", taskHandler.UpdateTask)
			protected.DELETE("/operations/:id/tasks/:taskId", taskHandler.DeleteTask)

			// Tool routes
			protected.GET("/tools", toolHandler.ListTools)
			protected.POST("/tools", toolHandler.CreateTool)
			protected.GET("/tools/:id", toolHandler.GetTool)
			protected.PUT("/tools/:id", toolHandler.UpdateTool)
			protected.DELETE("/tools/:id", toolHandler.DeleteTool)

			// Result routes
			protected.GET("/tasks/:taskId/results", resultHandler.GetTaskResults)
			protected.POST("/tasks/:taskId/results/import", resultHandler.ImportResults)
			protected.DELETE("/tasks/:taskId/results", resultHandler.DeleteTaskResults)
		}
	}
}
