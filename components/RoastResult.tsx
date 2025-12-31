
import React, { useEffect, useState } from 'react';
import { GithubUser, AnalysisResult, ActivityStats, LanguageStats } from '../types';
import { Flame, GitFork, MapPin, Link as LinkIcon, Users, Calendar, Code, Terminal, Eye, Github, Share2, GitPullRequest, GitCommit, FileCode } from 'lucide-react';

interface RoastResultProps {
  user: GithubUser;
  analysis: AnalysisResult;
  activity: ActivityStats;
  languages: LanguageStats;
}

const RoastResult: React.FC<RoastResultProps> = ({ user, analysis, activity, languages }) => {
  const [displayedScore, setDisplayedScore] = useState(0);

  useEffect(() => {
    let startTime: number;
    const duration = 2000; // 2 seconds animation
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Ease out quart
      const ease = 1 - Math.pow(1 - progress, 4);
      
      setDisplayedScore(Math.floor(analysis.score * ease));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [analysis.score]);
  
  const getScoreColor = (score: number) => {
    if (score < 30) return 'text-gray-500';
    if (score < 70) return 'text-orange-600';
    return 'text-red-600';
  };
  
  const getScoreGradient = (score: number) => {
    if (score < 30) return 'from-gray-700 to-black';
    if (score < 70) return 'from-orange-600 to-red-900';
    return 'from-red-600 to-black';
  };

  const getScoreLabel = (score: number) => {
    if (score < 30) return "IRRELEVANT";
    if (score < 60) return "DISAPPOINTMENT";
    if (score < 85) return "FAILURE";
    return "ABSOLUTE GARBAGE";
  };

  const radius = 86; 
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayedScore / 100) * circumference;

  const shareText = encodeURIComponent(
    `GitRoast destroyed me. 💀\n\nMy GitHub (@${user.login}) is rated ${analysis.score}% GARBAGE: ${getScoreLabel(analysis.score)}.\n\nLabels: ${analysis.titles.join(', ')}\n\n#GitRoast`
  );
  const shareUrl = `https://twitter.com/intent/tweet?text=${shareText}`;

  // Top languages sorted by count
  const topLanguages = Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <div className="w-full max-w-6xl mx-auto mt-12 animate-slide-up relative z-10 px-4 pb-20">
      
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-fire-600/10 blur-[100px] rounded-full pointer-events-none"></div>

      {/* Main Glass Panel */}
      <div className="relative bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/5">
        
        {/* Terminal Header Bar */}
        <div className="h-10 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2 select-none">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50 hover:bg-red-500 transition-colors"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/50 hover:bg-yellow-500 transition-colors"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/50 hover:bg-green-500 transition-colors"></div>
          </div>
          <div className="ml-auto flex items-center gap-2 text-[10px] font-mono text-white/30 uppercase tracking-widest">
            <Terminal size={10} />
            <span>Target: {user.login} // Status: DESTROYED</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_350px] divide-y lg:divide-y-0 lg:divide-x divide-white/10">
          
          {/* LEFT COLUMN: Profile & Roast */}
          <div className="p-6 md:p-8 relative overflow-hidden">
             {/* Subtle Grid Pattern Overlay */}
             <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>
             
             {/* User Header */}
             <div className="flex flex-col md:flex-row gap-6 items-start mb-8 relative z-10">
                <div className="relative group shrink-0">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden border-2 border-white/10 shadow-lg group-hover:border-fire-500/50 transition-colors bg-black">
                    <img src={user.avatar_url} alt={user.login} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-3 -right-3 bg-gray-900 text-gray-400 text-[10px] font-mono px-2 py-1 rounded border border-gray-700 shadow-xl">
                    ID::{user.id}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h2 className="text-3xl font-black text-white tracking-tight leading-tight mb-2 truncate">
                    {user.name || user.login}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm font-mono text-gray-400 mb-4">
                    <a href={user.html_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
                      <Github size={14} /> @{user.login} <LinkIcon size={12} className="opacity-50" />
                    </a>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {analysis.titles.map((title, idx) => (
                      <span key={idx} className="px-3 py-1 rounded bg-white/5 border border-white/10 text-xs font-bold font-mono text-fire-500 uppercase tracking-wide shadow-sm">
                        {title}
                      </span>
                    ))}
                  </div>
                </div>
             </div>

             {/* The Roast */}
             <div className="relative bg-black/40 rounded-xl border border-white/5 p-6 shadow-inner group">
               <div className="absolute top-4 right-4 text-fire-600/10 group-hover:text-fire-600/20 transition-colors duration-500">
                 <Flame size={64} />
               </div>
               
               <div className="font-mono text-sm md:text-base text-gray-300 leading-relaxed space-y-4 relative z-10 font-medium">
                 {analysis.roast.split('\n').map((line, i) => {
                    if (line.startsWith('#')) return <h4 key={i} className="text-white font-bold text-lg mt-6 border-b border-white/10 pb-2 uppercase">{line.replace(/#/g, '')}</h4>;
                    if (line.startsWith('-')) return <li key={i} className="ml-4 pl-2 border-l-2 border-fire-500/30 text-gray-400">{line.substring(1)}</li>;
                    if (line.trim() === '') return <br key={i} />;
                    return <p key={i}>{line}</p>;
                 })}
               </div>
             </div>

             {/* Activity & Tech Stack Row */}
             <div className="grid md:grid-cols-2 gap-4 mt-6">
                
                {/* Activity Stats */}
                <div className="bg-black/20 border border-white/5 rounded-xl p-4">
                   <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                     <GitPullRequest size={12} /> Failure Metrics
                   </h3>
                   <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm font-mono">
                         <span className="text-gray-400">Pushes</span>
                         <span className="text-white font-bold">{activity.pushEvents}</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                         <div className="bg-fire-500 h-full rounded-full" style={{ width: `${Math.min(activity.pushEvents * 2, 100)}%` }}></div>
                      </div>
                      <div className="flex justify-between items-center text-sm font-mono">
                         <span className="text-gray-400">PRs</span>
                         <span className="text-white font-bold">{activity.prOpened}</span>
                      </div>
                   </div>
                </div>

                {/* Tech Stack */}
                <div className="bg-black/20 border border-white/5 rounded-xl p-4">
                   <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                     <FileCode size={12} /> Trash Languages
                   </h3>
                   <div className="flex flex-wrap gap-2">
                      {topLanguages.length > 0 ? topLanguages.map(([lang, count], i) => (
                        <div key={lang} className="flex items-center gap-2 bg-white/5 px-2 py-1.5 rounded-lg border border-white/5">
                           <span className="w-2 h-2 rounded-full bg-red-600"></span>
                           <span className="text-xs font-mono text-gray-300">{lang}</span>
                           <span className="text-[10px] text-gray-600 bg-black/40 px-1.5 rounded">{count}</span>
                        </div>
                      )) : (
                        <span className="text-gray-600 text-xs italic">No code found (pathetic)</span>
                      )}
                   </div>
                </div>

             </div>
          </div>

          {/* RIGHT COLUMN: Stats & Score */}
          <div className="bg-black/20 p-6 md:p-8 flex flex-col gap-8 relative">
            
            {/* Score Card */}
            <div className="relative p-6 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 text-center overflow-hidden group">
              <div className={`absolute inset-0 bg-gradient-to-br ${getScoreGradient(analysis.score)} opacity-10 group-hover:opacity-30 transition-opacity duration-500`}></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-4">Suck Level</div>
                
                {/* Meter Container */}
                <div className="relative w-48 h-48 flex items-center justify-center mb-2 mx-auto">
                    <svg className="w-full h-full transform -rotate-90 drop-shadow-lg" viewBox="0 0 192 192">
                        {/* Background Track */}
                        <circle 
                            cx="96" cy="96" r={radius} 
                            stroke="currentColor" 
                            strokeWidth={strokeWidth}
                            fill="transparent" 
                            className="text-white/10" 
                        />
                        {/* Progress Circle */}
                        <circle 
                            cx="96" cy="96" r={radius} 
                            stroke="currentColor" 
                            strokeWidth={strokeWidth}
                            fill="transparent" 
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className={`${getScoreColor(analysis.score)} transition-all duration-1000 ease-out`}
                        />
                    </svg>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-6xl font-black ${getScoreColor(analysis.score)} drop-shadow-2xl font-mono tracking-tighter`}>
                            {displayedScore}%
                        </span>
                    </div>
                </div>

                <div className={`inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest bg-black/50 border border-white/10 ${getScoreColor(analysis.score)} uppercase`}>
                  {getScoreLabel(analysis.score)}
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Terminal size={12} /> Numbers
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <StatBox label="Junk Repos" value={user.public_repos} icon={<Code size={14} />} />
                  <StatBox label="Followers" value={user.followers} icon={<Users size={14} />} />
                  <StatBox label="Following" value={user.following} icon={<Eye size={14} />} />
                  <StatBox label="Gists" value={user.public_gists} icon={<GitFork size={14} />} />
                </div>
              </div>
              
              <div className="pt-4 border-t border-white/5 flex flex-col gap-4">
                
                {/* Share Button */}
                <a 
                  href={shareUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold font-mono text-sm rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-red-900/20 group"
                >
                  <Share2 size={16} className="group-hover:rotate-12 transition-transform duration-300" />
                  <span>TELL THE WORLD I SUCK</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ label, value, icon }: { label: string, value: string | number, icon: React.ReactNode }) => (
  <div className="bg-black/40 border border-white/5 p-3 rounded-lg hover:border-white/10 transition-colors">
    <div className="flex items-center gap-2 text-gray-500 mb-1">
      {icon}
      <span className="text-[10px] uppercase tracking-wide font-mono">{label}</span>
    </div>
    <div className="text-xl font-bold text-white font-mono">{value}</div>
  </div>
);

export default RoastResult;
