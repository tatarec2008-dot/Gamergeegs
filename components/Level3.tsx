
import React, { useState, useEffect } from 'react';
import { Sentence } from '../types';

interface Level3Props {
  sentence: Sentence;
  onNext: (isCorrect: boolean) => void;
}

const Level3: React.FC<Level3Props> = ({ sentence, onNext }) => {
  const [currentScheme, setCurrentScheme] = useState<string[]>([]);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    setCurrentScheme([]);
    setIsConfirmed(false);
  }, [sentence.id]);

  const blocks = ['[ ]', ',', ';', ':', '—'];

  const addBlock = (block: string) => {
    if (isConfirmed || currentScheme.length >= 25) return;
    setCurrentScheme(prev => [...prev, block]);
  };

  const removeLast = () => {
    if (isConfirmed) return;
    setCurrentScheme(prev => prev.slice(0, -1));
  };

  const clearAll = () => {
    if (isConfirmed) return;
    setCurrentScheme([]);
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
  };

  const normalizedUserScheme = currentScheme.join('').replace(/—/g, '-').replace(/\s/g, '');
  const normalizedTargetScheme = sentence.scheme.replace(/—/g, '-').replace(/,/g, ',').replace(/\s/g, '');
  
  const isCorrect = normalizedUserScheme === normalizedTargetScheme;

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="bg-emerald-600 text-white px-8 py-3 rounded-2xl text-lg font-black shadow-lg">
        УРОВЕНЬ 3: ПОСТРОЕНИЕ СХЕМЫ
      </div>

      <div className="text-center max-w-3xl">
        <h3 className="text-2xl font-bold text-emerald-900 mb-2">Составьте схему данного предложения:</h3>
        <p className="text-emerald-600 font-medium">Используйте блоки [ ] для грамматических основ и знаки препинания.</p>
      </div>

      <div className="bsp-card w-full p-8 md:p-10 rounded-2xl bg-emerald-50 text-center shadow-md">
        <p className="text-2xl md:text-3xl font-serif text-emerald-950 leading-relaxed italic">"{sentence.fullText}"</p>
      </div>

      <div className="w-full bg-white border-4 border-dashed border-emerald-200 rounded-[40px] p-8 md:p-12 min-h-[160px] flex flex-wrap justify-center items-center gap-3 shadow-inner">
        {currentScheme.length === 0 ? (
          <span className="text-emerald-200 text-xl md:text-2xl font-bold uppercase tracking-tighter opacity-50">Блоки появятся здесь...</span>
        ) : (
          currentScheme.map((block, i) => (
            <div 
              key={i} 
              className="bg-emerald-600 text-white px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl text-2xl md:text-4xl font-black shadow-lg transform hover:scale-110 transition-transform"
            >
              {block}
            </div>
          ))
        )}
      </div>

      <div className="flex flex-col items-center gap-8 w-full">
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {blocks.map((block) => (
            <button
              key={block}
              disabled={isConfirmed}
              onClick={() => addBlock(block)}
              className="bg-white border-4 border-emerald-500 text-emerald-700 px-6 py-3 md:px-8 md:py-5 rounded-xl md:rounded-2xl text-2xl md:text-4xl font-black hover:bg-emerald-500 hover:text-white transition-all transform active:scale-90 shadow-md"
            >
              {block}
            </button>
          ))}
          <div className="w-full md:w-auto flex gap-3">
            <button 
              disabled={isConfirmed}
              onClick={removeLast}
              className="bg-red-50 border-4 border-red-100 text-red-500 px-6 py-3 rounded-xl font-black hover:bg-red-500 hover:text-white transition-all shadow-sm flex-grow"
            >
              ← УДАЛИТЬ
            </button>
            <button 
              disabled={isConfirmed}
              onClick={clearAll}
              className="bg-gray-50 border-4 border-gray-100 text-gray-500 px-6 py-3 rounded-xl font-black hover:bg-gray-500 hover:text-white transition-all shadow-sm flex-grow"
            >
              СБРОС
            </button>
          </div>
        </div>

        {!isConfirmed ? (
          <button
            disabled={currentScheme.length < 3}
            onClick={handleConfirm}
            className={`px-16 py-6 rounded-2xl font-black text-2xl transition-all shadow-xl border-b-8 ${
              currentScheme.length >= 3 
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-800 hover:scale-105 active:border-b-0 active:translate-y-2' 
              : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed opacity-50'
            }`}
          >
            ПРОВЕРИТЬ СХЕМУ
          </button>
        ) : (
          <div className="flex flex-col items-center gap-6 animate-fade-in w-full max-w-2xl">
            <div className={`w-full p-8 rounded-[35px] border-4 ${isCorrect ? 'bg-emerald-100 border-emerald-400 shadow-xl' : 'bg-red-50 border-red-300 shadow-inner'}`}>
               <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl">{isCorrect ? '🏆' : '🔍'}</span>
                  <p className={`text-3xl font-black uppercase ${isCorrect ? 'text-emerald-800' : 'text-red-800'}`}>
                    {isCorrect ? 'ИДЕАЛЬНО!' : 'ЕСТЬ НЕДОЧЕТЫ'}
                  </p>
               </div>
               {!isCorrect && (
                 <p className="text-xl text-gray-800 font-bold mb-4">
                   Верная схема: <span className="bg-white px-4 py-2 rounded-lg border border-red-200 inline-block mt-2">{sentence.scheme}</span>
                 </p>
               )}
               <p className="text-lg text-emerald-900 font-medium">
                 {sentence.explanation}
               </p>
            </div>
            <button
              onClick={() => onNext(isCorrect)}
              className="w-full bg-emerald-600 text-white py-6 rounded-2xl font-black text-3xl hover:bg-emerald-700 transition-all shadow-xl border-b-8 border-emerald-900 active:border-b-0 active:translate-y-2"
            >
              ДАЛЕЕ →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Level3;
