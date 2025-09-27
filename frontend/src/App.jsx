import { useState, useEffect } from 'react';
import { Moon, Sun, RefreshCw, FileText } from 'lucide-react';
import LogInput from './components/LogInput';
import AnalysisResult from './components/AnalysisResult';
import TechnicalDocs from './components/TechnicalDocs';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDocs, setShowDocs] = useState(false);

  useEffect(() => {
    // Set page title
    document.title = 'DevOps/SRE AI Triage Platform';
    
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleAnalyze = async (logData) => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logData),
      });

      const data = await response.json();
      setAnalysisResult(data);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setShowDocs(false);
  };

  if (showDocs) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors">
        <header className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🔧</div>
              <h1 className="text-xl font-bold">DevOps/SRE AI Triage</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowDocs(false)}
                className="flex items-center gap-2 btn-secondary"
              >
                <RefreshCw size={18} />
                Back to Triage
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </header>
        <TechnicalDocs />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🔧</div>
            <h1 className="text-xl font-bold">DevOps/SRE AI Triage</h1>
          </div>
          <div className="flex items-center gap-4">
            {analysisResult && (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 btn-secondary"
              >
                <RefreshCw size={18} />
                New Analysis
              </button>
            )}
            <button
              onClick={() => setShowDocs(true)}
              className="flex items-center gap-2 btn-secondary"
            >
              <FileText size={18} />
              Tech Docs
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!analysisResult ? (
          <LogInput onAnalyze={handleAnalyze} loading={loading} />
        ) : (
          <AnalysisResult data={analysisResult} />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm">
        DevOps/SRE AI Triage Platform • Built with Go + React + AI
      </footer>
    </div>
  );
}

export default App;