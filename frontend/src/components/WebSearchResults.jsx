import { ExternalLink, Globe } from 'lucide-react';

export default function WebSearchResults({ results }) {
  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <Globe className="text-purple-500" size={24} />
        <h3 className="text-lg font-bold">WEB SEARCH RESULTS</h3>
      </div>

      {/* AI Summary */}
      {results.ai_summary && (
        <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
          <p className="font-medium text-purple-900 dark:text-purple-100 mb-2">AI Summary</p>
          <p className="text-purple-800 dark:text-purple-200">{results.ai_summary}</p>
        </div>
      )}

      {/* Results */}
      <div className="space-y-4">
        {results.results.map((result, index) => (
          <a
            key={index}
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 border border-gray-200 dark:border-dark-border rounded-lg hover:border-purple-500 dark:hover:border-purple-500 transition-colors group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h4 className="font-medium text-blue-600 dark:text-blue-400 group-hover:underline mb-1">
                  {result.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{result.snippet}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">{result.url}</p>
              </div>
              <ExternalLink size={18} className="text-gray-400 group-hover:text-purple-500" />
            </div>
          </a>
        ))}
      </div>

      {results.results.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          No search results found. Try checking official documentation.
        </p>
      )}
    </div>
  );
}