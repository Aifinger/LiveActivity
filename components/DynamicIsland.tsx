import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PetRender } from './PetRender';
import { PetAction, IslandState, Message } from '../types';
import { generatePetResponse } from '../services/geminiService';
import { Send, Utensils, Gamepad2, MessageCircle, X } from 'lucide-react';

// Helper for precise timeout loops
const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

export const DynamicIsland: React.FC = () => {
  const [islandState, setIslandState] = useState<IslandState>(IslandState.COMPACT);
  const [petAction, setPetAction] = useState<PetAction>(PetAction.IDLE);
  const [happiness, setHappiness] = useState(80);
  const [hunger, setHunger] = useState(50);
  
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'pet', text: 'Meow! Welcome to my island.', timestamp: Date.now() }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // --- Game Loop / Logic ---
  useInterval(() => {
    // Random idle behavior when compact
    if (islandState === IslandState.COMPACT && !isTyping) {
      const rand = Math.random();
      if (rand > 0.95) setPetAction(PetAction.SLEEPING);
      else if (rand > 0.7) setPetAction(PetAction.WALKING);
      else setPetAction(PetAction.IDLE);
    }
    
    // Stats decay
    setHunger(prev => Math.min(100, prev + 0.2));
    setHappiness(prev => Math.max(0, prev - 0.1));

  }, 2000);

  // Auto scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, islandState]);

  // --- Interactions ---

  const handleExpand = () => {
    if (islandState === IslandState.COMPACT) {
      setIslandState(IslandState.EXPANDED);
      setPetAction(PetAction.IDLE);
    }
  };

  const handleCollapse = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIslandState(IslandState.COMPACT);
    setPetAction(PetAction.IDLE);
  };

  const handleFeed = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPetAction(PetAction.EATING);
    setHunger(prev => Math.max(0, prev - 30));
    setHappiness(prev => Math.min(100, prev + 10));
    setTimeout(() => setPetAction(PetAction.IDLE), 2000);
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPetAction(PetAction.WALKING);
    setHappiness(prev => Math.min(100, prev + 20));
    setTimeout(() => setPetAction(PetAction.IDLE), 2000);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!chatInput.trim()) return;

    const newMsg: Message = { sender: 'user', text: chatInput, timestamp: Date.now() };
    setMessages(prev => [...prev, newMsg]);
    setChatInput("");
    setIsTyping(true);
    setPetAction(PetAction.THINKING);

    // Call Gemini
    const reply = await generatePetResponse(newMsg.text, happiness > 50 ? "Happy" : "Grumpy");
    
    setMessages(prev => [...prev, { sender: 'pet', text: reply, timestamp: Date.now() }]);
    setIsTyping(false);
    setPetAction(PetAction.IDLE);
  };

  // --- Layout Dimensions & Styles ---
  // Emulating iOS spring physics with cubic-bezier
  const springTransition = "transition-all duration-[600ms] ease-[cubic-bezier(0.175,0.885,0.32,1.275)]";
  
  const isExpanded = islandState === IslandState.EXPANDED;

  return (
    <div className="fixed top-4 left-0 right-0 flex justify-center z-50 pointer-events-none">
      {/* The Island Container */}
      <div 
        className={`
          pointer-events-auto
          relative bg-black text-white 
          ${springTransition}
          ${isExpanded ? 'w-[92vw] max-w-[400px] h-[450px] rounded-[40px]' : 'w-[120px] h-[36px] rounded-[18px] hover:scale-105 cursor-pointer'}
          shadow-2xl overflow-hidden border border-zinc-800/50
        `}
        onClick={!isExpanded ? handleExpand : undefined}
      >
        
        {/* --- COMPACT VIEW --- */}
        <div 
          className={`absolute inset-0 flex items-center justify-between px-3 transition-opacity duration-300 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
           {/* Pet Left */}
           <div className="w-6 h-6">
             <PetRender action={petAction} />
           </div>
           
           {/* Signal Indicators (Decorations) */}
           <div className="flex gap-1 h-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${happiness < 30 ? 'bg-red-500' : 'bg-green-500'} animate-pulse`}></div>
              <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
           </div>
        </div>


        {/* --- EXPANDED VIEW --- */}
        <div 
          className={`flex flex-col h-full w-full p-6 transition-all duration-500 delay-100 ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        >
          
          {/* Header: Pet Area */}
          <div className="flex items-start justify-between mb-6">
             <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-zinc-900/50 rounded-full p-2 border border-white/10">
                   <PetRender action={petAction} />
                </div>
                <div>
                   <h2 className="text-lg font-bold text-white">Mochi</h2>
                   <div className="flex gap-2 text-xs text-zinc-400">
                      <span>H: {Math.round(happiness)}%</span>
                      <span>Hunger: {Math.round(hunger)}%</span>
                   </div>
                </div>
             </div>
             
             <button 
              onClick={handleCollapse}
              className="p-2 bg-zinc-800/50 rounded-full hover:bg-zinc-700 transition-colors"
             >
               <X size={16} className="text-zinc-400" />
             </button>
          </div>

          {/* Chat Area */}
          <div 
            ref={chatContainerRef}
            className="flex-1 bg-zinc-900/30 rounded-2xl p-3 mb-4 overflow-y-auto scrollbar-hide flex flex-col gap-2"
          >
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-2 px-3 rounded-xl text-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-200'}`}>
                   {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
               <div className="text-xs text-zinc-500 ml-2">Mochi is typing...</div>
            )}
          </div>

          {/* Controls */}
          <div className="mt-auto">
            {/* Quick Actions */}
            <div className="flex justify-center gap-6 mb-4">
               <button onClick={handleFeed} className="flex flex-col items-center gap-1 group">
                  <div className="w-12 h-12 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <Utensils size={20} />
                  </div>
                  <span className="text-xs text-zinc-500">Feed</span>
               </button>
               <button onClick={handlePlay} className="flex flex-col items-center gap-1 group">
                  <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors">
                    <Gamepad2 size={20} />
                  </div>
                  <span className="text-xs text-zinc-500">Play</span>
               </button>
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="relative">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Say hi to Mochi..."
                className="w-full bg-zinc-800 text-white rounded-full py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600"
              />
              <button 
                type="submit"
                className="absolute right-1 top-1 bottom-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
              >
                <Send size={14} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};