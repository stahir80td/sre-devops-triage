package services

import (
	"devops-triage/models"
	"encoding/json"
	"os"
	"strings"
)

type ParserService struct {
	patterns []ErrorPattern
}

type ErrorPattern struct {
	ID          string   `json:"id"`
	Keywords    []string `json:"keywords"`
	KeywordsAll []string `json:"keywords_all"`
	KeywordsAny []string `json:"keywords_any"`
	ErrorType   string   `json:"error_type"`
	Service     string   `json:"service"`
	Summary     string   `json:"summary"`
	RootCause   string   `json:"root_cause"`
	Impact      string   `json:"impact"`
	Confidence  float64  `json:"confidence"`
	CommandSet  string   `json:"command_set"`
}

type ErrorPatternFile struct {
	Patterns []ErrorPattern `json:"patterns"`
}

func NewParserService() *ParserService {
	patterns := loadErrorPatterns()
	return &ParserService{patterns: patterns}
}

func loadErrorPatterns() []ErrorPattern {
	file, err := os.ReadFile("patterns/error_patterns.json")
	if err != nil {
		// Return empty if file doesn't exist (will use basic parsing)
		return []ErrorPattern{}
	}

	var patternFile ErrorPatternFile
	if err := json.Unmarshal(file, &patternFile); err != nil {
		return []ErrorPattern{}
	}

	return patternFile.Patterns
}

func (ps *ParserService) ParseLog(log string) models.ParsedLog {
	logLower := strings.ToLower(log)

	// Try to match against loaded patterns
	for _, pattern := range ps.patterns {
		if ps.matchesPattern(logLower, pattern) {
			return models.ParsedLog{
				Service:   pattern.Service,
				ErrorType: pattern.ErrorType,
				Timestamp: ps.extractTimestamp(log),
				Host:      ps.extractHost(log),
				Port:      ps.extractPort(log),
			}
		}
	}

	// Fallback to basic detection
	return models.ParsedLog{
		Service:   ps.detectService(log),
		ErrorType: ps.detectErrorType(logLower),
		Timestamp: ps.extractTimestamp(log),
		Host:      ps.extractHost(log),
		Port:      ps.extractPort(log),
	}
}

func (ps *ParserService) matchesPattern(logLower string, pattern ErrorPattern) bool {
	// Check if ALL keywords are present
	for _, keyword := range pattern.Keywords {
		if !strings.Contains(logLower, strings.ToLower(keyword)) {
			return false
		}
	}

	// Check if ALL keywords_all are present (if specified)
	if len(pattern.KeywordsAll) > 0 {
		for _, keyword := range pattern.KeywordsAll {
			if !strings.Contains(logLower, strings.ToLower(keyword)) {
				return false
			}
		}
	}

	// Check if ANY keywords_any are present (if specified)
	if len(pattern.KeywordsAny) > 0 {
		found := false
		for _, keyword := range pattern.KeywordsAny {
			if strings.Contains(logLower, strings.ToLower(keyword)) {
				found = true
				break
			}
		}
		if !found {
			return false
		}
	}

	return true
}

func (ps *ParserService) detectService(log string) string {
	logLower := strings.ToLower(log)

	if strings.Contains(logLower, "nginx") {
		return "Nginx"
	} else if strings.Contains(logLower, "postgres") || strings.Contains(logLower, "postgresql") {
		return "PostgreSQL"
	} else if strings.Contains(logLower, "mysql") {
		return "MySQL"
	} else if strings.Contains(logLower, "redis") {
		return "Redis"
	} else if strings.Contains(logLower, "kafka") {
		return "Kafka"
	} else if strings.Contains(logLower, "elasticsearch") {
		return "Elasticsearch"
	} else if strings.Contains(logLower, "docker") {
		return "Docker"
	} else if strings.Contains(logLower, "kubernetes") || strings.Contains(logLower, "kubectl") || strings.Contains(logLower, "pod") {
		return "Kubernetes"
	} else if strings.Contains(logLower, "java") {
		return "Java"
	} else if strings.Contains(logLower, "npm") {
		return "NPM"
	}

	return "System"
}

func (ps *ParserService) detectErrorType(logLower string) string {
	if strings.Contains(logLower, "crashloopbackoff") {
		return "CrashLoopBackOff"
	} else if strings.Contains(logLower, "imagepullbackoff") {
		return "ImagePullBackOff"
	} else if strings.Contains(logLower, "oomkilled") || strings.Contains(logLower, "out of memory") {
		return "Out of Memory"
	} else if strings.Contains(logLower, "enospc") || strings.Contains(logLower, "no space left") {
		return "Disk Space Full"
	} else if strings.Contains(logLower, "connection refused") || strings.Contains(logLower, "econnrefused") {
		return "Connection Refused"
	} else if strings.Contains(logLower, "502") || strings.Contains(logLower, "bad gateway") {
		return "Bad Gateway"
	} else if strings.Contains(logLower, "timeout") || strings.Contains(logLower, "etimedout") {
		return "Timeout"
	}

	return "Unknown Error"
}

func (ps *ParserService) extractTimestamp(log string) string {
	// Simple regex-like extraction
	lines := strings.Split(log, "\n")
	for _, line := range lines {
		// Look for common timestamp patterns
		if strings.Contains(line, "2025") || strings.Contains(line, "2024") {
			fields := strings.Fields(line)
			for i, field := range fields {
				if strings.Contains(field, "2025") || strings.Contains(field, "2024") {
					if i+1 < len(fields) {
						return field + " " + fields[i+1]
					}
					return field
				}
			}
		}
	}
	return ""
}

func (ps *ParserService) extractHost(log string) string {
	// Extract IP addresses
	fields := strings.Fields(log)
	for _, field := range fields {
		if strings.Count(field, ".") == 3 && !strings.Contains(field, "/") {
			parts := strings.Split(field, ".")
			if len(parts) == 4 {
				return strings.TrimRight(field, ":,;")
			}
		}
	}
	return ""
}

func (ps *ParserService) extractPort(log string) string {
	// Extract port numbers
	if strings.Contains(log, ":") {
		fields := strings.Fields(log)
		for _, field := range fields {
			if strings.Contains(field, ":") {
				parts := strings.Split(field, ":")
				if len(parts) >= 2 {
					port := strings.TrimRight(parts[len(parts)-1], ",;)")
					if len(port) <= 5 && port != "" {
						return port
					}
				}
			}
		}
	}
	return ""
}

func (ps *ParserService) GetPatternByID(id string) *ErrorPattern {
	for _, pattern := range ps.patterns {
		if pattern.ID == id {
			return &pattern
		}
	}
	return nil
}

func (ps *ParserService) GetPatternForLog(log string) *ErrorPattern {
	logLower := strings.ToLower(log)

	for _, pattern := range ps.patterns {
		if ps.matchesPattern(logLower, pattern) {
			return &pattern
		}
	}
	return nil
}
