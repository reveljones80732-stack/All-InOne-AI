import React from 'react';
import { Message } from '../types';
import { AI_MODELS } from '../constants';
import { UserIcon, ModelIcon } from './icons';

interface ChatMessageProps {
  message: Message;
}

const ComparisonResult: React.FC<{ result: { modelId: string; content: string } }> = ({ result }) => {
  const model = AI_MODELS.find(m => m.id === result.modelId);
  return (
    <div className="flex-1 p-4 rounded-lg bg-secondary-light/50 dark:bg-secondary-dark/50 min-w-[200px]">
      <h3 className="font-bold mb-2 text-primary-light dark:text-primary-dark">{model?.name || 'Unknown AI'}</h3>
      <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-text-light dark:text-text-dark">
        {result.content}
      </div>
    </div>
  );
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const model = !isUser && message.modelId ? AI_MODELS.find(m => m.id === message.modelId) : null;

  return (
    <div className={`flex items-start gap-3 md:gap-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-dark flex items-center justify-center text-white shadow-glow-primary">
          <ModelIcon />
        </div>
      )}
      
      <div className={`max-w-2xl w-full ${isUser ? 'order-1' : 'order-2'}`}>
        {model && <p className="text-xs font-semibold text-text-muted-dark mb-1 ml-1">{model.name}</p>}
        {message.isComparison && message.comparisonResults ? (
          <div className="p-1 rounded-lg bg-ai-bubble-light dark:bg-ai-bubble-dark border border-border-light dark:border-border-dark">
            <div className="flex flex-col md:flex-row gap-1">
              <ComparisonResult result={message.comparisonResults[0]} />
              <ComparisonResult result={message.comparisonResults[1]} />
            </div>
          </div>
        ) : (
          <div
            className={`px-4 py-3 rounded-lg border ${
              isUser
                ? 'bg-user-bubble-light dark:bg-user-bubble-dark text-text-light dark:text-text-dark border-border-light dark:border-border-dark'
                : 'bg-ai-bubble-light dark:bg-ai-bubble-dark border-border-light dark:border-border-dark'
            }`}
          >
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-text-light dark:text-text-dark">
              {message.content}
            </div>
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-user-bubble-light dark:bg-user-bubble-dark flex items-center justify-center order-2 border border-border-light dark:border-border-dark">
          <UserIcon />
        </div>
      )}
    </div>
  );
};