package handlers

import (
	"devops-triage/models"
	"devops-triage/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AnalyzeLog(c *gin.Context) {
	var req models.AnalyzeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Parse log
	parser := services.NewParserService()
	parsed := parser.ParseLog(req.Log)

	// AI analysis
	aiService := services.NewAIService()
	serviceType := req.ServiceType
	if serviceType == "" {
		serviceType = parsed.Service
	}

	analysis, err := aiService.AnalyzeLog(req.Log, serviceType, req.Environment)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Analysis failed"})
		return
	}

	// Get commands
	toolsService := services.NewToolsService()
	commands := toolsService.GetCommands(parsed.ErrorType, parsed.Service)

	response := models.AnalyzeResponse{
		Parsed:   parsed,
		Analysis: analysis,
		Commands: commands,
	}

	c.JSON(http.StatusOK, response)
}
