import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
    return (
        <div className={`prose prose-slate max-w-none ${className}`}>
            <ReactMarkdown
                components={{
                    h1: ({ ...props }) => (
                        <h1 className="text-2xl font-bold mb-4 mt-6 text-slate-900 border-b border-slate-200 pb-2" {...props} />
                    ),
                    h2: ({ ...props }) => (
                        <h2 className="text-xl font-bold mb-3 mt-5 text-slate-900" {...props} />
                    ),
                    h3: ({ ...props }) => (
                        <h3 className="text-lg font-semibold mb-2 mt-4 text-slate-800" {...props} />
                    ),
                    h4: ({ ...props }) => (
                        <h4 className="text-base font-semibold mb-2 mt-3 text-slate-800" {...props} />
                    ),
                    p: ({ ...props }) => (
                        <p className="mb-4 text-slate-700 leading-relaxed" {...props} />
                    ),
                    ul: ({ ...props }) => (
                        <ul className="list-disc ml-6 mb-4 space-y-2 text-slate-700" {...props} />
                    ),
                    ol: ({ ...props }) => (
                        <ol className="list-decimal ml-6 mb-4 space-y-2 text-slate-700" {...props} />
                    ),
                    li: ({ ...props }) => (
                        <li className="text-slate-700 leading-relaxed" {...props} />
                    ),
                    blockquote: ({ ...props }) => (
                        <blockquote className="border-l-4 border-blue-500 bg-blue-50 pl-4 py-2 my-4 italic text-slate-700" {...props} />
                    ),
                    code: ({ className, children, ...props }) => {
                        const isInline = !className;
                        if (isInline) {
                            return (
                                <code className="bg-slate-100 px-2 py-1 rounded text-sm font-mono text-slate-800" {...props}>
                                    {children}
                                </code>
                            );
                        }
                        return (
                            <code className="block bg-slate-50 text-slate-800 p-4 rounded-lg text-sm font-mono overflow-x-auto border border-slate-200" {...props}>
                                {children}
                            </code>
                        );
                    },
                    pre: ({ ...props }) => (
                        <pre className="bg-slate-50 text-slate-800 p-4 rounded-lg text-sm overflow-x-auto mb-4 border border-slate-200" {...props} />
                    ),
                    strong: ({ ...props }) => (
                        <strong className="font-semibold text-slate-900" {...props} />
                    ),
                    em: ({ ...props }) => (
                        <em className="italic text-slate-700" {...props} />
                    ),
                    a: ({ ...props }) => (
                        <a className="text-blue-600 hover:text-blue-800 underline" {...props} />
                    ),
                    table: ({ ...props }) => (
                        <div className="overflow-x-auto mb-4">
                            <table className="min-w-full border border-slate-200" {...props} />
                        </div>
                    ),
                    thead: ({ ...props }) => (
                        <thead className="bg-slate-50" {...props} />
                    ),
                    th: ({ ...props }) => (
                        <th className="border border-slate-200 px-4 py-2 text-left font-semibold text-slate-900" {...props} />
                    ),
                    td: ({ ...props }) => (
                        <td className="border border-slate-200 px-4 py-2 text-slate-700" {...props} />
                    ),
                    hr: ({ ...props }) => (
                        <hr className="my-6 border-t border-slate-200" {...props} />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}