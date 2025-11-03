export interface AIModel {
  id: string;
  name: string;
  modelName: string;
  description: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  modelId?: string; // For single AI responses
  isComparison?: boolean;
  comparisonResults?: { modelId: string; content: string }[];
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  modelId: string; // 'compare' or one of AIModel['id']
  createdAt: string;
}