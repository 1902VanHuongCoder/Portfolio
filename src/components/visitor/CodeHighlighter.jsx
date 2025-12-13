import { useState, useContext } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ThemeContext } from '../../contexts/ThemeContext';

const SUPPORTED_LANGUAGES = [
  'javascript',
  'typescript',
  'jsx',
  'tsx',
  'python',
  'java',
  'csharp',
  'cpp',
  'c',
  'php',
  'ruby',
  'go',
  'rust',
  'swift',
  'kotlin',
  'sql',
  'html',
  'css',
  'scss',
  'json',
  'markdown',
  'bash',
  'powershell',
  'yaml',
  'xml',
];

const CodeHighlighter = () => {
  const { theme } = useContext(ThemeContext);
  const darkMode = theme?.themeSlug === 'dark-mode' || theme?.themeSlug === 'christmas' || theme?.themeSlug === 'new-year';
  const [code, setCode] = useState('// Paste your code here\nfunction helloWorld() {\n  console.log("Hello, World!");\n}');
  const [language, setLanguage] = useState('javascript');
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleClear = () => {
    setCode('');
  };

  const handleSample = () => {
    const samples = {
      javascript: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`,
      python: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(10))`,
      java: `public class Fibonacci {
    public static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
    
    public static void main(String[] args) {
        System.out.println(fibonacci(10));
    }
}`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Hello World</title>
</head>
<body>
    <h1>Hello, World!</h1>
</body>
</html>`,
    };
    setCode(samples[language] || samples.javascript);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Code Syntax Highlighter
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Paste your code and see it beautifully highlighted
          </p>
        </div>

        {/* Controls */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 mb-6`}>
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <label className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Language:
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={`px-4 py-2 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Options */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showLineNumbers}
                  onChange={(e) => setShowLineNumbers(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Line Numbers
                </span>
              </label>

              {/* Action Buttons */}
              <button
                onClick={handleSample}
                className={`px-4 py-2 rounded-lg ${
                  darkMode
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white font-medium transition-colors`}
              >
                Sample Code
              </button>
              <button
                onClick={handleClear}
                className={`px-4 py-2 rounded-lg ${
                  darkMode
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-red-500 hover:bg-red-600'
                } text-white font-medium transition-colors`}
              >
                Clear
              </button>
              <button
                onClick={handleCopy}
                className={`px-4 py-2 rounded-lg ${
                  copied
                    ? darkMode
                      ? 'bg-green-600'
                      : 'bg-green-500'
                    : darkMode
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-200 hover:bg-gray-300'
                } ${
                  darkMode ? 'text-white' : 'text-gray-900'
                } font-medium transition-colors`}
              >
                {copied ? '✓ Copied!' : 'Copy Code'}
              </button>
            </div>
          </div>
        </div>

        {/* Code Input & Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Input Code
            </h2>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              className={`w-full h-[500px] p-4 rounded-lg border ${
                darkMode
                  ? 'bg-gray-900 border-gray-700 text-gray-100'
                  : 'bg-gray-50 border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm`}
              spellCheck={false}
            />
          </div>

          {/* Output */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Highlighted Output
            </h2>
            <div className="rounded-lg overflow-hidden border border-gray-700">
              <SyntaxHighlighter
                language={language}
                style={darkMode ? vscDarkPlus : vs}
                showLineNumbers={showLineNumbers}
                wrapLines={true}
                customStyle={{
                  margin: 0,
                  padding: '1rem',
                  fontSize: '0.875rem',
                  maxHeight: '500px',
                  minHeight: '500px',
                }}
              >
                {code}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>

        {/* Features Info */}
        <div className={`mt-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Features
          </h3>
          <ul className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">✓</span>
              <span>Supports 25+ programming languages</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">✓</span>
              <span>Real-time syntax highlighting</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">✓</span>
              <span>Light & dark theme support</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">✓</span>
              <span>Line numbers toggle</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">✓</span>
              <span>Copy to clipboard functionality</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">✓</span>
              <span>Sample code for each language</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CodeHighlighter;
