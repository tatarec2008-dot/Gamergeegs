
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getBSPExplanation = async (sentence: string, userSign: string, correctSign: string) => {
  try {
    const prompt = `
      Предложение: "${sentence}"
      Пользователь выбрал знак: "${userSign}"
      Правильный знак: "${correctSign}"
      
      Объясни кратко и доступно для школьника 11 класса, почему в этом бессоюзном сложном предложении (БСП) ставится именно "${correctSign}". 
      Используй правила русского языка. Ответ дай на русском языке, не более 3 предложений.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Не удалось получить объяснение. Попробуйте позже.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ошибка при получении объяснения от ИИ.";
  }
};
