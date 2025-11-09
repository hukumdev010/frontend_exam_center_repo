"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Play, Square, Eye, Code2, FileText, RefreshCw, Copy, Check, Download } from "lucide-react";

interface CodeEditorProps {
    language: 'css' | 'html' | 'javascript' | 'python' | 'typescript' | 'java' | 'cpp';
    initialCode?: string;
    onCodeChange?: (code: string) => void;
    certificationSlug?: string;
}

const LANGUAGE_TEMPLATES = {
    css: `/* CSS Code Editor - Practice Your CSS Skills */

/* Reset and base styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 20px;
}

.container {
    background: white;
    padding: 40px;
    border-radius: 15px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    max-width: 800px;
    margin: 0 auto;
}

.title {
    color: #333;
    font-size: 2em;
    margin-bottom: 20px;
    text-align: center;
}

.button {
    background: #667eea;
    color: white;
    padding: 15px 30px;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 16px;
}

.button:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

/* Card component for layout practice */
.card {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 20px;
    margin: 10px 0;
}

.card h3 {
    color: #495057;
    margin-bottom: 10px;
}

/* Flexbox demo */
.flex-demo {
    display: flex;
    gap: 10px;
    margin: 20px 0;
    padding: 20px;
    background: #e3f2fd;
    border-radius: 8px;
}

.flex-item {
    background: #2196f3;
    color: white;
    padding: 15px;
    border-radius: 4px;
    text-align: center;
    flex: 1;
}

/* Grid demo */
.grid-demo {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin: 20px 0;
    padding: 20px;
    background: #f3e5f5;
    border-radius: 8px;
}

.grid-item {
    background: #9c27b0;
    color: white;
    padding: 20px;
    border-radius: 4px;
    text-align: center;
}

/* Form elements for styling practice */
.form-demo {
    margin: 20px 0;
    padding: 20px;
    background: #e8f5e8;
    border-radius: 8px;
}

.input, .select, .textarea {
    width: 100%;
    padding: 12px;
    margin: 8px 0;
    border: 2px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
}

.input:focus, .select:focus, .textarea:focus {
    outline: none;
    border-color: #4caf50;
}

.textarea {
    resize: vertical;
    min-height: 80px;
}

/* Utility classes for spacing */
.mt-4 { margin-top: 1rem; }
.space-y-4 > * + * { margin-top: 1rem; }`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML Playground</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to HTML Playground</h1>
        <p>Start writing your HTML code here!</p>
        <button onclick="alert('Hello, World!')">Click Me</button>
    </div>
</body>
</html>`,
    javascript: `// JavaScript Code Editor
console.log("Welcome to JavaScript Playground!");

// Sample function
function greetUser(name) {
    return \`Hello, \${name}! Welcome to the coding workspace.\`;
}

// Test the function
const result = greetUser("Developer");
console.log(result);

// Try some interactive code
document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    body.style.fontFamily = 'Arial, sans-serif';
    body.style.padding = '20px';
    body.style.background = 'linear-gradient(135deg, #74b9ff, #0984e3)';
    
    const container = document.createElement('div');
    container.innerHTML = \`
        <h1 style="color: white; text-align: center;">JavaScript Playground</h1>
        <p style="color: white; text-align: center;">Check the console for output!</p>
    \`;
    body.appendChild(container);
});`,
    python: `# Python Code Editor
print("Welcome to Python Playground!")

# Sample function
def greet_user(name):
    return f"Hello, {name}! Welcome to the coding workspace."

# Test the function
result = greet_user("Developer")
print(result)

# Sample data manipulation
numbers = [1, 2, 3, 4, 5]
squared = [x**2 for x in numbers]
print(f"Original numbers: {numbers}")
print(f"Squared numbers: {squared}")

# Simple calculation
def calculate_area(radius):
    import math
    return math.pi * radius ** 2

radius = 5
area = calculate_area(radius)
print(f"Area of circle with radius {radius}: {area:.2f}")`,
    typescript: `// TypeScript Code Editor
console.log("Welcome to TypeScript Playground!");

// Interface definition
interface User {
    name: string;
    age: number;
    email?: string;
}

// Sample function with types
function greetUser(user: User): string {
    return \`Hello, \${user.name}! You are \${user.age} years old.\`;
}

// Test with typed data
const developer: User = {
    name: "TypeScript Developer",
    age: 25,
    email: "developer@example.com"
};

const greeting = greetUser(developer);
console.log(greeting);

// Generic function example
function createArray<T>(items: T[]): T[] {
    return [...items];
}

const stringArray = createArray(["hello", "world"]);
const numberArray = createArray([1, 2, 3, 4, 5]);

console.log("String array:", stringArray);
console.log("Number array:", numberArray);`,
    java: `// Java Code Editor
public class JavaPlayground {
    public static void main(String[] args) {
        System.out.println("Welcome to Java Playground!");
        
        // Create an instance and test methods
        JavaPlayground playground = new JavaPlayground();
        String greeting = playground.greetUser("Developer");
        System.out.println(greeting);
        
        // Test calculations
        int[] numbers = {1, 2, 3, 4, 5};
        int sum = playground.calculateSum(numbers);
        System.out.println("Sum of numbers: " + sum);
    }
    
    public String greetUser(String name) {
        return "Hello, " + name + "! Welcome to the coding workspace.";
    }
    
    public int calculateSum(int[] numbers) {
        int sum = 0;
        for (int number : numbers) {
            sum += number;
        }
        return sum;
    }
}`,
    cpp: `// C++ Code Editor
#include <iostream>
#include <vector>
#include <string>

using namespace std;

class CppPlayground {
public:
    string greetUser(const string& name) {
        return "Hello, " + name + "! Welcome to the coding workspace.";
    }
    
    int calculateSum(const vector<int>& numbers) {
        int sum = 0;
        for (int number : numbers) {
            sum += number;
        }
        return sum;
    }
};

int main() {
    cout << "Welcome to C++ Playground!" << endl;
    
    CppPlayground playground;
    string greeting = playground.greetUser("Developer");
    cout << greeting << endl;
    
    vector<int> numbers = {1, 2, 3, 4, 5};
    int sum = playground.calculateSum(numbers);
    cout << "Sum of numbers: " << sum << endl;
    
    return 0;
}`,
};

export function CodeEditor({ language, initialCode, onCodeChange }: CodeEditorProps) {
    const [code, setCode] = useState(initialCode || LANGUAGE_TEMPLATES[language]);
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'output'>('editor');
    const [copied, setCopied] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (onCodeChange) {
            onCodeChange(code);
        }
    }, [code, onCodeChange]);

    const handleCodeChange = (value: string) => {
        setCode(value);
    };

    const runCode = async () => {
        setIsRunning(true);
        setActiveTab('output');

        try {
            if (language === 'css') {
                // For CSS, we'll create a live preview
                setOutput('CSS preview updated in the preview tab.');

            } else if (language === 'html') {
                // For HTML, we'll show it in the preview
                setOutput('HTML rendered in the preview tab.');

            } else if (language === 'javascript') {
                // For JavaScript, we'll simulate execution
                const logs: string[] = [];
                const originalLog = console.log;
                console.log = (...args) => {
                    logs.push(args.join(' '));
                    originalLog(...args);
                };

                try {
                    // Create a safe evaluation context
                    const func = new Function(code);
                    func();
                    setOutput(logs.length > 0 ? logs.join('\n') : 'Code executed successfully (no output)');
                } catch (error) {
                    setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
                } finally {
                    console.log = originalLog;
                }

            } else if (language === 'python') {
                // For Python, we'll need to call the backend
                setOutput('Python execution requires backend integration. Code saved locally.');

            } else {
                setOutput(`${language.toUpperCase()} execution requires backend integration. Code saved locally.`);
            }
        } catch (error) {
            setOutput(`Execution error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsRunning(false);
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy code:', error);
        }
    };

    const downloadCode = () => {
        const fileExtensions = {
            css: '.css',
            html: '.html',
            javascript: '.js',
            typescript: '.ts',
            python: '.py',
            java: '.java',
            cpp: '.cpp'
        };

        const filename = `code${fileExtensions[language]}`;
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const resetCode = () => {
        setCode(LANGUAGE_TEMPLATES[language]);
        setOutput('');
    };

    const getLanguageDisplayName = () => {
        const names = {
            css: 'CSS',
            html: 'HTML',
            javascript: 'JavaScript',
            typescript: 'TypeScript',
            python: 'Python',
            java: 'Java',
            cpp: 'C++'
        };
        return names[language] || language.toUpperCase();
    };

    const renderPreview = () => {
        if (language === 'css') {
            return (
                <div className="h-full bg-white overflow-auto">
                    <style dangerouslySetInnerHTML={{ __html: code }} />
                    <div className="p-4">
                        {/* CSS Preview HTML Structure */}
                        <div className="container">
                            <h1 className="title">CSS Preview</h1>
                            <p>Test your CSS styling here</p>
                            <button className="button">Sample Button</button>

                            {/* Additional test elements for CSS */}
                            <div className="mt-4 space-y-4">
                                <div className="card">
                                    <h3>Card Component</h3>
                                    <p>A sample card to test styling</p>
                                </div>

                                <div className="flex-demo">
                                    <div className="flex-item">Flex Item 1</div>
                                    <div className="flex-item">Flex Item 2</div>
                                    <div className="flex-item">Flex Item 3</div>
                                </div>

                                <div className="grid-demo">
                                    <div className="grid-item">Grid 1</div>
                                    <div className="grid-item">Grid 2</div>
                                    <div className="grid-item">Grid 3</div>
                                    <div className="grid-item">Grid 4</div>
                                </div>

                                <form className="form-demo">
                                    <input type="text" placeholder="Test input" className="input" />
                                    <select className="select">
                                        <option>Option 1</option>
                                        <option>Option 2</option>
                                    </select>
                                    <textarea placeholder="Test textarea" className="textarea"></textarea>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (language === 'html') {
            return (
                <iframe
                    srcDoc={code}
                    className="w-full h-full border-0"
                    title="HTML Preview"
                    sandbox="allow-scripts"
                />
            );
        } else {
            return (
                <div className="h-full bg-gray-50 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                        <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Preview not available for {getLanguageDisplayName()}</p>
                        <p className="text-sm">Use the Output tab to see execution results</p>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="h-full flex flex-col bg-white border-l border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">{getLanguageDisplayName()} Editor</h3>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                        className="h-8 px-3"
                        title="Copy code"
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadCode}
                        className="h-8 px-3"
                        title="Download code"
                    >
                        <Download className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={resetCode}
                        className="h-8 px-3"
                        title="Reset code"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('editor')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'editor'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Code2 className="w-4 h-4 inline mr-2" />
                    Editor
                </button>
                {(language === 'css' || language === 'html') && (
                    <button
                        onClick={() => setActiveTab('preview')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'preview'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Eye className="w-4 h-4 inline mr-2" />
                        Preview
                    </button>
                )}
                <button
                    onClick={() => setActiveTab('output')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'output'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <FileText className="w-4 h-4 inline mr-2" />
                    Output
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative">
                {activeTab === 'editor' && (
                    <div className="h-full flex flex-col">
                        <textarea
                            ref={textareaRef}
                            value={code}
                            onChange={(e) => handleCodeChange(e.target.value)}
                            className="flex-1 w-full p-4 font-mono text-sm resize-none border-0 focus:outline-none"
                            placeholder={`Write your ${getLanguageDisplayName()} code here...`}
                            spellCheck={false}
                            style={{
                                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                                lineHeight: '1.5',
                                tabSize: 2
                            }}
                        />
                        <div className="p-4 border-t border-gray-200 bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    Lines: {code.split('\n').length} | Characters: {code.length}
                                </div>
                                <Button
                                    onClick={runCode}
                                    disabled={isRunning}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    {isRunning ? (
                                        <>
                                            <Square className="w-4 h-4 mr-2" />
                                            Running...
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-4 h-4 mr-2" />
                                            Run Code
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'preview' && renderPreview()}

                {activeTab === 'output' && (
                    <div className="h-full p-4">
                        <div className="h-full bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-y-auto">
                            {output || 'No output yet. Run your code to see results here.'}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}