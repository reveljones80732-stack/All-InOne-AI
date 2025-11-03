import React, { useState, useRef, useEffect } from 'react';
import { ChatSession } from '../types';
import { AI_MODELS } from '../constants';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { SendIcon, FusionHubIcon } from './icons';

interface ChatViewProps {
  session: ChatSession | null;
  isLoading: boolean;
  onSendMessage: (prompt: string) => void;
  isCompareMode: boolean;
  setIsCompareMode: (isCompare: boolean) => void;
  selectedModelId: string;
  setSelectedModelId: (id: string) => void;
  compareModelIds: [string, string];
  setCompareModelIds: (ids: [string, string]) => void;
}

const SuggestionCard: React.FC<{ title: string, description: string, onClick: () => void }> = ({ title, description, onClick }) => (
    <button onClick={onClick} className="p-4 text-left bg-secondary-light dark:bg-secondary-dark rounded-lg border border-border-light dark:border-border-dark hover:bg-secondary-light/50 dark:hover:bg-secondary-dark/50 transition-colors w-full">
        <h3 className="font-semibold text-text-light dark:text-text-dark">{title}</h3>
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark">{description}</p>
    </button>
);

const WelcomeScreen: React.FC<{ onPromptSelect: (prompt: string) => void }> = ({ onPromptSelect }) => {
    const suggestions = [
        { title: "Explain quantum computing", description: "in simple, everyday terms" },
        { title: "Write a short story", description: "about a robot who discovers music" },
        { title: "Plan a trip", description: "for a 7-day vacation in Japan" },
        { title: "Create a workout plan", description: "for building muscle at home" },
    ];

    return (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="max-w-2xl mx-auto">
                <FusionHubIcon size="large" />
                <h1 className="text-4xl font-bold text-text-light dark:text-text-dark mt-4 mb-2">AI Fusion Hub</h1>
                <p className="text-lg text-text-muted-light dark:text-text-muted-dark mb-12">How can I help you today?</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {suggestions.map(s => (
                        <SuggestionCard key={s.title} title={s.title} description={s.description} onClick={() => onPromptSelect(`${s.title} ${s.description}`)} />
                    ))}
                </div>
            </div>
        </div>
    );
};


const ModelSelector: React.FC<{
  label: string;
  selectedModelId: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
}> = ({ label, selectedModelId, onSelect, disabled }) => (
    <div className="flex items-center gap-2">
        <label className="text-xs text-text-muted-light dark:text-text-muted-dark hidden sm:inline">{label}</label>
        <select
            value={selectedModelId}
            onChange={(e) => onSelect(e.target.value)}
            disabled={disabled}
            className="px-2 py-1 text-sm rounded-md bg-secondary-light dark:bg-secondary-dark border border-border-light dark:border-border-dark focus:ring-2 focus:ring-primary-dark focus:outline-none transition w-full sm:w-auto"
        >
            {AI_MODELS.map(model => (
                <option key={model.id} value={model.id}>{model.name}</option>
            ))}
        </select>
    </div>
);

const CompareToggle: React.FC<{ checked: boolean, onChange: (checked: boolean) => void }> = ({ checked, onChange }) => (
    <div className="flex items-center space-x-2">
        <label htmlFor="compareMode" className="text-sm font-medium">Compare</label>
        <button role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className={`${checked ? 'bg-primary-dark' : 'bg-user-bubble-dark'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}>
            <span className={`${checked ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
        </button>
    </div>
);


export const ChatView: React.FC<ChatViewProps> = ({
  session,
  isLoading,
  onSendMessage,
  isCompareMode,
  setIsCompareMode,
  selectedModelId,
  setSelectedModelId,
  compareModelIds,
  setCompareModelIds,
}) => {
  const [prompt, setPrompt] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [session?.messages, isLoading]);
  
  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [prompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !prompt.trim()) return;
    onSendMessage(prompt);
    setPrompt('');
  };

  const handlePromptSelect = (selectedPrompt: string) => {
      setPrompt(selectedPrompt);
      textareaRef.current?.focus();
  }

  return (
    <div className="flex flex-col h-full w-full">
        <header className="flex items-center justify-between p-4 h-16 border-b border-border-light dark:border-border-dark shrink-0">
             <h2 className="text-lg font-semibold truncate pr-4">{session?.title || 'New Chat'}</h2>
             <div className="flex items-center gap-2 sm:gap-4">
                <CompareToggle checked={isCompareMode} onChange={setIsCompareMode} />
                {isCompareMode ? (
                    <>
                        <ModelSelector label="Model 1" selectedModelId={compareModelIds[0]} onSelect={(id) => setCompareModelIds([id, compareModelIds[1]])}/>
                        <ModelSelector label="Model 2" selectedModelId={compareModelIds[1]} onSelect={(id) => setCompareModelIds([compareModelIds[0], id])}/>
                    </>
                ) : (
                    <ModelSelector label="Model" selectedModelId={selectedModelId} onSelect={setSelectedModelId}/>
                )}
             </div>
        </header>

      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-4xl mx-auto">
            {session && session.messages.length > 0 ? (
            <div className="space-y-6">
                {session.messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && <TypingIndicator />}
                <div ref={messagesEndRef} />
            </div>
            ) : (
             <WelcomeScreen onPromptSelect={handlePromptSelect} />
            )}
        </div>
      </div>

      <div className="p-4 lg:p-6 border-t border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Type your message here..."
              className="w-full p-4 pr-14 rounded-xl bg-secondary-light dark:bg-secondary-dark border border-border-light dark:border-border-dark resize-none focus:ring-2 focus:ring-primary-dark focus:outline-none transition-all"
              rows={1}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-primary-light dark:bg-primary-dark text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity shadow-glow-primary"
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};