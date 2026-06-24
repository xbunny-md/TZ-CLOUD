import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Sparkles, RefreshCw, TerminalSquare, Brain, MessageSquare, Plus, Pin, Trash2, Edit2, Copy, Check, Menu, X, ChevronRight, Paperclip, Globe } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Message {
  id: string;
  role: 'user' | 'system';
  content: string;
  isNew?: boolean;
}

interface ChatSession {
  id: string;
  name: string;
  pinned: boolean;
  messages: Message[];
  createdAt: number;
}

const CodeBlock = ({ language, code }: { language: string, code: string }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl overflow-hidden my-2 border border-white/10 bg-black/50">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
        <span className="text-[10px] font-mono text-white/50 uppercase">{language || 'text'}</span>
        <button 
          onClick={handleCopy} 
          className="p-1.5 rounded-md hover:bg-white/10 text-white/50 hover:text-white transition-all flex items-center gap-1"
        >
          {copied ? <Check className="w-3 h-3 text-neon-green" /> : <Copy className="w-3 h-3" />}
          <span className="text-[10px] font-mono">{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <SyntaxHighlighter
        style={vscDarkPlus as any}
        language={language}
        PreTag="div"
        customStyle={{ margin: 0, background: 'transparent', padding: '1rem' }}
        className="text-sm font-mono"
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

const TypingEffect = ({ content }: { content: string }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedContent(content.substring(0, i));
      i++;
      if (i > content.length) clearInterval(interval);
    }, 10);
    return () => clearInterval(interval);
  }, [content]);

  return (
    <div className="markdown-body prose prose-invert max-w-none text-white/90 prose-pre:bg-transparent prose-pre:p-0 prose-pre:my-2">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          code({node, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <CodeBlock 
                language={match[1]} 
                code={String(children).replace(/\n$/, '')} 
              />
            ) : (
              <code className="bg-white/10 px-1.5 py-0.5 rounded-md text-plasma-pink font-mono text-sm" {...props}>
                {children}
              </code>
            )
          }
        }}
      >
        {displayedContent}
      </ReactMarkdown>
    </div>
  );
};

