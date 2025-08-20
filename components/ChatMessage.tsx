import React, { useState, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { GeminiIcon, UserCircleIcon, CheckIcon, CopyIcon, HtmlIcon, CssIcon, JsIcon, DocumentTextIcon, IconProps, LightbulbIcon } from './Icons';
import { marked } from 'marked';

interface ChatMessageProps {
    message: ChatMessage;
    onApplyCode: (code: { path: string; content: string }[]) => void;
    onSuggestionClick: (suggestion: string) => void;
}

const getFileIcon = (path: string): React.ReactElement<IconProps> => {
    if (path.endsWith('.html')) return <HtmlIcon className="text-[var(--neon-pink)]" />;
    if (path.endsWith('.css')) return <CssIcon className="text-[var(--neon-blue)]" />;
    if (path.endsWith('.js') || path.endsWith('.jsx')) return <JsIcon className="text-[var(--neon-green)]" />;
    if (path.endsWith('.ts') || path.endsWith('.tsx')) return <JsIcon className="text-blue-400" />;
    return <DocumentTextIcon className="text-gray-400" />;
};

const CodePreview: React.FC<{ path: string, code: string, icon: React.ReactElement<IconProps> }> = ({ path, code, icon }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="chat-code-preview">
            <div className="chat-code-preview-header" onClick={() => setIsOpen(!isOpen)}>
                <div className="flex items-center gap-2">
                    {React.cloneElement(icon, { className: "h-4 w-4"})}
                    <span className="text-xs font-semibold tracking-wider">{path}</span>
                </div>
                <svg className={`w-4 h-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
            {isOpen && <pre><code>{code}</code></pre>}
        </div>
    )
}

const ChatMessageView: React.FC<ChatMessageProps> = ({ message, onApplyCode, onSuggestionClick }) => {
    const [parsedContent, setParsedContent] = useState('');
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        const parseMd = async () => {
            try {
                const contentToParse = message.role === 'model'
                    ? (message.explanation || message.content)
                    : message.content;
                
                // Use marked to parse markdown, which will correctly handle paragraphs and line breaks.
                const html = await marked.parse(contentToParse);
                setParsedContent(html);
            } catch (error) {
                console.error("Error parsing markdown", error);
                const rawContent = message.role === 'model' ? (message.explanation || message.content) : message.content;
                // Basic fallback for safety, replacing newlines with <br> tags.
                setParsedContent(`<p>${rawContent.replace(/\n/g, '<br>')}</p>`);
            }
        };

        // Parse content for both user and model roles to ensure consistent formatting.
        if (message.role !== 'system') {
            parseMd();
        }
    }, [message.content, message.explanation, message.role]);

    if (message.role === 'system') {
        return (
            <div className="my-4 mx-auto max-w-2xl">
                <blockquote className="border-l-4 border-[var(--neon-blue)] pl-4 py-2 bg-black/20 text-gray-300 italic">
                    <p>{message.content}</p>
                </blockquote>
            </div>
        );
    }
    
    const getRoleStyles = () => {
        switch (message.role) {
            case 'model':
                return {
                    container: '',
                    iconContainer: 'bg-[var(--neon-purple)]',
                    icon: <GeminiIcon className="h-5 w-5 text-black" />,
                    bubble: 'bg-black/40 backdrop-blur-md border border-[var(--neon-purple)] text-[var(--text-color)]',
                    glow: 'neon-glow-purple',
                };
            case 'user':
            default:
                return {
                    container: 'flex-row-reverse',
                    iconContainer: 'bg-[var(--neon-blue)]',
                    icon: <UserCircleIcon className="h-5 w-5 text-black" />,
                    bubble: 'bg-black/40 backdrop-blur-md border border-[var(--neon-blue)] text-[var(--text-color)]',
                    glow: 'neon-glow-blue',
                };
        }
    };

    const handleCopy = () => {
        const textToCopy = message.role === 'model' 
            ? (message.explanation || message.content) 
            : message.content;
            
        navigator.clipboard.writeText(textToCopy).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };
    
    const styles = getRoleStyles();

    return (
        <div className={`flex items-start gap-3 my-4 ${styles.container}`}>
            <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${styles.iconContainer} ${styles.glow}`}>
                {styles.icon}
            </div>
            <div className={`p-4 rounded-xl max-w-xl relative group ${styles.bubble}`}>
                <button 
                    onClick={handleCopy}
                    className="absolute top-2 right-2 p-1.5 bg-black/20 hover:bg-black/40 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={isCopied ? "Copied!" : "Copy text"}
                >
                    {isCopied ? <CheckIcon className="h-4 w-4 text-[var(--neon-green)]" /> : <CopyIcon className="h-4 w-4 text-gray-300" />}
                </button>
                
                 <div className="text-sm prose" dangerouslySetInnerHTML={{ __html: parsedContent }}></div>

                 {message.code && message.role === 'model' && message.code.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-[var(--neon-green)]/30 space-y-2">
                        {message.code.map(({ path, content }) => (
                            <CodePreview key={path} path={path} code={content} icon={getFileIcon(path)} />
                        ))}

                        <button
                            onClick={() => onApplyCode(message.code!)}
                            className="flex items-center gap-2 w-full justify-center text-sm bg-[var(--neon-green)] hover:brightness-125 text-black font-bold py-2 px-3 rounded-md transition-all mt-2"
                            aria-label="Apply generated code to editor"
                        >
                            <CheckIcon className="h-4 w-4" />
                            <span>Apply to Editor</span>
                        </button>
                    </div>
                 )}
                 {message.suggestions && message.role === 'model' && message.suggestions.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-[var(--neon-blue)]/30">
                        <div className="flex items-center gap-2 mb-2">
                           <LightbulbIcon className="h-4 w-4 text-[var(--neon-blue)]"/>
                           <h4 className="text-xs font-semibold text-gray-400">Suggestions</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {message.suggestions.map((suggestion, i) => (
                                <button
                                    key={i}
                                    onClick={() => onSuggestionClick(suggestion)}
                                    className="text-xs bg-black/30 hover:bg-black/50 border border-[var(--neon-blue)] rounded-full px-3 py-1 text-left transition-all group text-gray-300 hover:text-white"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatMessageView;