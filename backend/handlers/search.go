package handlers

import (
	"devops-triage/models"
	"devops-triage/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

func SearchWeb(c *gin.Context) {
	var req models.SearchRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	tavilyService := services.NewTavilyService()
	results, summary, err := tavilyService.Search(req.Error, req.Service)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Search failed"})
		return
	}

	response := models.SearchResponse{
		Results:   results,
		AISummary: summary,
	}

	c.JSON(http.StatusOK, response)
}
