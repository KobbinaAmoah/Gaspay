import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, FuelSavingTip } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export async function getFuelSavingTips(transactions: Transaction[]): Promise<FuelSavingTip[]> {
  const transactionSummary = transactions.slice(0, 5).map(t => `GH₵${t.amount.toFixed(2)}`).join(', ');
  const prompt = `
    Based on these recent gas purchases in Ghana: ${transactionSummary}, provide 3 practical and distinct fuel-saving tips for a commuter.
    Be creative and insightful, considering the context of driving in Ghana. For example, mention tire pressure, driving habits, or route planning to avoid traffic.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              tip: {
                type: Type.STRING,
                description: 'A short, actionable title for the tip.',
              },
              explanation: {
                type: Type.STRING,
                description: 'A brief explanation of why the tip works and how to implement it.',
              },
            },
            required: ['tip', 'explanation'],
          },
        },
      },
    });

    const jsonString = response.text.trim();
    const tips = JSON.parse(jsonString);
    
    if (Array.isArray(tips)) {
      return tips as FuelSavingTip[];
    }
    return [];

  } catch (error) {
    console.error("Error fetching fuel saving tips from Gemini:", error);
    // Return a default set of tips on error
    return [
      { tip: "Check Tire Pressure", explanation: "Properly inflated tires can improve gas mileage by up to 3%. Check them monthly." },
      { tip: "Avoid Aggressive Driving", explanation: "Rapid acceleration and braking can lower gas mileage by 15-30% at highway speeds." },
      { tip: "Reduce Idle Time", explanation: "An idling car gets 0 miles per gallon. Turn off your engine if you're waiting for more than a minute." }
    ];
  }
}