import { useState, useEffect } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

export default function CommandList({ commands }) {
  const [copied, setCopied] = useState(null);

  const copyCommand = (cmd, index) => {
    navigator.clipboard.writeText(cmd);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.key >= '1' && e.key <= '5') {
        const index = parseInt(e.key) - 1;
        if (commands[index]) {
          copyCommand(commands[index].command, index);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [commands]);

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <Terminal className="text-blue-500" size={24} />
        <h3 className="text-lg font-bold">TROUBLESHOOTING COMMANDS</h3>
      </div>

      <div className="space-y-3">
        {commands.map((cmd, index) => (
          <div
            key={index}
            className="border border-gray-200 dark:border-dark-border rounded-lg p-4 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                  {index + 1}. {cmd.description}
                </p>
                <code className="block bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm font-mono overflow-x-auto">
                  {cmd.command}
                </code>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  <strong>Expected:</strong> {cmd.expected}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => copyCommand(cmd.command, index)}
                  className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                  title="Copy command"
                >
                  {copied === index ? <Check size={18} /> : <Copy size={18} />}
                </button>
                <span className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Ctrl+{index + 1}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          💡 <strong>Tip:</strong> Use keyboard shortcuts (Ctrl+1, Ctrl+2, etc.) to quickly copy commands
        </p>
      </div>
    </div>
  );
}