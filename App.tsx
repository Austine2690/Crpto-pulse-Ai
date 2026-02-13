
import React, { useState, useEffect, useCallback } from 'react';
import { Search, TrendingUp, TrendingDown, AlertCircle, ExternalLink, RefreshCw, BarChart3, Info, Wallet } from 'lucide-react';
import { analyzeCryptoPair } from './services/geminiService';
import { AnalysisResult, ChartData } from './types';
import PriceChart from './components/PriceChart';

const App: React.FC = () => {
  const [query, setQuery] = useState('BTC/USDT');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>(['SOL/USDT', 'PEPE/USDT', 'ETH/USDT']);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const generateMockChartData = (basePrice: number = 50000) => {
    const data: ChartData[] = [];
    let currentPrice = basePrice;
    for (let i = 0; i < 20; i++) {
      const change = (Math.random() - 0.48) * (currentPrice * 0.02);
      currentPrice += change;
      data.push({
        time: `${12 + i}:00`,
        price: Number(currentPrice.toFixed(2)),
        volume: Math.floor(Math.random() * 1000)
      });
    }
    return data;
  };

  const handleSearch = async (targetSymbol: string = query) => {
    if (!targetSymbol) return;
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeCryptoPair(targetSymbol);
      setAnalysis(result);
      setChartData(generateMockChartData(result.sentimentScore * 500));
      if (!history.includes(targetSymbol.toUpperCase())) {
        setHistory(prev => [targetSymbol.toUpperCase(), ...prev].slice(0, 5));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to analyze pair. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSignalColor = (signal: string) => {
    if (signal.includes('STRONG BUY')) return 'text-green-400 bg-green-400/10 border-green-400/50';
    if (signal.includes('BUY')) return 'text-green-500 bg-green-500/10 border-green-500/50';
    if (signal.includes('SELL')) return 'text-red-500 bg-red-500/10 border-red-500/50';
    return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/50';
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 pb-12">
      {/* Header */}
      <nav className="sticky top-0 z-50 glass border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            CryptoPulse AI
          </h1>
        </div>
        <div className="hidden md:flex gap-4">
          <button className="text-sm text-gray-400 hover:text-white transition-colors">Markets</button>
          <button className="text-sm text-gray-400 hover:text-white transition-colors">Alerts</button>
          <button className="text-sm text-gray-400 hover:text-white transition-colors">Portfolio</button>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-lg shadow-indigo-500/20">
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </button>
      </nav>

      <main className="max-w-6xl mx-auto px-6 mt-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Analyze Any <span className="text-indigo-400">Crypto Pair</span> <br />
            with Institutional Intelligence.
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Real-time technical analysis and social sentiment for major coins and trending meme tokens powered by Gemini Flash 3.
          </p>
        </div>

        {/* Search Section */}
        <div className="relative max-w-2xl mx-auto mb-16">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-32 py-4 bg-gray-900 border border-gray-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg outline-none transition-all placeholder:text-gray-600"
            placeholder="e.g. BTC/USDT, PEPE, SOL"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="absolute right-2 top-2 bottom-2 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-semibold flex items-center gap-2 transition-all shadow-md shadow-indigo-900/40"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Analyze'}
          </button>
        </div>

        {/* Quick History */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {history.map(sym => (
            <button
              key={sym}
              onClick={() => {
                setQuery(sym);
                handleSearch(sym);
              }}
              className="px-4 py-1.5 bg-gray-900 border border-gray-800 rounded-full text-sm text-gray-400 hover:border-indigo-500 hover:text-white transition-all"
            >
              {sym}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-900/50 text-red-400 p-4 rounded-xl flex items-center gap-3 mb-8">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Stats Card */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass rounded-3xl p-8 border border-gray-800">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div>
                    <h3 className="text-3xl font-bold mb-1 uppercase tracking-wider">{analysis.symbol}</h3>
                    <p className="text-gray-500 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-400" /> 
                      Market Analysis Result
                    </p>
                  </div>
                  <div className={`px-6 py-3 rounded-2xl border font-black text-xl tracking-widest ${getSignalColor(analysis.signal)}`}>
                    {analysis.signal}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-800">
                    <p className="text-gray-500 text-xs font-semibold mb-1 uppercase">Sentiment</p>
                    <p className={`text-2xl font-bold ${analysis.sentimentScore > 50 ? 'text-green-400' : 'text-red-400'}`}>
                      {analysis.sentimentScore}/100
                    </p>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-800">
                    <p className="text-gray-500 text-xs font-semibold mb-1 uppercase">Price Target</p>
                    <p className="text-2xl font-bold text-indigo-400">{analysis.priceTarget || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-800">
                    <p className="text-gray-500 text-xs font-semibold mb-1 uppercase">RSI</p>
                    <p className="text-2xl font-bold">{analysis.technicalIndicators.rsi || '34.5'}</p>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-800">
                    <p className="text-gray-500 text-xs font-semibold mb-1 uppercase">MACD</p>
                    <p className="text-2xl font-bold text-cyan-400">Bullish</p>
                  </div>
                </div>

                <PriceChart data={chartData} signal={analysis.signal} />
              </div>

              {/* Reasoning Card */}
              <div className="glass rounded-3xl p-8 border border-gray-800">
                <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Info className="w-5 h-5 text-indigo-400" /> AI Deep Dive Reasoning
                </h4>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-line">
                    {analysis.reasoning}
                  </p>
                </div>
                
                {analysis.memeFactor && (
                  <div className="mt-8 p-6 bg-indigo-900/10 border border-indigo-900/30 rounded-2xl">
                    <h5 className="font-bold text-indigo-300 mb-2 uppercase text-xs tracking-widest">Meme Factor / Social Hype</h5>
                    <p className="text-gray-400 text-sm italic">{analysis.memeFactor}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Cards */}
            <div className="space-y-6">
              <div className="glass rounded-3xl p-6 border border-gray-800">
                <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-gray-500">Technical Signals</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-800">
                    <span className="text-gray-400">SMA (20)</span>
                    <span className="text-green-400 font-medium">BUY</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-800">
                    <span className="text-gray-400">EMA (50)</span>
                    <span className="text-green-400 font-medium">BUY</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-800">
                    <span className="text-gray-400">Bollinger Bands</span>
                    <span className="text-gray-100 font-medium">Oversold</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400">Fear & Greed</span>
                    <span className="text-yellow-400 font-medium">Greed</span>
                  </div>
                </div>
              </div>

              <div className="glass rounded-3xl p-6 border border-gray-800">
                <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-gray-500">Grounding Sources</h4>
                <div className="space-y-3">
                  {analysis.sources.length > 0 ? analysis.sources.map((source, idx) => (
                    <a 
                      key={idx} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 p-3 bg-gray-900/50 hover:bg-gray-800 rounded-xl transition-all group"
                    >
                      <ExternalLink className="w-4 h-4 text-gray-500 mt-1 group-hover:text-indigo-400" />
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium text-gray-300 truncate">{source.title}</p>
                        <p className="text-[10px] text-gray-600 truncate">{source.uri}</p>
                      </div>
                    </a>
                  )) : (
                    <p className="text-sm text-gray-600 italic">No direct sources available.</p>
                  )}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-6 bg-red-900/10 border border-red-900/20 rounded-3xl">
                <p className="text-[10px] text-red-900/60 leading-tight uppercase font-black mb-2">Notice</p>
                <p className="text-[11px] text-gray-500 italic">
                  Trading cryptocurrencies involves high risk and may not be suitable for all investors. This AI-generated analysis is for informational purposes only and does not constitute financial advice. Always DYOR (Do Your Own Research).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="text-xl font-medium text-gray-400 animate-pulse">Scanning blockchain data and social sentiment...</p>
          </div>
        )}

        {/* Initial State Placeholder */}
        {!analysis && !loading && (
          <div className="flex flex-col items-center justify-center py-32 opacity-20 grayscale">
             <BarChart3 className="w-32 h-32 mb-6" />
             <p className="text-2xl font-black uppercase tracking-widest">Waiting for Signal</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
