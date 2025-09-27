import { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';

export default function IterativeChat() {
  const [commandOutput, setCommandOutput] = useState('');
  const [commandRun, setCommandRun] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const API_URL = import.meta.env.PROD
  ? 'https://devops-triage-api.onrender.com'   // prod demo backend
  : (import.meta.env.VITE_API_URL ?? 'http://localhost:8080'); // dev
  
  const handleAnalyzeOutput = async () => {
    if (!commandOutput.trim() || !commandRun.trim()) {
      alert('Please enter both the command you ran and its output');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/iterate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          previous_context: history,
          command_run: commandRun,
          output: commandOutput,
        }),
      });

      const data = await res.json();
      setResponse(data);
      
      setHistory([...history, {
        command: commandRun,
        output: commandOutput,
        analysis: data.analysis,
      }]);

      setCommandOutput('');
      setCommandRun('');
    } catch (error) {
      console.error('Iteration failed:', error);
      alert('Failed to analyze output');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <MessageSquare className="text-green-500" size={24} />
        <h3 className="text-lg font-bold">NEXT STEPS</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Command You Ran</label>
          <input
            type="text"
            value={commandRun}
            onChange={(e) => setCommandRun(e.target.value)}
            placeholder="e.g., systemctl status postgresql"
            className="w-full p-3 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-gray-800 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Command Output</label>
          <textarea
            value={commandOutput}
            onChange={(e) => setCommandOutput(e.target.value)}
            placeholder="Paste the command output here..."
            className="w-full h-32 p-3 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-gray-800 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleAnalyzeOutput}
          disabled={loading}
          className="flex items-center gap-2 btn-primary disabled:opacity-50"
        >
          <Send size={18} />
          {loading ? 'Analyzing...' : 'Analyze Output'}
        </button>
      </div>

      {/* Response */}
      {response && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="font-medium text-green-800 dark:text-green-200 mb-3">{response.analysis}</p>
          
          {response.next_commands && response.next_commands.length > 0 && (
            <div className="space-y-2 mt-4">
              <p className="text-sm font-medium text-green-700 dark:text-green-300">Next Commands:</p>
              {response.next_commands.map((cmd, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-800 p-3 rounded">
                  <p className="text-sm font-medium mb-1">{cmd.description}</p>
                  <code className="text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded block">
                    {cmd.command}
                  </code>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3">Troubleshooting History</h4>
          <div className="space-y-2">
            {history.map((item, idx) => (
              <div key={idx} className="text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <p className="font-mono text-blue-600 dark:text-blue-400">{item.command}</p>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{item.analysis}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}