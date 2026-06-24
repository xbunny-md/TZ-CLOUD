import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Gamepad2, Brain, Tv, Code2, Cloud, Menu, X } from 'lucide-react';
import HomeTab from './components/HomeTab';
import GamingTab from './components/GamingTab';
import AITab from './components/AITab';
import TVTab from './components/TVTab';
import DevLabTab from './components/DevLabTab';
import BackgroundMesh from './components/BackgroundMesh';

export type TabType = 'home' | 'gaming' | 'ai' | 'tv' | 'dev';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, color: 'text-white' },
    { id: 'gaming', label: 'BUSSID Hub', icon: Gamepad2, color: 'text-neon-green' },
    { id: 'ai', label: 'TZ CloudMind', icon: Brain, color: 'text-aurora-purple' },
    { id: 'tv', label: 'Cloud TV', icon: Tv, color: 'text-plasma-pink' },
    { id: 'dev', label: 'Dev Lab', icon: Code2, color: 'text-white' },
  ] as const;

  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen w-full relative selection:bg-neon-green/30 selection:text-white">
      <BackgroundMesh />

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-50 w-full px-4 py-4 sm:px-6 lg:px-8">
          <nav className="glass-panel rounded-2xl px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <Cloud className="w-6 h-6 text-neon-green" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-wider text-white">TZ <span className="text-neon-green">CLOUD</span></h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id as TabType)}
                  className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 ${
                    activeTab === item.id 
                      ? 'bg-white/10 border-white/20 border shadow-[0_0_15px_rgba(255,255,255,0.05)] text-white' 
                      : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${activeTab === item.id ? item.color : ''}`} />
                  <span className="font-medium text-sm tracking-wide">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </nav>

          {/* Mobile Navigation Dropdown */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md md:hidden"
                  onClick={() => setMobileMenuOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute top-[80px] left-4 right-4 z-50 glass-panel rounded-2xl p-4 flex flex-col gap-2 md:hidden bg-black/80 backdrop-blur-xl border-white/20 shadow-2xl"
                >
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id as TabType)}
                      className={`px-4 py-4 rounded-xl flex items-center gap-4 transition-all duration-300 ${
                        activeTab === item.id 
                          ? 'bg-white/10 border-white/30 border text-white' 
                          : 'text-white/70 hover:text-white hover:bg-white/10 border border-transparent'
                      }`}
                    >
                      <item.icon className={`w-6 h-6 ${activeTab === item.id ? item.color : ''}`} />
                      <span className="font-semibold text-lg">{item.label}</span>
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </header>

        {/* Dynamic Tab Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col w-full"
            >
              {activeTab === 'home' && <HomeTab onNavigate={handleTabChange} />}
              {activeTab === 'gaming' && <GamingTab />}
              {activeTab === 'ai' && <AITab />}
              {activeTab === 'tv' && <TVTab />}
              {activeTab === 'dev' && <DevLabTab />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;
