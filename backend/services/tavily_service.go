package services

import (
	"bytes"
	"devops-triage/models"

	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

type TavilyService struct {
	apiKey string
	client *http.Client
}

func NewTavilyService() *TavilyService {
	return &TavilyService{
		apiKey: os.Getenv("TAVILY_API_KEY"),
		client: &http.Client{},
	}
}

func (ts *TavilyService) Search(errorMsg string, service string) ([]models.SearchResult, string, error) {
	if ts.apiKey == "" {
		return ts.mockSearch(errorMsg, service), "Mock search results (Tavily API key not configured)", nil
	}

	query := fmt.Sprintf("%s %s solution 2025", errorMsg, service)

	payload := map[string]interface{}{
		"api_key":         ts.apiKey,
		"query":           query,
		"search_depth":    "basic",
		"include_domains": []string{"stackoverflow.com", "github.com"},
		"max_results":     5,
	}

	jsonData, _ := json.Marshal(payload)
	req, _ := http.NewRequest("POST", "https://api.tavily.com/search", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")

	resp, err := ts.client.Do(req)
	if err != nil {
		return ts.mockSearch(errorMsg, service), "Error calling Tavily API", nil
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	var response struct {
		Results []struct {
			Title   string `json:"title"`
			URL     string `json:"url"`
			Content string `json:"content"`
		} `json:"results"`
	}

	if err := json.Unmarshal(body, &response); err != nil {
		return ts.mockSearch(errorMsg, service), "Error parsing Tavily response", nil
	}

	results := make([]models.SearchResult, 0)
	for _, r := range response.Results {
		results = append(results, models.SearchResult{
			Title:   r.Title,
			URL:     r.URL,
			Snippet: r.Content,
		})
	}

	summary := ts.generateSummary(results)
	return results, summary, nil
}

func (ts *TavilyService) mockSearch(errorMsg string, service string) []models.SearchResult {
	return []models.SearchResult{
		{
			Title:   fmt.Sprintf("Stack Overflow - %s error solution", service),
			URL:     "https://stackoverflow.com/questions/example",
			Snippet: "Common solutions include checking service status and configuration files...",
		},
		{
			Title:   fmt.Sprintf("GitHub Issue - Similar %s problem", service),
			URL:     "https://github.com/org/repo/issues/123",
			Snippet: "Fixed by updating configuration and restarting the service...",
		},
	}
}

func (ts *TavilyService) generateSummary(results []models.SearchResult) string {
	if len(results) == 0 {
		return "No results found. Try checking official documentation or system logs."
	}

	return fmt.Sprintf("Found %d relevant results. Common solutions include checking service configuration, verifying network connectivity, and reviewing system logs for additional context.", len(results))
}
