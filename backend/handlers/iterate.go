package handlers

import (
	"devops-triage/models"
	"devops-triage/services"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func IterateTroubleshooting(c *gin.Context) {
	var req models.IterateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Analyze the output in context of the command and original issue
	analysis := analyzeCommandOutput(req.CommandRun, req.Output)
	commands := getNextCommands(req.CommandRun, req.Output, analysis)

	response := models.IterateResponse{
		Analysis:     analysis,
		NextCommands: commands,
	}

	c.JSON(http.StatusOK, response)
}

func analyzeCommandOutput(command string, output string) string {
	outputLower := strings.ToLower(output)
	commandLower := strings.ToLower(command)

	// Java OOM specific
	if strings.Contains(outputLower, "outofmemoryerror") || strings.Contains(outputLower, "heap space") {
		return "Java application ran out of heap memory. The JVM is trying to allocate more memory than available in the heap (-Xmx setting). This needs immediate attention - either increase heap size or investigate for memory leaks."
	}

	// Generic error/exception detection
	if strings.Contains(outputLower, "exception") || strings.Contains(outputLower, "error:") {
		return "The output shows an exception/error. This indicates the issue is actively occurring. Check the stack trace for the root cause, affected code files, and line numbers where the error originates."
	}

	// PostgreSQL service checks
	if strings.Contains(commandLower, "systemctl status") && strings.Contains(commandLower, "postgres") {
		if strings.Contains(outputLower, "inactive") || strings.Contains(outputLower, "dead") || strings.Contains(outputLower, "failed") {
			return "PostgreSQL service is not running. The service needs to be started before applications can connect to the database."
		}
		if strings.Contains(outputLower, "active") && strings.Contains(outputLower, "running") {
			return "PostgreSQL service is running normally. The connection issue may be due to network configuration, firewall rules, or authentication settings in pg_hba.conf. Check bind address and port configuration."
		}
	}

	// Any service status check
	if strings.Contains(commandLower, "systemctl status") {
		if strings.Contains(outputLower, "inactive") || strings.Contains(outputLower, "dead") {
			return "Service is not running. Start the service and check logs for any startup errors."
		}
		if strings.Contains(outputLower, "failed") {
			return "Service failed to start. Check the service logs using journalctl for detailed error messages."
		}
		if strings.Contains(outputLower, "active") {
			return "Service is running. If issues persist, check application logs and configuration files."
		}
	}

	// Disk space analysis
	if strings.Contains(commandLower, "df -h") || strings.Contains(commandLower, "df -i") {
		if strings.Contains(output, "100%") {
			return "One or more filesystems are at 100% capacity. Immediate cleanup required - identify and remove large files, clean old logs, or expand the filesystem."
		}
		if strings.Contains(output, "9") && (strings.Contains(output, "%") || strings.Contains(output, "Use%")) {
			return "Disk usage is critically high (>90%). Proactive cleanup recommended to prevent service disruption. Check /var/log for large log files."
		}
	}

	// Kubernetes pod checks
	if strings.Contains(commandLower, "kubectl describe pod") {
		if strings.Contains(outputLower, "crashloopbackoff") {
			return "Pod is still crashing repeatedly. The container exits immediately after starting. Check the previous logs (--previous flag) for the actual error that causes the crash."
		}
		if strings.Contains(outputLower, "imagepullbackoff") || strings.Contains(outputLower, "errimagepull") {
			return "Unable to pull container image from registry. Verify: 1) image name and tag are correct, 2) registry is accessible, 3) imagePullSecrets are configured if using private registry."
		}
		if strings.Contains(outputLower, "oomkilled") {
			return "Pod was killed due to out of memory. Increase memory limits in pod spec or optimize application memory usage."
		}
	}

	// Kubernetes logs check
	if strings.Contains(commandLower, "kubectl logs") {
		if len(output) < 10 {
			return "No logs available or container hasn't started yet. If pod is in CrashLoopBackOff, try 'kubectl logs <pod> --previous' to see logs from the crashed container."
		}
		return "Log output received. Review error messages, stack traces, and timestamps to identify when and why the issue occurred. Look for ERROR, FATAL, or PANIC level messages."
	}

	// Memory checks
	if strings.Contains(commandLower, "free -h") || strings.Contains(commandLower, "free -m") {
		if strings.Contains(outputLower, "available") && (strings.Contains(output, " 0 ") || strings.Contains(output, "0b")) {
			return "System has critically low available memory. Consider: 1) restarting memory-intensive services, 2) increasing system memory, 3) checking for memory leaks with 'ps aux --sort=-%mem'."
		}
		return "Memory statistics retrieved. Check 'available' column - if low, identify top memory consumers with 'ps aux --sort=-%mem | head'."
	}

	// Network/Port checks
	if strings.Contains(commandLower, "netstat") || strings.Contains(commandLower, "ss") || strings.Contains(commandLower, "lsof") {
		if strings.Contains(outputLower, "listen") {
			return "Port is in LISTEN state, meaning the service is accepting connections. If clients still can't connect, check: 1) firewall rules, 2) client network connectivity, 3) authentication/authorization settings."
		}
		if len(strings.TrimSpace(output)) < 5 {
			return "Port is NOT listening. The service either isn't running, is configured on a different port, or failed to bind to the port due to permissions or port already in use."
		}
	}

	// Connection tests (curl, wget, telnet)
	if strings.Contains(commandLower, "curl") || strings.Contains(commandLower, "wget") || strings.Contains(commandLower, "telnet") {
		if strings.Contains(outputLower, "connection refused") || strings.Contains(outputLower, "failed") {
			return "Connection test failed. The target service is not reachable. Verify: 1) service is running, 2) firewall allows traffic, 3) correct IP/port/URL."
		}
		if strings.Contains(output, "200") || strings.Contains(output, "{") || strings.Contains(outputLower, "connected") {
			return "Connection test successful! The service is responding. If end-users still report issues, check: load balancer config, DNS settings, or proxy/CDN configuration."
		}
		if strings.Contains(outputLower, "timeout") {
			return "Connection timed out. Service may be overloaded, network latency is high, or firewall is dropping packets. Check service health and network path."
		}
	}

	// Log file checks
	if strings.Contains(commandLower, "tail") || strings.Contains(commandLower, "cat") || strings.Contains(commandLower, "grep") {
		if len(output) < 10 {
			return "Command returned minimal or no output. The log file may be empty, rotated, or in a different location. Verify the log path and check for rotated logs (.1, .gz files)."
		}
		return "Log output retrieved. Analyze timestamps, error messages, and patterns. Look for: ERROR/FATAL messages, stack traces, repeated errors, or correlation with the time the issue started."
	}

	// DNS checks
	if strings.Contains(commandLower, "nslookup") || strings.Contains(commandLower, "dig") || strings.Contains(commandLower, "host") {
		if strings.Contains(outputLower, "nxdomain") || strings.Contains(outputLower, "not found") {
			return "DNS resolution failed - domain doesn't exist or DNS server cannot resolve it. Check: 1) domain spelling, 2) DNS server configuration in /etc/resolv.conf, 3) domain registration status."
		}
		if strings.Contains(outputLower, "timed out") || strings.Contains(outputLower, "no servers") {
			return "DNS query timed out. DNS server is unreachable or not responding. Check network connectivity to DNS servers and /etc/resolv.conf configuration."
		}
		return "DNS resolution output received. Verify the returned IP address is correct and matches expected values."
	}

	// Generic successful execution
	if len(output) > 10 {
		return "Command executed successfully. Review the output above for relevant error messages, status indicators, configuration values, or resource metrics that explain the issue."
	}

	return "Command completed. Analyze the output for clues about the root cause. If output is unclear, try more specific diagnostic commands or check related logs."
}

func getNextCommands(previousCommand string, output string, analysis string) []models.Command {
	outputLower := strings.ToLower(output)
	commandLower := strings.ToLower(previousCommand)

	// OOM Error - specific next steps
	if strings.Contains(outputLower, "outofmemoryerror") || strings.Contains(outputLower, "heap space") {
		return []models.Command{
			{
				Description: "Check current JVM heap settings",
				Command:     "ps aux | grep java | grep -o 'Xmx[^ ]*'",
				Expected:    "Current max heap size (e.g., -Xmx512m)",
			},
			{
				Description: "Check heap dump if available",
				Command:     "ls -lh /tmp/*.hprof 2>/dev/null || echo 'No heap dump found'",
				Expected:    "Heap dump files for analysis",
			},
			{
				Description: "Increase heap size (example for systemd service)",
				Command:     "# Edit service file and add: Environment=\"JAVA_OPTS=-Xmx2g -Xms1g\"",
				Expected:    "Service configuration updated",
			},
		}
	}

	// PostgreSQL not running
	if strings.Contains(commandLower, "systemctl status") && strings.Contains(outputLower, "inactive") {
		return []models.Command{
			{
				Description: "Start PostgreSQL service",
				Command:     "sudo systemctl start postgresql",
				Expected:    "Service started successfully",
			},
			{
				Description: "Check PostgreSQL startup logs",
				Command:     "sudo journalctl -u postgresql -n 50",
				Expected:    "Recent PostgreSQL startup messages",
			},
			{
				Description: "Enable PostgreSQL on boot",
				Command:     "sudo systemctl enable postgresql",
				Expected:    "Service enabled",
			},
		}
	}

	// PostgreSQL running but connection issues
	if strings.Contains(commandLower, "systemctl status postgres") && strings.Contains(outputLower, "active") {
		return []models.Command{
			{
				Description: "Check PostgreSQL is listening on correct address",
				Command:     "sudo netstat -plnt | grep postgres",
				Expected:    "Should show listening on 0.0.0.0:5432 or specific IP",
			},
			{
				Description: "Check PostgreSQL authentication config",
				Command:     "sudo cat /etc/postgresql/*/main/pg_hba.conf | grep -v '^#'",
				Expected:    "Authentication rules for connections",
			},
			{
				Description: "Test local PostgreSQL connection",
				Command:     "psql -h localhost -U postgres -c 'SELECT version();'",
				Expected:    "PostgreSQL version or connection error details",
			},
		}
	}

	// Disk space issues
	if strings.Contains(commandLower, "df") && strings.Contains(output, "100%") {
		return []models.Command{
			{
				Description: "Find largest directories",
				Command:     "sudo du -h --max-depth=1 / 2>/dev/null | sort -h | tail -10",
				Expected:    "Top 10 largest directories",
			},
			{
				Description: "Clean old journal logs",
				Command:     "sudo journalctl --vacuum-time=3d",
				Expected:    "Deleted logs older than 3 days",
			},
			{
				Description: "Find large files",
				Command:     "sudo find / -type f -size +100M 2>/dev/null | head -20",
				Expected:    "Large files consuming space",
			},
		}
	}

	// Kubernetes pod issues
	if strings.Contains(commandLower, "kubectl") && strings.Contains(outputLower, "crashloop") {
		return []models.Command{
			{
				Description: "Get previous pod logs",
				Command:     "kubectl logs <pod-name> --previous",
				Expected:    "Logs from the crashed container",
			},
			{
				Description: "Describe pod for events",
				Command:     "kubectl describe pod <pod-name>",
				Expected:    "Events showing why container crashed",
			},
		}
	}

	// Default next steps - if nothing else matched
	toolsService := services.NewToolsService()
	return toolsService.GetCommands("general", "system")
}
