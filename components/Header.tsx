
import React from 'react';
import { GameLevel } from '../types';

interface HeaderProps {
  level: GameLevel;
  score: number;
  total: number;
  onShare: () => void;
  onBack: () => void;
}

const Header: React.FC<HeaderProps> = ({ level, score, total, onShare, onBack }) => {
  return (
    <header className="bg-white border-b-4 border-emerald-500 p-4 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center hover:bg-emerald-100 transition-colors border-2 border-emerald-200"
            title="Назад к выбору"
          >
            <span className="text-emerald-700 font-bold">←</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shadow-md transform -rotate-3">
              <span className="text-white text-xl font-bold">Б</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-emerald-900 leading-tight">БСП: Уровень {level}</h1>
              <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Тренажер • 11 Д</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="bg-emerald-50 px-6 py-2 rounded-full border-2 border-emerald-200 flex items-center gap-4">
            <span className="text-emerald-800 font-black text-sm uppercase">Счёт</span>
            <div className="flex items-baseline gap-1">
               <span className="text-3xl font-black text-emerald-600 leading-none">{score}</span>
               <span className="text-emerald-300 font-bold">/</span>
               <span className="text-lg font-bold text-emerald-400">{total}</span>
            </div>
          </div>

          <button 
            onClick={onShare}
            className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 border-b-4 border-emerald-200 active:border-b-0 active:translate-y-1"
          >
            <span>🔗</span>
            <span className="hidden md:inline">Доска</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
