import React from 'react';
import { ModelIcon } from './icons';

export const TypingIndicator: React.FC = () => (
  <div className="flex items-start gap-3 md:gap-4">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-dark flex items-center justify-center text-white shadow-glow-primary">
      <ModelIcon />
    </div>
    <div className="px-4 py-3 rounded-lg bg-ai-bubble-light dark:bg-ai-bubble-dark border border-border-light dark:border-border-dark flex items-center space-x-1">
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
    </div>
  </div>
);