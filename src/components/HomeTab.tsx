import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Users, Download, Activity, Gamepad2, Brain, ChevronDown } from 'lucide-react';
import { TabType } from '../App';

interface HomeTabProps {
  onNavigate: (tab: TabType) => void;
}

export default function HomeTab({ onNavigate }: HomeTabProps) {
  const [userCount, setUserCount] = useState(12400);
  const [downloadCount, setDownloadCount] = useState(89100);
  const [uptime, setUptime] = useState(99.90);

  useEffect(() => {
    // Initial rapid count up effect (optional, let's just make the continuous increment faster)
    const interval = setInterval(() => {
      setUserCount(prev => prev + Math.floor(Math.random() * 15) + 5);
      setDownloadCount(prev => prev + Math.floor(Math.random() * 25) + 10);
      setUptime(prev => Math.min(100, prev + (Math.random() * 0.01 - 0.002)));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Active Users', value: `${(userCount).toLocaleString()}`, icon: Users, color: 'text-neon-green' },
    { label: 'Total Downloads', value: `${(downloadCount).toLocaleString()}`, icon: Download, color: 'text-plasma-pink' },
    { label: 'System Uptime', value: `${uptime.toFixed(3)}%`, icon: Activity, color: 'text-aurora-purple' },
  ];

  const faqs = [
    {
      question: "How do I install the BUSSID Tanzania Skin Pack?",
      answer: "Download the .ZIP file from the BUSSID Gaming Hub tab. Extract the contents using any file manager on your Android device. Then, open BUSSID, go to Garage > Livery > Browse Livery > File Manager, and select the extracted skin files."
    },
    {
      question: "How can I order a custom skin?",
      answer: "Navigate to the BUSSID Gaming Hub tab and click on 'Order via WhatsApp'. This will directly connect you with our lead designer, Lupin, where you can provide references and specifications for your custom luxury skin."
    },
    {
      question: "What is TZ CloudMind?",
      answer: "TZ CloudMind is our advanced central AI designed to assist with tech queries, generate prompt ideas for mod designs, and provide fast, automated support across our ecosystem."
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-12 py-10 w-full max-w-5xl mx-auto">
      <div className="text-center space-y-6 relative">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="inline-block glass-panel px-6 py-2 rounded-full mb-4 border-neon-green"
        >
          <span className="text-neon-green font-mono text-sm tracking-widest uppercase">System Online • Version 2.0</span>
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl font-black tracking-tighter"
        >
          TZ <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green via-plasma-pink to-aurora-purple">CLOUD</span>
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto font-light leading-relaxed"
        >
          Leading the next-generation digital ecosystem in Tanzania. 
          Experience the convergence of hyper-realistic gaming mods and advanced AI infrastructure.
        </motion.p>
      </div>

      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
      >
        {stats.map((stat, i) => (
          <div key={i} className="glass-card rounded-2xl p-6 flex flex-col items-center text-center gap-4">
            <div className={`p-4 rounded-xl bg-white/5 ${stat.color}`}>
              <stat.icon className="w-8 h-8" />
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-white/50 text-sm tracking-wider uppercase font-medium">{stat.label}</div>
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="flex flex-col sm:flex-row gap-6 mt-8 w-full justify-center"
      >
        <button 
          onClick={() => onNavigate('gaming')}
          className="group relative px-8 py-4 rounded-xl overflow-hidden glass-card border-neon-green flex items-center justify-center gap-3 transition-all hover:scale-105"
        >
          <div className="absolute inset-0 bg-neon-green/10 transform origin-left scale-x-0 transition-transform group-hover:scale-x-100" />
          <Gamepad2 className="w-5 h-5 text-neon-green z-10" />
          <span className="font-bold tracking-wide text-white z-10">Explore BUSSID Hub</span>
          <ArrowRight className="w-5 h-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all z-10" />
        </button>

        <button 
          onClick={() => onNavigate('ai')}
          className="group relative px-8 py-4 rounded-xl overflow-hidden glass-card border-aurora-purple flex items-center justify-center gap-3 transition-all hover:scale-105"
        >
          <div className="absolute inset-0 bg-aurora-purple/10 transform origin-left scale-x-0 transition-transform group-hover:scale-x-100" />
          <Brain className="w-5 h-5 text-aurora-purple z-10" />
          <span className="font-bold tracking-wide text-white z-10">Access TZ CloudMind</span>
          <ArrowRight className="w-5 h-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all z-10" />
        </button>
      </motion.div>

      {/* FAQ Section */}
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.0 }}
        className="w-full mt-16 max-w-3xl mx-auto space-y-6"
      >
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <FAQItem key={i} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="glass-card rounded-2xl overflow-hidden border-white/5 hover:border-white/20 transition-all">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
      >
        <span className="font-bold text-lg">{question}</span>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180 text-neon-green' : 'text-white/50'}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="px-6 pb-6 text-white/60 text-base leading-relaxed border-t border-white/5 pt-4">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
