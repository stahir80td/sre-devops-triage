package models

type AnalyzeRequest struct {
	Log         string `json:"log"`
	ServiceType string `json:"service_type,omitempty"`
	Environment string `json:"environment,omitempty"`
}

type ParsedLog struct {
	Service   string `json:"service"`
	ErrorType string `json:"error_type"`
	Timestamp string `json:"timestamp"`
	Host      string `json:"host,omitempty"`
	Port      string `json:"port,omitempty"`
}

type Analysis struct {
	ErrorSummary string  `json:"error_summary"`
	RootCause    string  `json:"root_cause"`
	Impact       string  `json:"impact"`
	Confidence   float64 `json:"confidence"`
}

type Command struct {
	Description string `json:"description"`
	Command     string `json:"command"`
	Expected    string `json:"expected"`
}

type AnalyzeResponse struct {
	Parsed   ParsedLog `json:"parsed"`
	Analysis Analysis  `json:"analysis"`
	Commands []Command `json:"commands"`
}

type IterateRequest struct {
	PreviousContext []map[string]interface{} `json:"previous_context"`
	CommandRun      string                   `json:"command_run"`
	Output          string                   `json:"output"`
}

type IterateResponse struct {
	Analysis     string    `json:"analysis"`
	NextCommands []Command `json:"next_commands"`
}

type SearchRequest struct {
	Error   string `json:"error"`
	Service string `json:"service"`
}

type SearchResult struct {
	Title   string `json:"title"`
	URL     string `json:"url"`
	Snippet string `json:"snippet"`
}

type SearchResponse struct {
	Results   []SearchResult `json:"results"`
	AISummary string         `json:"ai_summary"`
}
