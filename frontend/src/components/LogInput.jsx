import { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';

const SAMPLE_ISSUES = {
  postgres: {
    name: 'PostgreSQL Connection Refused',
    log: '2025-09-27 10:32:15 ERROR [postgres] FATAL: connection refused at 127.0.0.1:5432\nError: connect ECONNREFUSED 127.0.0.1:5432\n  at TCPConnectWrap.afterConnect',
    service: 'postgresql',
  },
  kubernetes: {
    name: 'Kubernetes Pod CrashLoopBackOff',
    log: 'kubectl get pods\nNAME                      READY   STATUS             RESTARTS   AGE\napi-deployment-abc123     0/1     CrashLoopBackOff   5          3m',
    service: 'kubernetes',
  },
  disk: {
    name: 'Disk Space Full (ENOSPC)',
    log: 'ERROR: ENOSPC: no space left on device, write\nnpm ERR! Error: ENOSPC: no space left on device\n/var/log/app.log: cannot write: No space left on device',
    service: 'system',
  },
  docker: {
    name: 'Docker Build Failed',
    log: 'ERROR [stage-1 3/5] RUN npm install\nnpm ERR! code ENOTFOUND\nnpm ERR! network request to https://registry.npmjs.org failed\nnpm ERR! network This is a problem related to network connectivity',
    service: 'docker',
  },
};

export default function LogInput({ onAnalyze, loading }) {
  const [log, setLog] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [environment, setEnvironment] = useState('production');
  const [showSamples, setShowSamples] = useState(false);

  const handleSubmit = () => {
    if (!log.trim()) {
      alert('Please paste your logs or error message');
      return;
    }

    onAnalyze({
      log,
      service_type: serviceType,
      environment,
    });
  };

  const loadSample = (key) => {
    const sample = SAMPLE_ISSUES[key];
    setLog(sample.log);
    setServiceType(sample.service);
    setShowSamples(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2">📋 Paste Your Logs or Error Message</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Intelligent log analysis & troubleshooting powered by AI
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <textarea
              value={log}
              onChange={(e) => setLog(e.target.value)}
              placeholder="Paste your error logs here..."
              className="w-full h-64 p-4 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Service Type (optional)</label>
              <input
                type="text"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                placeholder="e.g., postgresql, kubernetes"
                className="w-full p-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Environment</label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="production">Production</option>
                <option value="staging">Staging</option>
                <option value="development">Development</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Search size={18} />
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowSamples(!showSamples)}
                className="flex items-center gap-2 btn-secondary"
              >
                Try Sample Issue
                <ChevronDown size={18} />
              </button>

              {showSamples && (
                <div className="absolute top-full mt-2 w-64 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg shadow-lg z-10">
                  {Object.entries(SAMPLE_ISSUES).map(([key, issue]) => (
                    <button
                      key={key}
                      onClick={() => loadSample(key)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg transition-colors"
                    >
                      {issue.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              ⚡ <strong>Sample Issues:</strong> PostgreSQL Connection Refused • Kubernetes Pod CrashLoopBackOff • Disk Space Full • Docker Build Failed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}