export default function AITab() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem('tz-cloudmind-sessions');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return [{ id: 'default', name: 'New Session', pinned: false, messages: [{ id: '1', role: 'system', content: 'Hello. I am TZ CloudMind, the central intelligence of this hub. How can I assist you today?' }], createdAt: Date.now() }];
  });
  
  const [activeSessionId, setActiveSessionId] = useState<string>('default');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('llama-3.1-8b-instant');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  useEffect(() => {
    const sessionsToSave = sessions.map(s => ({
      ...s,
      messages: s.messages.map(m => ({ ...m, isNew: undefined }))
    }));
    localStorage.setItem('tz-cloudmind-sessions', JSON.stringify(sessionsToSave));
  }, [sessions]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeSession?.messages]);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      name: 'New Session',
      pinned: false,
      messages: [{ id: '1', role: 'system', content: 'TZ CloudMind initialized. Ready for input.', isNew: true }],
      createdAt: Date.now()
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setIsSidebarOpen(false);
  };

  const togglePin = (id: string) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, pinned: !s.pinned } : s));
  };

  const deleteSession = (id: string) => {
    setSessions(prev => {
      const updated = prev.filter(s => s.id !== id);
      if (updated.length === 0) {
        return [{ id: Date.now().toString(), name: 'New Session', pinned: false, messages: [{ id: '1', role: 'system', content: 'TZ CloudMind initialized. Ready for input.', isNew: true }], createdAt: Date.now() }];
      }
      if (activeSessionId === id) {
        setActiveSessionId(updated[0].id);
      }
      return updated;
    });
  };

  const updateSessionMessages = (sessionId: string, newMessages: Message[], autoRename?: string) => {
    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return { ...s, messages: newMessages, name: autoRename ? autoRename : s.name };
      }
      return s;
    }));
  };

  const handleSendMessageWrapper = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    handleSendMessage(e, input);
  };

  const generatePrompt = () => {
    const prompts = [
      "Write a high-performance React hook for tracking mouse position.",
      "Explain the architecture of a Node.js + Express backend.",
      "Write a custom terminal output simulation in Tailwind CSS.",
      "Generate a sleek glassmorphic card component using Next.js."
    ];
    setInput(prompts[Math.floor(Math.random() * prompts.length)]);
  };

  const PRE_TOPICS = [
    "Design a modern landing page in React",
    "How to optimize Vite build performance?",
    "Explain React useMemo with examples",
    "Write a Python script for automation"
  ];

  const handleTopicClick = (topic: string) => {
    setInput(topic);
    setTimeout(() => {
      handleSendMessage(undefined, topic);
    }, 50);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const startEditing = (msg: Message) => {
    if (msg.role === 'user') {
      setEditingMessageId(msg.id);
      setEditContent(msg.content);
    }
  };

  const saveEdit = (msgId: string) => {
    if (!editContent.trim()) return;
    const newMessages = activeSession.messages.map(m => m.id === msgId ? { ...m, content: editContent } : m);
    updateSessionMessages(activeSessionId, newMessages);
    setEditingMessageId(null);
  };

  const handleSendMessage = async (e?: React.FormEvent, forceInput?: string) => {
    e?.preventDefault();
    const textToSend = forceInput || input;
    if (!textToSend.trim() || isLoading) return;

    if (editingMessageId) {
      saveEdit(editingMessageId);
      return;
    }

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: textToSend.trim() };
    const newMessages = [...activeSession.messages, userMessage];
    
    let autoRename = undefined;
    if (activeSession.messages.length <= 1) {
      autoRename = textToSend.trim().substring(0, 20) + '...';
    }

    updateSessionMessages(activeSessionId, newMessages, autoRename);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage.content, history: activeSession.messages, model: selectedModel })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'API error');
      
      updateSessionMessages(activeSessionId, [...newMessages, {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: data.text || "Processed successfully.",
        isNew: true
      }]);
    } catch (error: any) {
      console.error(error);
      updateSessionMessages(activeSessionId, [...newMessages, {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: `Error: ${error.message || "Neural core disconnected. Please check your keys or connection."}`,
        isNew: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-[85vh] flex pb-6 relative overflow-hidden">

      {/* Desktop Sidebar: Chat History */}
      <div className="hidden lg:flex w-64 mr-6 glass-card rounded-2xl border-white/10 flex-col overflow-hidden h-full z-10">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-bold text-sm tracking-wide">Memory Core</h3>
          <button onClick={createNewSession} className="p-2 rounded-lg bg-white/5 hover:bg-neon-green/20 hover:text-neon-green transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
          {sessions.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.createdAt - a.createdAt).map(session => (
            <div 
              key={session.id} 
              onClick={() => { setActiveSessionId(session.id); }}
              className={`w-full p-3 rounded-xl flex items-center justify-between cursor-pointer group transition-all ${activeSessionId === session.id ? 'bg-aurora-purple/20 border border-aurora-purple/50' : 'hover:bg-white/5 border border-transparent'}`}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <MessageSquare className="w-4 h-4 text-white/50 flex-shrink-0" />
                <span className="text-sm truncate text-white/80">{session.name}</span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => { e.stopPropagation(); togglePin(session.id); }} className={`p-1 rounded hover:bg-white/10 ${session.pinned ? 'text-neon-green opacity-100' : 'text-white/50'}`}>
                  <Pin className="w-3 h-3" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); deleteSession(session.id); }} className="p-1 rounded hover:bg-red-500/20 text-white/50 hover:text-red-400">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 glass-panel rounded-2xl flex flex-col overflow-hidden border-aurora-purple/30 relative h-full w-full">
        <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-aurora-purple to-transparent opacity-50" />
        
        {/* Mobile Sidebar Dropdown */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden rounded-2xl"
                onClick={() => setIsSidebarOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-[80px] left-4 right-4 z-50 glass-panel rounded-2xl p-4 flex flex-col gap-2 md:hidden bg-black/80 backdrop-blur-xl border-white/20 shadow-2xl max-h-[60vh] overflow-hidden"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sm tracking-wide text-white/80">Memory Core</h3>
                  <button onClick={createNewSession} className="p-2 rounded-lg bg-white/5 hover:bg-neon-green/20 hover:text-neon-green transition-colors text-white">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                  {sessions.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.createdAt - a.createdAt).map(session => (
                    <div 
                      key={session.id} 
                      onClick={() => { setActiveSessionId(session.id); setIsSidebarOpen(false); }}
                      className={`w-full p-4 mt-2 rounded-xl flex items-center justify-between cursor-pointer transition-all ${activeSessionId === session.id ? 'bg-aurora-purple/30 border border-aurora-purple/50' : 'bg-white/5 border border-transparent'}`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <MessageSquare className="w-5 h-5 text-white/70 flex-shrink-0" />
                        <span className="text-base truncate text-white">{session.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="p-4 lg:p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02] z-30">
          <div className="flex items-center gap-4">
            <div className="flex w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-aurora-purple/20 items-center justify-center border border-aurora-purple/50 shadow-[0_0_15px_rgba(138,43,226,0.3)]">
              <Brain className="w-5 h-5 lg:w-6 lg:h-6 text-aurora-purple" />
            </div>
            <div>
              <h2 className="text-lg lg:text-xl font-bold tracking-wide">TZ CloudMind</h2>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                <span className="text-[10px] lg:text-xs font-mono text-white/50 uppercase">Core Active</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={selectedModel} 
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] sm:text-xs text-white/80 font-mono focus:outline-none focus:border-aurora-purple/50 max-w-[100px] sm:max-w-[120px] lg:max-w-none"
            >
              <option value="llama-3.1-8b-instant">TZ Flash</option>
              <option value="llama3-70b-8192">TZ Core</option>
              <option value="mixtral-8x7b-32768">TZ Mix</option>
            </select>
            <button 
              onClick={() => updateSessionMessages(activeSessionId, [])}
              className="hidden lg:flex p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors items-center gap-2"
              title="Clear Chat"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-xs font-mono uppercase tracking-wider">Clear</span>
            </button>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 custom-scrollbar">
          {activeSession.messages.length <= 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-12 gap-6"
            >
              <div className="w-20 h-20 rounded-3xl bg-aurora-purple/10 border border-aurora-purple/30 flex items-center justify-center shadow-[0_0_30px_rgba(138,43,226,0.2)]">
                <Brain className="w-10 h-10 text-aurora-purple" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">How can I assist you today?</h3>
                <p className="text-white/50">Select a topic below to jump-start the core sequence</p>
              </div>
              <div className="flex flex-wrap justify-center gap-3 max-w-2xl mt-4">
                {PRE_TOPICS.map((topic, i) => (
                  <button
                    key={i}
                    onClick={() => handleTopicClick(topic)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-aurora-purple/20 border border-white/10 hover:border-aurora-purple/50 transition-all text-sm font-mono text-white/80 hover:text-white flex items-center gap-2 group"
                  >
                    <Sparkles className="w-3 h-3 text-white/40 group-hover:text-aurora-purple transition-colors" />
                    {topic}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <AnimatePresence initial={false}>
            {activeSession.messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 ${
                    msg.role === 'user' ? 'bg-white/10' : 'bg-aurora-purple/20 border border-aurora-purple/30'
                  }`}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-aurora-purple" />}
                  </div>
                  <div className={`p-4 rounded-2xl relative group ${
                    msg.role === 'user' 
                      ? 'bg-white/10 rounded-tr-sm border border-white/5' 
                      : 'glass-card rounded-tl-sm border-aurora-purple/20 overflow-hidden'
                  }`}>
                    {msg.role === 'user' ? (
                      <div>
                        {editingMessageId === msg.id ? (
                          <div className="flex flex-col gap-2">
                            <textarea 
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="bg-black/50 border border-white/20 rounded-lg p-2 text-white/90 text-sm focus:outline-none focus:border-aurora-purple min-h-[60px] w-[200px] sm:w-[300px]"
                            />
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => setEditingMessageId(null)} className="px-3 py-1 bg-white/10 rounded-md text-xs">Cancel</button>
                              <button onClick={() => saveEdit(msg.id)} className="px-3 py-1 bg-aurora-purple text-white rounded-md text-xs">Save</button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-white/90 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        )}
                        <div className="absolute top-2 -left-10 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                          <button onClick={() => startEditing(msg)} className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white/70 hover:text-white" title="Edit">
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity -mt-2 -mr-2">
                          <button onClick={() => copyToClipboard(msg.content)} className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white/70 hover:text-white" title="Copy">
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        {(msg as any).isNew ? (
                          <TypingEffect content={msg.content} />
                        ) : (
                          <div className="markdown-body prose prose-invert max-w-none text-white/90 prose-pre:bg-transparent prose-pre:p-0 prose-pre:my-2">
                            <ReactMarkdown 
                              remarkPlugins={[remarkGfm]}
                              components={{
                                code({node, className, children, ...props}) {
                                  const match = /language-(\w+)/.exec(className || '');
                                  return match ? (
                                    <CodeBlock 
                                      language={match[1]} 
                                      code={String(children).replace(/\n$/, '')} 
                                    />
                                  ) : (
                                    <code className="bg-white/10 px-1.5 py-0.5 rounded-md text-plasma-pink font-mono text-sm" {...props}>
                                      {children}
                                    </code>
                                  )
                                }
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
               <div className="flex gap-4 max-w-[80%]">
                 <div className="w-8 h-8 rounded-full bg-aurora-purple/20 border border-aurora-purple/30 flex items-center justify-center mt-1">
                   <Bot className="w-4 h-4 text-aurora-purple" />
                 </div>
                 <div className="p-4 rounded-2xl glass-card rounded-tl-sm border-aurora-purple/20 flex gap-2 items-center">
                   <span className="w-2 h-2 rounded-full bg-aurora-purple animate-bounce" style={{ animationDelay: '0ms' }} />
                   <span className="w-2 h-2 rounded-full bg-aurora-purple animate-bounce" style={{ animationDelay: '150ms' }} />
                   <span className="w-2 h-2 rounded-full bg-aurora-purple animate-bounce" style={{ animationDelay: '300ms' }} />
                 </div>
               </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white/[0.02] border-t border-white/5">
          <form onSubmit={handleSendMessageWrapper} className="relative flex flex-col gap-3">
            <div className="flex gap-2 mb-[-8px] px-2">
               <button type="button" className="text-[10px] uppercase font-mono text-white/40 hover:text-neon-green flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-white/5">
                 <Globe className="w-3 h-3" /> Web Search
               </button>
               <button type="button" className="text-[10px] uppercase font-mono text-white/40 hover:text-plasma-pink flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-white/5">
                 <Paperclip className="w-3 h-3" /> Attach Data
               </button>
            </div>
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Initialize query sequence..."
                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-6 pr-14 text-white placeholder-white/30 focus:outline-none focus:border-aurora-purple/50 focus:ring-1 focus:ring-aurora-purple/50 transition-all font-mono text-sm"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 p-2 rounded-lg bg-white/5 hover:bg-aurora-purple/20 text-white/50 hover:text-aurora-purple transition-all disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center justify-between px-2">
              <div className="flex gap-2">
                <button type="button" onClick={generatePrompt} className="text-[10px] uppercase font-mono text-white/40 hover:text-neon-green flex items-center gap-1 transition-colors">
                  <Sparkles className="w-3 h-3" /> Auto Suggestion
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
