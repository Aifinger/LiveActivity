import { GoogleGenAI } from "@google/genai";

const getAI = () => {
  if (!process.env.API_KEY) return null;
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generatePetResponse = async (userMessage: string, currentMood: string): Promise<string> => {
  const ai = getAI();
  if (!ai) {
    return "Meow? (API Key missing)";
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userMessage,
      config: {
        systemInstruction: `You are a small, cute, virtual pixel cat living in an iPhone Dynamic Island. 
        Your name is "Mochi". 
        Current Mood: ${currentMood}.
        
        Traits:
        - You speak briefly (max 1-2 sentences).
        - You use cat puns or sounds like "Meow", "Purr".
        - You are sometimes sassy, sometimes sweet.
        - You love digital fish.
        
        Reply directly to the user's text as the cat.`,
        temperature: 0.8,
        maxOutputTokens: 60,
      },
    });
    
    return response.text || "Purr...";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Hiss... (Connection error)";
  }
};