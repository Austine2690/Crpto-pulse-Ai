
export interface AnalysisResult {
  symbol: string;
  sentimentScore: number; // 0-100
  signal: 'STRONG BUY' | 'BUY' | 'NEUTRAL' | 'SELL' | 'STRONG SELL';
  priceTarget?: string;
  reasoning: string;
  technicalIndicators: {
    rsi?: string;
    macd?: string;
    movingAverages?: string;
  };
  memeFactor?: string;
  sources: { title: string; uri: string }[];
  timestamp: number;
}

export interface ChartData {
  time: string;
  price: number;
  volume: number;
}
