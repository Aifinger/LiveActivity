import React, { useState, useEffect } from 'react';
import { DynamicIsland } from './components/DynamicIsland';

export default function App() {
  // Current Time for lock screen look
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center overflow-hidden">
      
      {/* Background Elements (To mimic iPhone Lock Screen) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Subtle grain or overlay could go here */}
      </div>

      {/* Lock Screen UI Elements */}
      <div className="mt-24 text-center z-10 pointer-events-none select-none">
        <div className="text-xl text-white/90 font-semibold mb-1">
            {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
        <div className="text-[5.5rem] leading-none font-bold text-white/95 tracking-tight drop-shadow-xl font-[inter]">
            {time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false })}
        </div>
      </div>

      {/* Notification Placeholders */}
      <div className="mt-8 w-[90%] max-w-sm flex flex-col gap-3 z-10 pointer-events-none">
         <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 text-white shadow-lg animate-[pulse_4s_infinite]">
            <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 bg-blue-500 rounded-md flex items-center justify-center text-[10px]">W</div>
                <span className="text-xs uppercase font-semibold opacity-80">Weather</span>
                <span className="text-xs opacity-50 ml-auto">now</span>
            </div>
            <p className="text-sm font-medium">Mostly Sunny, 72°F</p>
         </div>
      </div>
      
      {/* Footer / Flashlight shortcuts visual */}
      <div className="absolute bottom-10 w-full px-12 flex justify-between pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
             {/* Flashlight Icon */}
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                 <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
             </svg>
          </div>
          <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
             {/* Camera Icon */}
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                 <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                 <circle cx="12" cy="13" r="4" />
             </svg>
          </div>
      </div>

      {/* The Dynamic Island (Layered on top) */}
      <DynamicIsland />
      
    </div>
  );
}