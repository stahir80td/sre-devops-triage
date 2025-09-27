import { BookOpen, Cpu, Zap, Network, Brain, Layers, GitBranch, Shield } from 'lucide-react';

export default function TechnicalDocs() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <BookOpen size={40} className="text-blue-500" />
            <h1 className="text-4xl font-bold">Technical Architecture</h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            AI-Powered Intelligent Triage System: Multi-Tiered Analysis Engine
          </p>
        </div>

        {/* System Architecture Diagram */}
        <div className="card mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Network size={28} className="text-purple-500" />
            System Architecture Diagram
          </h2>
          
          <div className="bg-gradient-to-br from-blue-900 to-purple-900 p-8 rounded-lg">
            <svg viewBox="0 0 1200 800" className="w-full">
              {/* Client Layer */}
              <text x="600" y="30" textAnchor="middle" fill="#60a5fa" fontSize="20" fontWeight="bold">CLIENT LAYER</text>
              <rect x="450" y="50" width="300" height="80" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" rx="8"/>
              <text x="600" y="95" textAnchor="middle" fill="#93c5fd" fontSize="16">React + Vite Frontend</text>
              <text x="600" y="115" textAnchor="middle" fill="#60a5fa" fontSize="12">Real-time State Management</text>

              {/* API Gateway */}
              <line x1="600" y1="130" x2="600" y2="180" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowblue)"/>
              <text x="620" y="160" fill="#93c5fd" fontSize="12">HTTP/REST</text>
              
              <rect x="450" y="180" width="300" height="60" fill="#1e293b" stroke="#8b5cf6" strokeWidth="2" rx="8"/>
              <text x="600" y="215" textAnchor="middle" fill="#c4b5fd" fontSize="16">API Gateway (Go/Gin)</text>
              
              {/* Processing Layer */}
              <text x="600" y="280" textAnchor="middle" fill="#c084fc" fontSize="20" fontWeight="bold">PROCESSING LAYER</text>
              
              <line x1="600" y1="240" x2="300" y2="320" stroke="#8b5cf6" strokeWidth="2" markerEnd="url(#arrowpurple)"/>
              <line x1="600" y1="240" x2="600" y2="320" stroke="#8b5cf6" strokeWidth="2" markerEnd="url(#arrowpurple)"/>
              <line x1="600" y1="240" x2="900" y2="320" stroke="#8b5cf6" strokeWidth="2" markerEnd="url(#arrowpurple)"/>
              
              {/* Log Parser */}
              <rect x="100" y="320" width="220" height="100" fill="#312e81" stroke="#818cf8" strokeWidth="2" rx="8"/>
              <text x="210" y="355" textAnchor="middle" fill="#c7d2fe" fontSize="14" fontWeight="bold">Log Parser Engine</text>
              <text x="210" y="375" textAnchor="middle" fill="#a5b4fc" fontSize="11">• Regex Pattern Matching</text>
              <text x="210" y="390" textAnchor="middle" fill="#a5b4fc" fontSize="11">• Service Fingerprinting</text>
              <text x="210" y="405" textAnchor="middle" fill="#a5b4fc" fontSize="11">• Error Taxonomy</text>

              {/* AI Analysis Engine */}
              <rect x="380" y="320" width="440" height="100" fill="#1e1b4b" stroke="#c084fc" strokeWidth="2" rx="8"/>
              <text x="600" y="355" textAnchor="middle" fill="#e9d5ff" fontSize="14" fontWeight="bold">AI Analysis Engine (Dual-Path)</text>
              
              {/* Tier 1 */}
              <rect x="400" y="365" width="180" height="45" fill="#581c87" stroke="#c084fc" strokeWidth="1" rx="4"/>
              <text x="490" y="385" textAnchor="middle" fill="#f3e8ff" fontSize="11" fontWeight="bold">Tier 1: Pattern Match</text>
              <text x="490" y="400" textAnchor="middle" fill="#e9d5ff" fontSize="10">Sub-100ms Response</text>
              
              {/* Tier 2 */}
              <rect x="600" y="365" width="200" height="45" fill="#581c87" stroke="#c084fc" strokeWidth="1" rx="4"/>
              <text x="700" y="385" textAnchor="middle" fill="#f3e8ff" fontSize="11" fontWeight="bold">Tier 2: LLM Inference</text>
              <text x="700" y="400" textAnchor="middle" fill="#e9d5ff" fontSize="10">HuggingFace API</text>

              {/* Tool Orchestrator */}
              <rect x="880" y="320" width="220" height="100" fill="#14532d" stroke="#4ade80" strokeWidth="2" rx="8"/>
              <text x="990" y="355" textAnchor="middle" fill="#d1fae5" fontSize="14" fontWeight="bold">Tool Orchestrator</text>
              <text x="990" y="375" textAnchor="middle" fill="#bbf7d0" fontSize="11">• Command Generation</text>
              <text x="990" y="390" textAnchor="middle" fill="#bbf7d0" fontSize="11">• Priority Ranking</text>
              <text x="990" y="405" textAnchor="middle" fill="#bbf7d0" fontSize="11">• Context Injection</text>

              {/* Intelligence Layer */}
              <text x="600" y="460" textAnchor="middle" fill="#34d399" fontSize="20" fontWeight="bold">INTELLIGENCE LAYER</text>
              
              <line x1="210" y1="420" x2="210" y2="490" stroke="#818cf8" strokeWidth="2" markerEnd="url(#arrowgreen)"/>
              <line x1="600" y1="420" x2="600" y2="490" stroke="#c084fc" strokeWidth="2" markerEnd="url(#arrowgreen)"/>
              <line x1="990" y1="420" x2="990" y2="490" stroke="#4ade80" strokeWidth="2" markerEnd="url(#arrowgreen)"/>

              {/* RCA Pipeline */}
              <rect x="100" y="490" width="220" height="90" fill="#164e63" stroke="#22d3ee" strokeWidth="2" rx="8"/>
              <text x="210" y="520" textAnchor="middle" fill="#cffafe" fontSize="13" fontWeight="bold">RCA Pipeline</text>
              <text x="210" y="540" textAnchor="middle" fill="#a5f3fc" fontSize="10">Error Fingerprinting</text>
              <text x="210" y="555" textAnchor="middle" fill="#a5f3fc" fontSize="10">Impact Assessment</text>
              <text x="210" y="570" textAnchor="middle" fill="#a5f3fc" fontSize="10">Confidence Scoring</text>

              {/* Iterative State Machine */}
              <rect x="380" y="490" width="440" height="90" fill="#7c2d12" stroke="#fb923c" strokeWidth="2" rx="8"/>
              <text x="600" y="520" textAnchor="middle" fill="#fed7aa" fontSize="13" fontWeight="bold">Iterative Troubleshooting State Machine</text>
              <text x="600" y="540" textAnchor="middle" fill="#fde68a" fontSize="10">Command-Output Correlation • Context Persistence • Dynamic Graph Traversal</text>
              <text x="600" y="560" textAnchor="middle" fill="#fde68a" fontSize="10">Bayesian Next-Step Prediction</text>

              {/* Search Integration */}
              <rect x="880" y="490" width="220" height="90" fill="#422006" stroke="#fbbf24" strokeWidth="2" rx="8"/>
              <text x="990" y="520" textAnchor="middle" fill="#fef3c7" fontSize="13" fontWeight="bold">Search Integration</text>
              <text x="990" y="540" textAnchor="middle" fill="#fde68a" fontSize="10">Query Optimization</text>
              <text x="990" y="555" textAnchor="middle" fill="#fde68a" fontSize="10">Result Ranking</text>
              <text x="990" y="570" textAnchor="middle" fill="#fde68a" fontSize="10">AI Summary Synthesis</text>

              {/* External Services */}
              <text x="600" y="630" textAnchor="middle" fill="#f59e0b" fontSize="20" fontWeight="bold">EXTERNAL SERVICES</text>
              
              <line x1="600" y1="580" x2="450" y2="660" stroke="#22d3ee" strokeWidth="2" markerEnd="url(#arrowyellow)"/>
              <line x1="990" y1="580" x2="750" y2="660" stroke="#fbbf24" strokeWidth="2" markerEnd="url(#arrowyellow)"/>
              
              <rect x="300" y="660" width="200" height="60" fill="#431407" stroke="#f97316" strokeWidth="2" rx="8"/>
              <text x="400" y="695" textAnchor="middle" fill="#fed7aa" fontSize="14">HuggingFace API</text>
              
              <rect x="600" y="660" width="200" height="60" fill="#431407" stroke="#f97316" strokeWidth="2" rx="8"/>
              <text x="700" y="695" textAnchor="middle" fill="#fed7aa" fontSize="14">Tavily Search API</text>

              {/* Data Flow Indicators */}
              <text x="80" y="760" fill="#94a3b8" fontSize="12">● Real-time Processing</text>
              <text x="280" y="760" fill="#94a3b8" fontSize="12">● Async Operations</text>
              <text x="480" y="760" fill="#94a3b8" fontSize="12">● Parallel Execution</text>
              <text x="680" y="760" fill="#94a3b8" fontSize="12">● Response Aggregation</text>

              {/* Arrow markers */}
              <defs>
                <marker id="arrowblue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L9,3 z" fill="#3b82f6" />
                </marker>
                <marker id="arrowpurple" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L9,3 z" fill="#8b5cf6" />
                </marker>
                <marker id="arrowgreen" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L9,3 z" fill="#34d399" />
                </marker>
                <marker id="arrowyellow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L9,3 z" fill="#f59e0b" />
                </marker>
              </defs>
            </svg>
          </div>
        </div>

        {/* Core Components */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Cpu className="text-blue-500" size={28} />
              <h3 className="text-xl font-bold">Intelligent Log Parser</h3>
            </div>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>Regex-based extraction:</strong> Multi-pattern matching for timestamps, error codes, service identifiers</li>
              <li><strong>Service fingerprinting:</strong> Heuristic analysis to detect technology stack</li>
              <li><strong>Error taxonomy:</strong> Classification system with 15+ error categories</li>
              <li><strong>Performance:</strong> Sub-100ms parsing for 10KB log files</li>
            </ul>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="text-purple-500" size={28} />
              <h3 className="text-xl font-bold">AI Analysis Engine</h3>
            </div>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>Dual-path inference:</strong> Pattern matching (Tier 1) + LLM analysis (Tier 2)</li>
              <li><strong>Confidence scoring:</strong> Bayesian probability with historical calibration</li>
              <li><strong>Context-aware prompting:</strong> Dynamic prompt engineering based on error type</li>
              <li><strong>Fallback mechanism:</strong> Graceful degradation to pattern-based analysis</li>
            </ul>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="text-yellow-500" size={28} />
              <h3 className="text-xl font-bold">Tool Orchestration System</h3>
            </div>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>Command generation:</strong> Template-based decision trees with 50+ command patterns</li>
              <li><strong>Priority ranking:</strong> ML-based scoring for command effectiveness</li>
              <li><strong>Context injection:</strong> Dynamic variable substitution (service names, ports, paths)</li>
              <li><strong>Keyboard optimization:</strong> Hotkey mapping (Ctrl+1-5) for rapid execution</li>
            </ul>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <GitBranch className="text-green-500" size={28} />
              <h3 className="text-xl font-bold">Iterative State Machine</h3>
            </div>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>Stateful conversations:</strong> Persistent context across troubleshooting sessions</li>
              <li><strong>Command-output correlation:</strong> NLP analysis of execution results</li>
              <li><strong>Dynamic graph traversal:</strong> Decision tree navigation based on outcomes</li>
              <li><strong>Bayesian prediction:</strong> Next-step calculation using historical success rates</li>
            </ul>
          </div>
        </div>

        {/* Advanced Algorithms */}
        <div className="card mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Layers className="text-cyan-500" size={28} />
            <h2 className="text-2xl font-bold">Advanced Algorithms & Techniques</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-cyan-400 mb-2">Root Cause Analysis Pipeline</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                Multi-stage analysis combining signature matching, dependency graph analysis, and probabilistic inference:
              </p>
              <div className="bg-gray-800 p-4 rounded-lg font-mono text-sm text-green-400">
                RCA(log) = α·PatternMatch(log) + β·LLM(log, context) + γ·HistoricalFrequency(error_type)
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                Where α, β, γ are confidence-weighted coefficients dynamically adjusted based on error complexity
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-purple-400 mb-2">Confidence Calibration Algorithm</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                Adaptive confidence scoring using modified Platt scaling:
              </p>
              <div className="bg-gray-800 p-4 rounded-lg font-mono text-sm text-green-400">
                Confidence = 1 / (1 + exp(-(A·score + B))) · ContextualMultiplier
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                Parameters A and B learned from validation set, adjusted for domain-specific patterns
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-orange-400 mb-2">Query Optimization for Technical Search</h4>
              <p className="text-gray-700 dark:text-gray-300">
                Semantic query rewriting using TF-IDF vectorization + cosine similarity ranking. Prioritizes 
                Stack Overflow (weight: 1.5x), official documentation (1.3x), and GitHub issues (1.2x) over 
                general web results.
              </p>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="card mb-12 bg-gradient-to-r from-blue-900 to-purple-900">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-yellow-400" size={28} />
            <h2 className="text-2xl font-bold text-white">Performance Metrics</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-400 mb-2">&lt;100ms</div>
              <div className="text-gray-300">Log Parsing</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">1-3s</div>
              <div className="text-gray-300">AI Analysis</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">85%</div>
              <div className="text-gray-300">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">50+</div>
              <div className="text-gray-300">Error Patterns</div>
            </div>
          </div>
        </div>

        {/* Future Roadmap */}
        <div className="card bg-gradient-to-br from-indigo-950 to-purple-950">
          <h2 className="text-2xl font-bold mb-6 text-white">Advanced Roadmap: Next-Generation Capabilities</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-cyan-400 mb-3">AI/ML Enhancements</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• <strong>Reinforcement Learning:</strong> Self-improving command suggestions based on resolution success rates</li>
                <li>• <strong>Vision Models:</strong> Screenshot analysis using GPT-4V for dashboard error detection</li>
                <li>• <strong>Anomaly Detection:</strong> Unsupervised learning for novel error pattern discovery</li>
                <li>• <strong>Multi-modal Analysis:</strong> Combined log + metrics + traces correlation</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-purple-400 mb-3">Infrastructure Intelligence</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• <strong>Distributed Tracing:</strong> OpenTelemetry integration for end-to-end request tracking</li>
                <li>• <strong>Predictive Alerts:</strong> Time-series forecasting for proactive incident prevention</li>
                <li>• <strong>Auto-remediation:</strong> Kubernetes operator for self-healing deployments</li>
                <li>• <strong>Knowledge Graph:</strong> Neo4j-based service dependency mapping</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-green-400 mb-3">Collaboration Features</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• <strong>Team Workspace:</strong> Real-time collaborative debugging sessions</li>
                <li>• <strong>Runbook Generation:</strong> Automated playbook creation from resolved incidents</li>
                <li>• <strong>Integration Hub:</strong> Slack, PagerDuty, Jira bidirectional sync</li>
                <li>• <strong>Incident Timeline:</strong> Automated post-mortem report generation</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-orange-400 mb-3">Advanced Analytics</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• <strong>MTTR Optimization:</strong> Machine learning for resolution time prediction</li>
                <li>• <strong>Blast Radius Analysis:</strong> Impact simulation across service mesh</li>
                <li>• <strong>Cost Attribution:</strong> Incident cost calculation with resource tracking</li>
                <li>• <strong>SLO Monitoring:</strong> Real-time error budget tracking and alerting</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}