import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Search, X, Loader2, Video } from 'lucide-react';

interface YouTubeVideo {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    thumbnails: { high: { url: string } };
    channelTitle: string;
    publishedAt: string;
  };
}

export default function TVTab() {
  const [searchQuery, setSearchQuery] = useState('BUSSID Tanzania skin');
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const fetchVideos = async (query: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/youtube?query=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Failed to fetch videos');
      const data = await res.json();
      if (data.items) {
        setVideos(data.items.filter((item: any) => item.id?.videoId));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchVideos(searchQuery);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchVideos(searchQuery);
    }
  };

  return (
    <div className="w-full flex flex-col h-full gap-8 pb-12 relative">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight flex items-center gap-3">
            TZ CLOUD <span className="text-plasma-pink">TV</span>
          </h2>
          <p className="text-white/50 mt-2">Streaming the latest tech showcases, mod reviews, and gameplay.</p>
        </div>

        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search network streams..."
            className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 text-white focus:outline-none focus:border-plasma-pink/50 focus:bg-white/10 transition-all font-mono text-sm"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        </form>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-plasma-pink" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video, i) => (
            <motion.div
              key={video.id.videoId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedVideo(video.id.videoId)}
              className="glass-card rounded-2xl overflow-hidden cursor-pointer group flex flex-col h-full border-transparent hover:border-plasma-pink/50"
            >
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={video.snippet.thumbnails.high.url} 
                  alt={video.snippet.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-full bg-plasma-pink/80 flex items-center justify-center text-white pl-1 shadow-[0_0_20px_rgba(255,0,127,0.5)]">
                    <Play className="w-5 h-5 fill-current" />
                  </div>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1 gap-2">
                <h3 className="font-bold line-clamp-2 leading-tight group-hover:text-plasma-pink transition-colors">
                  {video.snippet.title}
                </h3>
                <div className="mt-auto flex items-center gap-2 text-sm text-white/50">
                  <Video className="w-4 h-4" />
                  <span className="truncate">{video.snippet.channelTitle}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          >
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
              onClick={() => setSelectedVideo(null)}
            />
            
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl glass-panel rounded-2xl overflow-hidden border-plasma-pink/50 shadow-[0_0_50px_rgba(255,0,127,0.1)]"
            >
              <button 
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-plasma-pink text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="relative pt-[56.25%] w-full bg-black">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${selectedVideo}?autoplay=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
