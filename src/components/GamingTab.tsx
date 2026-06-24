import React from 'react';
import { motion } from 'motion/react';
import { DownloadCloud, MessageCircle, Star, ShieldCheck, Zap } from 'lucide-react';

export default function GamingTab() {
  const handleWhatsAppOrder = () => {
    const phoneNumber = "255747470941";
    const message = encodeURIComponent("Hi Lupin, I would like to order a custom premium BUSSID skin.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const showcaseBuses = [
    { name: "SBG Aurora Express", type: "Luxury Coach", rating: "5.0" },
    { name: "Dar Night Cruiser", type: "Sleeper Bus", rating: "4.9" },
    { name: "Kilimanjaro Star", type: "Intercity High-Deck", rating: "4.8" },
    { name: "Zanzibar Metro", type: "City Transit", rating: "4.7" }
  ];

  return (
    <div className="w-full flex flex-col gap-10 pb-12">
      <div className="space-y-4">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white flex items-center gap-4">
          <span className="text-neon-green">BUSSID</span> GAMING HUB
        </h2>
        <p className="text-white/60 text-lg max-w-2xl">
          The ultimate destination for premium Tanzanian Bus Simulator Indonesia (BUSSID) mods and exclusive custom skins.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Main Action Area */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-8 rounded-2xl flex flex-col gap-6 relative overflow-hidden group border-plasma-pink"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-plasma-pink/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="space-y-2 relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-6 h-6 text-plasma-pink" />
                <span className="text-plasma-pink font-mono text-sm tracking-wider uppercase">Official Asset Package</span>
              </div>
              <h3 className="text-3xl font-bold">Tanzania Skins Mega Pack</h3>
              <p className="text-white/60">Get the complete collection of high-resolution, ultra-realistic bus skins covering major Tanzanian routes.</p>
            </div>

            <a 
              href="http://www.mediafire.com/file/shwg9aoutmzq40z/TANZANIA_SKINS.zip"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 px-6 py-4 bg-white/5 hover:bg-plasma-pink/20 border border-plasma-pink/50 rounded-xl flex items-center justify-center gap-3 transition-all group-hover:shadow-[0_0_20px_rgba(255,0,127,0.3)]"
            >
              <DownloadCloud className="w-6 h-6 text-plasma-pink" />
              <span className="font-bold tracking-wide text-white">Download Tanzania Skins .ZIP</span>
            </a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8 rounded-2xl flex flex-col gap-6 relative overflow-hidden group border-neon-green"
          >
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-neon-green/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />
            
            <div className="space-y-2 relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-6 h-6 text-neon-green" />
                <span className="text-neon-green font-mono text-sm tracking-wider uppercase">Premium Service</span>
              </div>
              <h3 className="text-3xl font-bold">Custom Livery Orders</h3>
              <p className="text-white/60">Need a specific design? Order a custom, high-fidelity skin tailored exactly to your specifications.</p>
            </div>

            <button 
              onClick={handleWhatsAppOrder}
              className="mt-4 px-6 py-4 bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/50 rounded-xl flex items-center justify-center gap-3 transition-all"
            >
              <MessageCircle className="w-6 h-6 text-[#25D366]" />
              <span className="font-bold tracking-wide text-white">Order via WhatsApp</span>
            </button>
          </motion.div>
        </div>

        {/* Showcase Slider Area */}
        <div className="lg:col-span-3 glass-panel rounded-2xl p-8 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold tracking-wide">Elite Showcase</h3>
            <div className="px-4 py-1 rounded-full bg-white/10 text-xs font-mono tracking-wider">LATEST RELEASES</div>
          </div>

          <div className="flex-1 overflow-x-auto pb-6 -mx-8 px-8 snap-x snap-mandatory hide-scrollbar">
            <div className="flex gap-6 w-max">
              {showcaseBuses.map((bus, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="glass-card w-[300px] h-[400px] rounded-2xl flex flex-col snap-center relative overflow-hidden group"
                >
                  {/* Abstract bus placeholder visual since we can't use images easily without assets */}
                  <div className="flex-1 bg-white/5 border-b border-white/10 relative overflow-hidden flex flex-col items-center justify-center">
                    <div className="w-48 h-24 bg-gradient-to-br from-white/10 to-transparent rounded-lg border border-white/20 shadow-2xl relative">
                       {/* Abstract windows */}
                       <div className="absolute top-4 left-4 right-4 h-8 bg-black/40 rounded flex gap-1 p-1">
                          {[1,2,3,4,5].map(n => <div key={n} className="flex-1 bg-white/5 rounded-sm" />)}
                       </div>
                       {/* Wheels */}
                       <div className="absolute -bottom-3 left-6 w-6 h-6 rounded-full border-2 border-white/20 bg-black" />
                       <div className="absolute -bottom-3 right-6 w-6 h-6 rounded-full border-2 border-white/20 bg-black" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-neon-green px-2 py-1 bg-neon-green/10 rounded">{bus.type}</span>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-bold text-white">{bus.rating}</span>
                      </div>
                    </div>
                    <h4 className="text-xl font-bold">{bus.name}</h4>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
