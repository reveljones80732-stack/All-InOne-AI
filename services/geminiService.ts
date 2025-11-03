
import { GoogleGenAI } from "@google/genai";
import { AI_MODELS } from "../constants";

let ai: GoogleGenAI;

const getAIInstance = () => {
  if (!ai) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export const generateResponse = async (prompt: string, modelName: string): Promise<string> => {
  try {
    const aiInstance = getAIInstance();
    const model = AI_MODELS.find(m => m.modelName === modelName);
    let systemInstruction = "You are a helpful AI assistant.";

    if (model?.id === 'lovable') {
      systemInstruction = "You are Lovable, a creative and friendly AI. Be enthusiastic and imaginative in your responses.";
    } else if (model?.id === 'readdy') {
      systemInstruction = "You are Readdy.ai, an expert summarizer. Your goal is to provide concise, accurate summaries and extract key information. When asked a general question, answer it but keep it brief and to the point.";
    }

    const response = await aiInstance.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction,
      }
    });
    
    return response.text;
  } catch (error) {
    console.error(`Error generating response with model ${modelName}:`, error);
    return "An error occurred while trying to generate a response. Please check the console for details.";
  }
};
