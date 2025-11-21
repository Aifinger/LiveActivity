import React from 'react';
import { PetAction } from '../types';

interface PetRenderProps {
  action: PetAction;
  className?: string;
}

// Simple SVG Pixel Art Cat
const PixelCat: React.FC<{ action: PetAction }> = ({ action }) => {
  const isSleeping = action === PetAction.SLEEPING;
  const isWalking = action === PetAction.WALKING;
  const isEating = action === PetAction.EATING;

  // Base colors
  const colorBody = "#FFFFFF";
  const colorEye = "#000000";
  const colorCheek = "#FFAAAA";

  return (
    <svg
      viewBox="0 0 32 32"
      className={`w-full h-full drop-shadow-lg ${isWalking ? 'animate-[walk_0.5s_ease-in-out_infinite]' : ''}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Tail */}
      <path
        d="M24 22H26V20H28V16H26V14H24V16H22V22H24Z"
        fill={colorBody}
        className={!isSleeping ? 'animate-[tail-wag_1s_ease-in-out_infinite] origin-bottom-left' : ''}
      />
      
      {/* Body */}
      {isSleeping ? (
         // Sleeping Pose
         <path d="M6 24H26V28H6V24Z M8 20H24V24H8V20Z" fill={colorBody} />
      ) : (
         // Standing/Sitting Pose
         <path d="M8 20H24V28H8V20Z" fill={colorBody} />
      )}

      {/* Head */}
      <g transform={isSleeping ? "translate(0, 4)" : "translate(0, 0)"}>
        <path d="M10 12H22V20H10V12Z" fill={colorBody} />
        {/* Ears */}
        <path d="M10 12V8H8V10H6V14H8V12H10Z" fill={colorBody} />
        <path d="M22 12V8H24V10H26V14H24V12H22Z" fill={colorBody} />
        
        {/* Eyes */}
        {isSleeping ? (
             <g fill={colorEye}>
                <rect x="12" y="15" width="2" height="1" />
                <rect x="18" y="15" width="2" height="1" />
             </g>
        ) : (
            <g fill={colorEye}>
                <rect x="12" y="14" width="2" height="2" />
                <rect x="18" y="14" width="2" height="2" />
            </g>
        )}

        {/* Cheeks */}
        <rect x="10" y="16" width="2" height="1" fill={colorCheek} opacity="0.6" />
        <rect x="20" y="16" width="2" height="1" fill={colorCheek} opacity="0.6" />

        {/* Mouth */}
        {!isSleeping && !isEating && (
            <rect x="15" y="17" width="2" height="1" fill="#FFAAAA" />
        )}
        
        {isEating && (
             <rect x="15" y="17" width="2" height="2" fill="#FFAAAA" className="animate-pulse"/>
        )}
      </g>
      
      {/* Food Item if Eating */}
      {isEating && (
         <g className="animate-bounce">
            <path d="M26 24H28V26H26V24Z" fill="#FFA500" /> 
            <path d="M28 22H30V24H28V22Z" fill="#FFA500" />
         </g>
      )}
    </svg>
  );
};

export const PetRender: React.FC<PetRenderProps> = ({ action, className }) => {
  return (
    <div className={`relative ${className}`}>
      <PixelCat action={action} />
      
      {/* Status Indicators (Zzz, bubbles) */}
      {action === PetAction.SLEEPING && (
        <div className="absolute -top-2 right-0 text-blue-300 text-xs font-bold animate-pulse">
          Zzz...
        </div>
      )}
       {action === PetAction.THINKING && (
        <div className="absolute -top-4 right-0 text-white text-xs animate-bounce">
          💬
        </div>
      )}
    </div>
  );
};