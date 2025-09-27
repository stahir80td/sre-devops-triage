package services

import (
	"bytes"
	"devops-triage/models"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
)

type AIService struct {
	hfToken       string
	client        *http.Client
	parserService *ParserService
}

func NewAIService() *AIService {
	return &AIService{
		hfToken:       os.Getenv("HF_TOKEN"),
		client:        &http.Client{},
		parserService: NewParserService(),
	}
}

func (ai *AIService) AnalyzeLog(log string, serviceType string, env string) (models.Analysis, error) {
	prompt := fmt.Sprintf(`You are a Senior SRE. Analyze this log and provide a JSON response.

Log: %s
Service: %s
Environment: %s

Provide ONLY a JSON response in this exact format:
{
  "error_summary": "One sentence summary",
  "root_cause": "2-3 sentence explanation of root cause",
  "impact": "Impact assessment",
  "confidence": 0.85
}`, log, serviceType, env)

	// Try HuggingFace API
	response, err := ai.callHuggingFace(prompt)
	if err != nil {
		// Fallback to pattern-based analysis
		return ai.patternBasedAnalysis(log, serviceType), nil
	}

	return ai.parseAnalysis(response), nil
}

func (ai *AIService) callHuggingFace(prompt string) (string, error) {
	if ai.hfToken == "" {
		return "", fmt.Errorf("no HF token")
	}

	url := "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1"

	payload := map[string]interface{}{
		"inputs": prompt,
		"parameters": map[string]interface{}{
			"max_new_tokens": 500,
			"temperature":    0.3,
		},
	}

	jsonData, _ := json.Marshal(payload)
	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	req.Header.Set("Authorization", "Bearer "+ai.hfToken)
	req.Header.Set("Content-Type", "application/json")

	resp, err := ai.client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	var result []map[string]interface{}
	if err := json.Unmarshal(body, &result); err != nil {
		return "", err
	}

	if len(result) > 0 {
		if text, ok := result[0]["generated_text"].(string); ok {
			return text, nil
		}
	}

	return "", fmt.Errorf("invalid response")
}

func (ai *AIService) patternBasedAnalysis(log string, serviceType string) models.Analysis {
	// Try to get matched pattern first
	pattern := ai.parserService.GetPatternForLog(log)
	if pattern != nil {
		return models.Analysis{
			ErrorSummary: pattern.Summary,
			RootCause:    pattern.RootCause,
			Impact:       pattern.Impact,
			Confidence:   pattern.Confidence,
		}
	}

	// Fallback to basic pattern analysis
	logLower := strings.ToLower(log)
	analysis := models.Analysis{Confidence: 0.70}

	switch {
	case strings.Contains(logLower, "connect() failed (111") || (strings.Contains(logLower, "connection refused") && strings.Contains(logLower, "nginx")):
		analysis.ErrorSummary = "Nginx cannot connect to upstream backend service"
		analysis.RootCause = "The upstream application server is not running or not accepting connections. Nginx is acting as a reverse proxy but cannot reach the application on the specified port."
		analysis.Impact = "API requests are failing with 502 Bad Gateway errors. Users cannot access the application until the backend service is restored."
		analysis.Confidence = 0.90

	case strings.Contains(logLower, "crashloopbackoff"):
		analysis.ErrorSummary = "Kubernetes pod is in a crash loop"
		analysis.RootCause = "The container is exiting immediately after starting, causing Kubernetes to repeatedly restart it. This is typically caused by application errors, misconfiguration, or missing dependencies."
		analysis.Impact = "The service is unavailable and cannot serve traffic until the underlying issue is resolved."
		analysis.Confidence = 0.93

	case strings.Contains(logLower, "outofmemoryerror") && strings.Contains(logLower, "java"):
		analysis.ErrorSummary = "JVM ran out of heap memory"
		analysis.RootCause = "Insufficient heap size (-Xmx), memory leak in application code, or processing datasets larger than allocated heap."
		analysis.Impact = "Application crash. Request failures. Service unavailable."
		analysis.Confidence = 0.95

	case strings.Contains(logLower, "enospc") || strings.Contains(logLower, "no space left"):
		analysis.ErrorSummary = "System has run out of disk space"
		analysis.RootCause = "The filesystem has reached its capacity, preventing new files from being written. This could be due to log accumulation, large temporary files, or insufficient disk allocation."
		analysis.Impact = "Critical operations that require disk writes will fail, potentially causing data loss and service disruption."
		analysis.Confidence = 0.92

	default:
		analysis.ErrorSummary = "An error has occurred in the system"
		analysis.RootCause = "Based on the log output, there appears to be a system or application error that requires investigation."
		analysis.Impact = "Potential service degradation depending on the severity of the error."
		analysis.Confidence = 0.50
	}

	return analysis
}

func (ai *AIService) parseAnalysis(response string) models.Analysis {
	// Try to extract JSON from response
	start := strings.Index(response, "{")
	end := strings.LastIndex(response, "}")

	if start >= 0 && end > start {
		jsonStr := response[start : end+1]
		var analysis models.Analysis
		if err := json.Unmarshal([]byte(jsonStr), &analysis); err == nil {
			return analysis
		}
	}

	// Fallback
	return models.Analysis{
		ErrorSummary: "Error detected in system logs",
		RootCause:    "Unable to determine specific root cause from AI analysis",
		Impact:       "Requires manual investigation",
		Confidence:   0.4,
	}
}
