export enum PetAction {
  IDLE = 'IDLE',
  WALKING = 'WALKING',
  SLEEPING = 'SLEEPING',
  EATING = 'EATING',
  THINKING = 'THINKING', // When communicating with Gemini
}

export interface Message {
  sender: 'user' | 'pet';
  text: string;
  timestamp: number;
}

export interface PetState {
  hunger: number; // 0-100
  happiness: number; // 0-100
  action: PetAction;
}

export enum IslandState {
  COMPACT = 'COMPACT',
  EXPANDED = 'EXPANDED',
}