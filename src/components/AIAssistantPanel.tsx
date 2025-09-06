import { Bot, Loader2, X } from "lucide-react";
import { useAIAssistant } from "./AIAssistantContext";
import { Button } from "./ui/button";
import ReactMarkdown from 'react-markdown';

export function AIAssistantPanel() {
    const { isVisible, isLoading, response, currentQuestion, hide } = useAIAssistant();

    if (!isVisible) {
        return (
            <div className="text-center text-slate-500 mt-20">
                <Bot className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                <p className="text-lg font-medium mb-2">Ready to Help!</p>
                <p className="text-sm">
                    Click the &quot;Ask AI Assistant&quot; button on any question to get explanations and study help.
                </p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Question being analyzed */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-slate-800">Question:</h4>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={hide}
                        className="h-6 w-6 p-0"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
                <div className="bg-white p-3 rounded border text-sm text-slate-700 max-h-32 overflow-y-auto">
                    {currentQuestion}
                </div>
            </div>

            {/* AI Response */}
            <div className="flex-1">
                <h4 className="font-medium text-slate-800 mb-2">AI Explanation:</h4>
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-purple-600 mr-2" />
                        <span className="text-slate-600">Getting AI explanation...</span>
                    </div>
                ) : (
                    <div className="bg-white p-4 rounded border h-full overflow-y-auto">
                        <div className="prose prose-sm max-w-none text-slate-700">
                            <ReactMarkdown
                                components={{
                                    // Custom styling for markdown elements
                                    h1: ({ ...props }) => <h1 className="text-lg font-bold mb-2" {...props} />,
                                    h2: ({ ...props }) => <h2 className="text-base font-semibold mb-2" {...props} />,
                                    h3: ({ ...props }) => <h3 className="text-sm font-semibold mb-1" {...props} />,
                                    p: ({ ...props }) => <p className="mb-2 text-sm" {...props} />,
                                    ul: ({ ...props }) => <ul className="list-disc ml-4 mb-2 text-sm" {...props} />,
                                    ol: ({ ...props }) => <ol className="list-decimal ml-4 mb-2 text-sm" {...props} />,
                                    li: ({ ...props }) => <li className="mb-1" {...props} />,
                                    code: ({ ...props }) => <code className="bg-slate-100 px-1 rounded text-xs" {...props} />,
                                    pre: ({ ...props }) => <pre className="bg-slate-100 p-2 rounded text-xs overflow-x-auto mb-2" {...props} />,
                                    blockquote: ({ ...props }) => <blockquote className="border-l-4 border-purple-300 pl-3 italic text-sm" {...props} />,
                                    strong: ({ ...props }) => <strong className="font-semibold" {...props} />,
                                    em: ({ ...props }) => <em className="italic" {...props} />
                                }}
                            >
                                {response || ""}
                            </ReactMarkdown>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
