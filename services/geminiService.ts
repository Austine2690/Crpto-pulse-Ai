
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzeCryptoPair = async (symbol: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `Analyze the cryptocurrency or meme coin pair: ${symbol}. 
  Focus on the current market status (last 24-48 hours), technical indicators (RSI, MACD, Volume), and social sentiment (especially if it is a meme coin like PEPE, DOGE, or SOL-based tokens).
  Provide a clear "Signal" (STRONG BUY, BUY, NEUTRAL, SELL, STRONG SELL).
  Include a sentiment score from 0 (very bearish) to 100 (very bullish).
  Identify price targets and potential risks.
  Use Google Search to get the latest real-time data.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          symbol: { type: Type.STRING },
          sentimentScore: { type: Type.NUMBER },
          signal: { 
            type: Type.STRING,
            description: "Must be one of: STRONG BUY, BUY, NEUTRAL, SELL, STRONG SELL"
          },
          priceTarget: { type: Type.STRING },
          reasoning: { type: Type.STRING },
          technicalIndicators: {
            type: Type.OBJECT,
            properties: {
              rsi: { type: Type.STRING },
              macd: { type: Type.STRING },
              movingAverages: { type: Type.STRING }
            }
          },
          memeFactor: { type: Type.STRING, description: "Analysis of hype/community for meme coins" }
        },
        required: ["symbol", "sentimentScore", "signal", "reasoning"]
      }
    }
  });

  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sources = groundingChunks
    .filter((chunk: any) => chunk.web)
    .map((chunk: any) => ({
      title: chunk.web.title || 'Source',
      uri: chunk.web.uri
    }));

  let data: any;
  try {
    data = JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Failed to parse Gemini JSON output", e);
    throw new Error("Invalid response format from AI");
  }

  return {
    ...data,
    sources,
    timestamp: Date.now()
  };
};
