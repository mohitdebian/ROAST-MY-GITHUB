
import React, { useState } from 'react';
import RoastInput from './components/RoastInput';
import RoastResult from './components/RoastResult';
import { fetchGithubUser, fetchGithubRepos, fetchGithubActivity, calculateLanguageStats } from './services/github';
import { generateRoast } from './services/gemini';
import { GithubUser, AnalysisResult, ActivityStats, LanguageStats, RoastHistoryItem } from './types';
import { Terminal, Github, Flame, AlertTriangle } from 'lucide-react';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<GithubUser | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [activityData, setActivityData] = useState<ActivityStats | null>(null);
  const [languageData, setLanguageData] = useState<LanguageStats | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [historyUpdateCounter, setHistoryUpdateCounter] = useState(0);

  const handleRoast = async (username: string) => {
    setIsLoading(true);
    setError(null);
    setUserData(null);
    setAnalysis(null);
    setActivityData(null);
    setLanguageData(null);

    try {
      setLoadingStep('EXPOSING YOUR TRASH...');
      const user = await fetchGithubUser(username);
      
      setLoadingStep(`LAUGHING AT ${user.public_repos} USELESS REPOS...`);
      const repos = await fetchGithubRepos(username);
      
      setLoadingStep('JUDGING YOUR SAD LIFE...');
      const activity = await fetchGithubActivity(username);
      const languages = calculateLanguageStats(repos);
      
      setLoadingStep('PREPARING TO HURT YOU...');
      const roastResult = await generateRoast(user, repos, activity, languages);
      
      setUserData(user);
      setAnalysis(roastResult);
      setActivityData(activity);
      setLanguageData(languages);

      // Save to history
      const historyItem: RoastHistoryItem = {
        username: user.login,
        avatar_url: user.avatar_url,
        score: roastResult.score,
        timestamp: Date.now()
      };
      
      const existingHistory = JSON.parse(localStorage.getItem('gitroast_history') || '[]');
      // Remove duplicates and keep last 10
      const newHistory = [historyItem, ...existingHistory.filter((h: RoastHistoryItem) => h.username !== user.login)].slice(0, 10);
      localStorage.setItem('gitroast_history', JSON.stringify(newHistory));
      setHistoryUpdateCounter(prev => prev + 1);

    } catch (err: any) {
      setError(err.message || "Failed. Just like your career.");
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 font-mono selection:bg-fire-900 selection:text-white flex flex-col relative overflow-x-hidden">
      
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-fire-900/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-white/5 blur-[120px] rounded-full pointer-events-none opacity-20" />
      </div>

      {/* Navbar */}
      <nav className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-fire-500/10 p-2 rounded-lg">
                <Terminal className="text-fire-500" size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">Git<span className="text-fire-500">Roast</span></span>
            </div>
            <div className="flex items-center gap-4">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors">
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 relative z-10">
        
        <div className="w-full max-w-5xl z-10 flex flex-col items-center">
          
          {!userData && !isLoading && (
            <div className="text-center mb-16 animate-slide-up">
              <div className="inline-flex items-center justify-center p-4 rounded-full bg-white/5 mb-6 ring-1 ring-white/10 shadow-2xl shadow-fire-900/20">
                <Flame size={48} className="text-fire-500" />
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-white">
                Roast My <span className="text-transparent bg-clip-text bg-gradient-to-r from-fire-500 to-orange-400">GitHub</span>
              </h1>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                Prepare to cry. Our AI is <span className="text-fire-500 font-bold">abusive</span>, <span className="text-fire-500 font-bold">hateful</span>, and hates your code.
              </p>
            </div>
          )}

          <RoastInput 
            onRoast={handleRoast} 
            isLoading={isLoading} 
            historyUpdated={historyUpdateCounter}
          />

          {/* Loading State */}
          {isLoading && (
             <div className="mt-20 flex flex-col items-center justify-center text-center animate-slide-up">
                <div className="relative w-24 h-24 mb-8">
                  <div className="absolute inset-0 border-t-2 border-fire-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-2 border-t-2 border-orange-400 rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Terminal className="text-fire-600/50 animate-pulse" size={32} />
                  </div>
                </div>
                <p className="text-fire-500 font-mono text-sm tracking-widest uppercase animate-pulse">{loadingStep}</p>
             </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mt-12 bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl flex items-center gap-3 animate-slide-up">
              <AlertTriangle size={24} />
              <p>{error}</p>
            </div>
          )}

          {/* Results */}
          {userData && analysis && activityData && languageData && (
            <RoastResult 
              user={userData} 
              analysis={analysis} 
              activity={activityData} 
              languages={languageData} 
            />
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-auto bg-black/20">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>Powered by Gemini 2.5 & Hate.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
