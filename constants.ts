
import { AIModel } from './types';

export const AI_MODELS: AIModel[] = [
  {
    id: 'gemini',
    name: 'Gemini',
    modelName: 'gemini-2.5-flash',
    description: 'A powerful and versatile model for a wide range of tasks.',
  },
  {
    id: 'lovable',
    name: 'Lovable',
    modelName: 'gemini-2.5-flash', // Using Gemini with a creative persona
    description: 'A creative and friendly AI, great for brainstorming and casual conversation.',
  },
  {
    id: 'readdy',
    name: 'Readdy.ai',
    modelName: 'gemini-2.5-flash', // Using Gemini with a summarization persona
    description: 'An expert in summarizing text and extracting key information.',
  },
  {
    id: 'claude_sim',
    name: 'Claude (Sim)',
    modelName: 'gemini-2.5-pro', // Simulating a more powerful model
    description: 'A highly capable AI for complex reasoning, analysis, and coding.',
  },
];
