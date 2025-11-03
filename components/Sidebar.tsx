import React from 'react';
import { ChatSession } from '../types';
import { ThemeToggle } from './ThemeToggle';
import { NewChatIcon, TrashIcon, CloseIcon, FusionHubIcon } from './icons';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  setActiveSessionId: (id: string) => void;
  createNewSession: () => void;
  clearHistory: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  setActiveSessionId,
  createNewSession,
  clearHistory,
  theme,
  toggleTheme,
  isOpen,
  setIsOpen
}) => {
  return (
    <>
      <div className={`fixed lg:static inset-y-0 left-0 z-30 w-72 bg-secondary-light dark:bg-secondary-dark transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col border-r border-border-light dark:border-border-dark`}>
        <div className="flex items-center justify-between p-4 h-16 border-b border-border-light dark:border-border-dark">
          <div className="flex items-center gap-2">
            <FusionHubIcon />
            <h1 className="text-lg font-bold text-text-light dark:text-text-dark">AI Fusion Hub</h1>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden p-1">
            <CloseIcon />
          </button>
        </div>

        <div className="p-2">
          <button onClick={createNewSession} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary-light dark:bg-primary-dark text-white hover:opacity-90 transition-opacity shadow-glow-primary">
            <NewChatIcon />
            New Chat
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {sessions.slice().reverse().map((session) => (
            <a
              key={session.id}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveSessionId(session.id);
                setIsOpen(false);
              }}
              className={`block px-3 py-2 rounded-md text-sm truncate transition-colors ${
                activeSessionId === session.id
                  ? 'bg-user-bubble-light dark:bg-user-bubble-dark text-text-light dark:text-text-dark font-semibold'
                  : 'text-text-muted-light dark:text-text-muted-dark hover:bg-secondary-light/50 dark:hover:bg-user-bubble-dark hover:text-text-light dark:hover:text-text-dark'
              }`}
            >
              {session.title}
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-border-light dark:border-border-dark space-y-2">
           <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
           <button onClick={clearHistory} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-text-muted-light dark:text-text-muted-dark hover:bg-red-500/10 hover:text-red-500 transition-colors">
            <TrashIcon />
            Clear History
          </button>
        </div>
      </div>
      {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/60 z-20 lg:hidden backdrop-blur-sm"></div>}
    </>
  );
};