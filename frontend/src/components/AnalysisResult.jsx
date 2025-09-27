import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Globe } from 'lucide-react';
import CommandList from './CommandList';
import IterativeChat from './IterativeChat';
import WebSearchResults from './WebSearchResults';

export default function AnalysisResult({ data }) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const { parsed, analysis, commands } = data;

  const API_URL = import.meta.env.PROD
  ? 'https://devops-triage-api.onrender.com'   // prod demo backend
  : (import.meta.env.VITE_API_URL ?? 'http://localhost:8080'); // dev
  
  const handleWebSearch = async () => {
    setLoadingSearch(true);
    try {
      const response = await fetch(`${API_URL}/api/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: parsed.error_type,
          service: parsed.service,
        }),
      });

      const results = await response.json();
      setSearchResults(results);
      setShowSearch(true);
    } catch (error) {
      console.error('Search failed:', error);
      alert('Web search failed');
    } finally {
      setLoadingSearch(false);
    }
  };

  useEffect(() => {
    // Auto-search if confidence is low or error is unknown
    if (analysis.confidence < 0.6 || parsed.error_type === "Unknown Error") {
      handleWebSearch();
    }
  }, []);

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-600 dark:text-green-400';
    if (confidence >= 0.6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const exportReport = () => {
    const markdown = `# DevOps Triage Report

## Error Details
- **Service**: ${parsed.service}
- **Error Type**: ${parsed.error_type}
- **Timestamp**: ${parsed.timestamp || 'N/A'}

## Analysis
**Summary**: ${analysis.error_summary}

**Root Cause**: ${analysis.root_cause}

**Impact**: ${analysis.impact}

**Confidence**: ${(analysis.confidence * 100).toFixed(0)}%

## Recommended Commands
${commands.map((cmd, i) => `${i + 1}. **${cmd.description}**
   \`\`\`bash
   ${cmd.command}
   \`\`\`
   Expected: ${cmd.expected}`).join('\n\n')}
`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'triage-report.md';
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Error Detection */}
      <div className="card border-l-4 border-red-500">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-red-500 mt-1" size={24} />
          <div className="flex-1">
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">ERROR DETECTED</h2>
            <p className="text-lg font-medium">{parsed.error_type}</p>
            {parsed.service && <p className="text-gray-600 dark:text-gray-400 mt-1">Service: {parsed.service}</p>}
            {parsed.timestamp && <p className="text-gray-600 dark:text-gray-400">Time: {parsed.timestamp}</p>}
          </div>
        </div>
      </div>

      {/* Root Cause Analysis */}
      <div className="card">
        <div className="flex items-start gap-3">
          <div className="text-2xl">💡</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-3">ROOT CAUSE ANALYSIS</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Summary</p>
                <p className="text-gray-900 dark:text-gray-100">{analysis.error_summary}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Root Cause</p>
                <p className="text-gray-900 dark:text-gray-100">{analysis.root_cause}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Impact</p>
                <p className="text-gray-900 dark:text-gray-100">{analysis.impact}</p>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <CheckCircle size={18} className={getConfidenceColor(analysis.confidence)} />
                <p className={`font-medium ${getConfidenceColor(analysis.confidence)}`}>
                  Confidence: {(analysis.confidence * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Commands */}
      <CommandList commands={commands} />

      {/* Iterative Chat */}
      <IterativeChat />

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleWebSearch}
          disabled={loadingSearch}
          className="flex items-center gap-2 btn-primary disabled:opacity-50"
        >
          <Globe size={18} />
          {loadingSearch ? 'Searching...' : showSearch ? 'Search Again' : 'Find Solutions Online'}
        </button>
        <button onClick={exportReport} className="btn-secondary">
          Export Report
        </button>
      </div>

      {/* Web Search Results */}
      {showSearch && searchResults && <WebSearchResults results={searchResults} />}
    </div>
  );
}