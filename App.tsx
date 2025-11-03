import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatView } from './components/ChatView';
import { useLocalStorage } from './hooks/useLocalStorage';
import { AIModel, ChatSession, Message } from './types';
import { v4 as uuidv4 } from 'uuid';
import { AI_MODELS } from './constants';
import { generateResponse } from './services/geminiService';

export default function App() {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'dark');
  const [sessions, setSessions] = useLocalStorage<ChatSession[]>('chat-sessions', []);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string>(AI_MODELS[0].id);
  const [compareModelIds, setCompareModelIds] = useState<[string, string]>([AI_MODELS[0].id, AI_MODELS[2].id]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const activeSession = useMemo(() => {
    return sessions.find(session => session.id === activeSessionId) || null;
  }, [sessions, activeSessionId]);

  const createNewSession = useCallback(() => {
    const newSession: ChatSession = {
      id: uuidv4(),
      title: 'New Chat',
      messages: [],
      modelId: isCompareMode ? 'compare' : selectedModelId,
      createdAt: new Date().toISOString(),
    };
    const updatedSessions = [...sessions, newSession];
    setSessions(updatedSessions);
    setActiveSessionId(newSession.id);
    setSidebarOpen(false);
  }, [isCompareMode, selectedModelId, sessions, setSessions]);
  
  useEffect(() => {
    if (sessions.length > 0 && !activeSessionId) {
      setActiveSessionId(sessions[sessions.length - 1].id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions, activeSessionId]);


  const updateSession = useCallback((sessionId: string, updates: Partial<ChatSession>) => {
    setSessions(prevSessions =>
      prevSessions.map(session =>
        session.id === sessionId ? { ...session, ...updates } : session
      )
    );
  }, [setSessions]);

  const handleSendMessage = async (prompt: string) => {
    if (!prompt.trim()) return;
    
    let currentSessionId = activeSessionId;
    let currentSession = activeSession;

    if (!currentSession) {
      const newSession: ChatSession = {
        id: uuidv4(),
        title: prompt.substring(0, 30),
        messages: [],
        modelId: isCompareMode ? 'compare' : selectedModelId,
        createdAt: new Date().toISOString(),
      };
      setSessions(prev => [...prev, newSession]);
      setActiveSessionId(newSession.id);
      currentSessionId = newSession.id;
      currentSession = newSession;
    }

    const userMessage: Message = { id: uuidv4(), role: 'user', content: prompt };
    
    const updatedMessages = [...currentSession.messages, userMessage];

    updateSession(currentSessionId, { messages: updatedMessages, ...(currentSession.messages.length === 0 && { title: prompt.substring(0, 30) }) });
    
    setIsLoading(true);

    try {
      if (isCompareMode) {
        const [model1, model2] = compareModelIds.map(id => AI_MODELS.find(m => m.id === id)!);
        const [response1, response2] = await Promise.all([
          generateResponse(prompt, model1.modelName),
          generateResponse(prompt, model2.modelName),
        ]);
        const aiMessage: Message = {
          id: uuidv4(),
          role: 'model',
          content: '',
          isComparison: true,
          comparisonResults: [
            { modelId: model1.id, content: response1 },
            { modelId: model2.id, content: response2 },
          ]
        };
        updateSession(currentSessionId, { messages: [...updatedMessages, aiMessage] });
      } else {
        const model = AI_MODELS.find(m => m.id === selectedModelId)!;
        const responseText = await generateResponse(prompt, model.modelName);
        const aiMessage: Message = { id: uuidv4(), role: 'model', content: responseText, modelId: selectedModelId };
        updateSession(currentSessionId, { messages: [...updatedMessages, aiMessage] });
      }
    } catch (error) {
      console.error('API Error:', error);
      const errorMessage: Message = { id: uuidv4(), role: 'model', content: 'Sorry, I encountered an error. Please try again.' };
      updateSession(currentSessionId, { messages: [...updatedMessages, errorMessage] });
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setSessions([]);
    setActiveSessionId(null);
  };
  
  return (
    <div className="flex h-screen w-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans overflow-hidden">
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        setActiveSessionId={setActiveSessionId}
        createNewSession={createNewSession}
        clearHistory={clearHistory}
        theme={theme}
        toggleTheme={toggleTheme}
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <main className="flex-1 flex flex-col h-full relative">
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden absolute top-4 left-4 z-20 p-2 rounded-md bg-secondary-light dark:bg-secondary-dark/50 backdrop-blur-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
        </button>
        <ChatView
          key={activeSessionId}
          session={activeSession}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          isCompareMode={isCompareMode}
          setIsCompareMode={setIsCompareMode}
          selectedModelId={selectedModelId}
          setSelectedModelId={setSelectedModelId}
          compareModelIds={compareModelIds}
          setCompareModelIds={setCompareModelIds}
        />
      </main>
    </div>
  );
}