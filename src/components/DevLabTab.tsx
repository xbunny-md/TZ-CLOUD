import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Github, Code, Cpu, Smartphone, Server, CheckCircle2, ChevronRight, BookOpen, Star, GitBranch } from 'lucide-react';

interface Repo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
}

export default function DevLabTab() {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [visibleCards, setVisibleCards] = useState(10);

  useEffect(() => {
    const lines = [
      "> Initializing Lupin's Dev Lab...",
      "> Authenticating developer credentials [OK]",
      "> Fetching live data from GitHub @xbotmanager-cell...",
      "> Connecting to neural nodes...",
      "> System ready. Awaiting command."
    ];

    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < lines.length) {
        setTerminalLines(prev => [...prev, lines[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch('https://api.github.com/users/xbotmanager-cell/repos?sort=updated&per_page=6')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRepos(data);
        }
      })
      .catch(err => console.error("Failed to fetch repos:", err))
      .finally(() => setLoadingRepos(false));
  }, []);

  // Generate 50 detailed cards about the dev
  const devInsights = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    title: `System Directive V${2.0 + i * 0.1}`,
    description: `Executing core background processes and analyzing structural integrity of system node #${i + 1}. Focusing on high-performance algorithms, responsive design paradigms, and scalable backend infrastructure. The goal is to establish a seamless connection between the frontend UI and the underlying neural core, ensuring zero-latency communication and robust fault tolerance.`,
    tags: ["Architecture", "Scale", "UI/UX"].sort(() => 0.5 - Math.random()).slice(0, 2)
  }));

  const handleLoadMore = () => {
    setVisibleCards(prev => Math.min(prev + 10, devInsights.length));
  };

  return (
    <div className="w-full flex flex-col gap-8 pb-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Developer Profile Column */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="glass-panel rounded-2xl p-8 border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-20" />
            
            <div className="flex flex-col items-center text-center gap-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/20 flex items-center justify-center rotate-3 hover:rotate-0 transition-transform">
                  <Code className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-neon-green text-black text-[10px] font-bold px-2 py-1 rounded">SYS_ADMIN</div>
              </div>
              
              <div>
                <h2 className="text-3xl font-black tracking-tight">Lupin</h2>
                <p className="text-white/50 font-mono text-sm mt-1">@xbotmanager-cell</p>
                <p className="text-white/70 mt-4 text-sm leading-relaxed text-left">
                  Lead Developer, Architect, and visionary behind TZ Cloud. Specializing in highly scalable Next.js applications, robust Express backends, AI integration, and futuristic glassmorphic UI design. Known for creating high-performance East African tech solutions and gaming mods.
                </p>
              </div>

              <div className="flex gap-3 mt-2 w-full">
                <a href="https://github.com/xbotmanager-cell" target="_blank" rel="noreferrer" className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 transition-colors">
                  <Github className="w-4 h-4" />
                  <span className="text-sm font-medium">View GitHub</span>
                </a>
              </div>
            </div>
          </div>

          {/* Live Terminal */}
          <div className="glass-card rounded-2xl overflow-hidden border-white/10 bg-black/60 font-mono text-sm">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-white/5">
              <Terminal className="w-4 h-4 text-white/50" />
              <span className="text-white/50 text-xs tracking-wider">dev_console_v2</span>
            </div>
            <div className="p-4 h-48 overflow-y-auto space-y-2 text-neon-green">
              {terminalLines.map((line, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }}
                >
                  {line}
                </motion.div>
              ))}
              <motion.div 
                animate={{ opacity: [1, 0] }} 
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="w-2 h-4 bg-neon-green inline-block mt-1"
              />
            </div>
          </div>
        </div>

        {/* Live GitHub Repos Column */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          <h3 className="text-2xl font-bold tracking-wide flex items-center gap-3">
            <Github className="w-6 h-6 text-white/50" />
            Live Repositories
          </h3>
          
          {loadingRepos ? (
            <div className="flex items-center justify-center h-48 glass-card rounded-2xl">
              <div className="w-8 h-8 rounded-full border-2 border-neon-green border-t-transparent animate-spin" />
            </div>
          ) : repos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {repos.map((repo, i) => (
                <motion.div
                  key={repo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-6 rounded-2xl flex flex-col gap-4 border-white/5 hover:border-white/20 group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-neon-green" />
                      <a href={repo.html_url} target="_blank" rel="noreferrer" className="text-lg font-bold hover:underline truncate max-w-[180px]">{repo.name}</a>
                    </div>
                    {repo.language && (
                      <span className="text-[10px] font-mono tracking-wider text-plasma-pink bg-plasma-pink/10 px-2 py-1 rounded border border-plasma-pink/20">
                        {repo.language}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-white/60 text-sm leading-relaxed line-clamp-2 flex-1">
                    {repo.description || "No description provided."}
                  </p>

                  <div className="flex items-center gap-4 text-white/50 text-xs font-mono">
                    <div className="flex items-center gap-1"><Star className="w-3 h-3" /> {repo.stargazers_count}</div>
                    <div className="flex items-center gap-1"><GitBranch className="w-3 h-3" /> {repo.forks_count}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-6 rounded-2xl text-center text-white/50">
              No public repositories found.
            </div>
          )}
        </div>
      </div>

      {/* 50 Cards Grid */}
      <div className="mt-8">
        <h3 className="text-2xl font-bold tracking-wide flex items-center gap-3 mb-6">
          <Server className="w-6 h-6 text-white/50" />
          System Insights & Directives
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {devInsights.slice(0, visibleCards).map((insight, i) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="glass-panel p-6 rounded-2xl flex flex-col gap-4 border-white/5 hover:border-aurora-purple/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-aurora-purple font-mono text-xs uppercase tracking-widest">{insight.title}</span>
                <span className="text-white/30 font-mono text-xs">#{insight.id.toString().padStart(3, '0')}</span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                {insight.description}
              </p>
              <div className="mt-auto flex gap-2">
                {insight.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-white/5 text-white/50 text-[10px] uppercase font-mono rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {visibleCards < devInsights.length && (
          <div className="mt-8 flex justify-center">
            <button 
              onClick={handleLoadMore}
              className="px-8 py-3 rounded-full glass-card hover:bg-white/10 transition-colors flex items-center gap-2 text-sm font-bold tracking-wider"
            >
              Load More Directives <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
