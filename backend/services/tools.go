package services

import (
	"devops-triage/models"
	"encoding/json"
	"os"
	"strings"
)

type ToolsService struct {
	commandLibrary CommandLibrary
	parserService  *ParserService
}

type CommandLibrary struct {
	CommandSets map[string][]CommandTemplate `json:"command_sets"`
}

type CommandTemplate struct {
	Description string `json:"description"`
	Command     string `json:"command"`
	Expected    string `json:"expected"`
	Priority    int    `json:"priority"`
}

func NewToolsService() *ToolsService {
	library := loadCommandLibrary()
	parser := NewParserService()
	return &ToolsService{
		commandLibrary: library,
		parserService:  parser,
	}
}

func loadCommandLibrary() CommandLibrary {
	file, err := os.ReadFile("patterns/command_library.json")
	if err != nil {
		return CommandLibrary{CommandSets: make(map[string][]CommandTemplate)}
	}

	var library CommandLibrary
	if err := json.Unmarshal(file, &library); err != nil {
		return CommandLibrary{CommandSets: make(map[string][]CommandTemplate)}
	}

	return library
}

func (ts *ToolsService) GetCommands(errorType string, service string) []models.Command {
	// First try to get pattern-based commands
	pattern := ts.parserService.GetPatternForLog(errorType + " " + service)
	if pattern != nil && pattern.CommandSet != "" {
		if commands, exists := ts.commandLibrary.CommandSets[pattern.CommandSet]; exists {
			return ts.convertToModelCommands(commands)
		}
	}

	// Fallback to keyword matching
	key := strings.ToLower(errorType)
	serviceLower := strings.ToLower(service)

	// Try direct command set lookup
	commandSetKey := ts.findCommandSet(key, serviceLower)
	if commandSetKey != "" {
		if commands, exists := ts.commandLibrary.CommandSets[commandSetKey]; exists {
			return ts.convertToModelCommands(commands)
		}
	}

	// Return general commands as last resort
	if general, exists := ts.commandLibrary.CommandSets["general"]; exists {
		return ts.convertToModelCommands(general)
	}

	return []models.Command{}
}

func (ts *ToolsService) findCommandSet(errorType string, service string) string {
	// Map error types to command sets
	if strings.Contains(errorType, "connection refused") {
		if strings.Contains(service, "nginx") {
			return "nginx_upstream_failed"
		} else if strings.Contains(service, "postgres") {
			return "postgres_connection"
		} else if strings.Contains(service, "redis") {
			return "redis_connection"
		}
	}

	if strings.Contains(errorType, "timeout") {
		if strings.Contains(service, "nginx") {
			return "nginx_timeout"
		}
		return "connection_timeout"
	}

	if strings.Contains(errorType, "crashloop") {
		return "k8s_crashloop"
	}

	if strings.Contains(errorType, "imagepull") {
		return "k8s_imagepull"
	}

	if strings.Contains(errorType, "pending") {
		return "k8s_pending"
	}

	if strings.Contains(errorType, "disk") || strings.Contains(errorType, "enospc") || strings.Contains(errorType, "no space") {
		return "disk_full"
	}

	if strings.Contains(errorType, "memory") || strings.Contains(errorType, "oom") {
		if strings.Contains(service, "java") {
			return "java_oom"
		}
		return "oom_killed"
	}

	if strings.Contains(errorType, "deadlock") {
		return "mysql_deadlock"
	}

	if strings.Contains(errorType, "ssl") || strings.Contains(errorType, "certificate") {
		return "ssl_expired"
	}

	if strings.Contains(errorType, "dns") {
		return "dns_failure"
	}

	if strings.Contains(errorType, "permission") {
		return "permission_denied"
	}

	if strings.Contains(errorType, "port") && strings.Contains(errorType, "use") {
		return "port_in_use"
	}

	if strings.Contains(service, "docker") && strings.Contains(errorType, "network") {
		return "docker_network"
	}

	if strings.Contains(service, "npm") {
		return "npm_network"
	}

	if strings.Contains(service, "elasticsearch") {
		return "elasticsearch_red"
	}

	if strings.Contains(service, "kafka") {
		return "kafka_lag"
	}

	return "general"
}

func (ts *ToolsService) convertToModelCommands(templates []CommandTemplate) []models.Command {
	commands := make([]models.Command, len(templates))
	for i, template := range templates {
		commands[i] = models.Command{
			Description: template.Description,
			Command:     template.Command,
			Expected:    template.Expected,
		}
	}
	return commands
}
