
import React, { useState, useMemo } from 'react';
import { AppStage, GameLevel, Sentence, DifficultyLevel } from './types';
import { SENTENCES, AUTHORS } from './constants';
import Level1 from './components/Level1';
import Level2 from './components/Level2';
import Level3 from './components/Level3';
import Header from './components/Header';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>(AppStage.MENU);
  const [currentLevel, setCurrentLevel] = useState<GameLevel>(GameLevel.SELECT);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('easy');
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [sessionKey, setSessionKey] = useState(0); // Used to re-trigger shuffle

  // Filter and shuffle sentences based on chosen difficulty
  const levelSentences = useMemo(() => {
    const filtered = SENTENCES.filter(s => s.difficulty === difficulty);
    return [...filtered].sort(() => Math.random() - 0.5).slice(0, 10);
  }, [difficulty, currentLevel, sessionKey]);

  const currentSentence = levelSentences[currentSentenceIndex];

  const handleNext = (isCorrect: boolean) => {
    if (isCorrect) setScore(prev => prev + 1);
    
    if (currentSentenceIndex < levelSentences.length - 1) {
      setCurrentSentenceIndex(prev => prev + 1);
    } else {
      setStage(AppStage.RESULT);
    }
  };

  const selectGameLevel = (level: GameLevel) => {
    setCurrentLevel(level);
    setScore(0);
    setCurrentSentenceIndex(0);
    setStage(AppStage.DIFFICULTY_SELECT);
  };

  const startPlaying = (diff: DifficultyLevel) => {
    setDifficulty(diff);
    setScore(0);
    setCurrentSentenceIndex(0);
    setSessionKey(prev => prev + 1);
    setStage(AppStage.PLAYING);
  };

  const goToMenu = () => {
    setScore(0);
    setCurrentSentenceIndex(0);
    setStage(AppStage.MENU);
  };

  const goToSelector = () => {
    setScore(0);
    setCurrentSentenceIndex(0);
    setStage(AppStage.LEVEL_SELECT);
  };

  const shareGame = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('Ссылка скопирована!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      {stage !== AppStage.MENU && (
        <Header 
          level={currentLevel} 
          score={score} 
          total={levelSentences.length} 
          onShare={shareGame} 
          onBack={goToSelector}
        />
      )}
      
      <main className="flex-grow flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
           <div className="absolute top-10 left-10 w-64 h-64 border-8 border-emerald-500 rounded-full"></div>
           <div className="absolute bottom-10 right-10 w-96 h-96 border-8 border-emerald-500 rounded-full"></div>
        </div>

        {stage === AppStage.MENU && (
          <div className="text-center animate-fade-in z-10 w-full max-w-4xl px-4">
            <div className="mb-12">
               <div className="w-32 h-32 bg-emerald-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl rotate-3">
                  <span className="text-white text-6xl font-black">БСП</span>
               </div>
               <h1 className="text-6xl font-black text-emerald-900 mb-4 tracking-tighter uppercase">ИНТЕРАКТИВНЫЙ ТРЕНАЖЕР</h1>
               <p className="text-2xl text-emerald-700 font-medium italic">Бессоюзные сложные предложения</p>
            </div>
            
            <button 
              onClick={goToSelector}
              className="bg-emerald-600 text-white px-24 py-10 rounded-3xl font-black text-5xl hover:bg-emerald-700 transition-all transform hover:scale-110 active:scale-95 shadow-2xl mb-16 border-b-8 border-emerald-800"
            >
              СТАРТ
            </button>
          </div>
        )}

        {stage === AppStage.LEVEL_SELECT && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl animate-fade-in px-4">
            {[
              { id: GameLevel.SELECT, title: 'Тест', desc: 'Укажи пропущенный знак', icon: '📝' },
              { id: GameLevel.DRAG_DROP, title: 'Подстановка', desc: 'Установи знак в текст', icon: '🎯' },
              { id: GameLevel.SCHEME, title: 'Схема', desc: 'Построй структуру БСП', icon: '🏗️' }
            ].map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => selectGameLevel(lvl.id)}
                className="bsp-card bg-white p-10 rounded-[40px] text-center group hover:border-emerald-500 transition-all flex flex-col items-center shadow-xl hover:shadow-2xl border-4 border-emerald-50"
              >
                <span className="text-7xl mb-6 group-hover:scale-125 transition-transform block">{lvl.icon}</span>
                <h3 className="text-3xl font-black text-emerald-900 mb-2">Уровень {lvl.id}</h3>
                <p className="text-emerald-700 font-bold text-xl mb-4">{lvl.title}</p>
                <p className="text-gray-500">{lvl.desc}</p>
              </button>
            ))}
            <div className="md:col-span-3 text-center mt-12">
               <button onClick={goToMenu} className="text-emerald-700 font-black text-xl hover:text-emerald-500 transition-colors uppercase tracking-widest">
                ← В главное меню
               </button>
            </div>
          </div>
        )}

        {stage === AppStage.DIFFICULTY_SELECT && (
          <div className="flex flex-col items-center gap-10 w-full max-w-4xl animate-fade-in">
             <div className="text-center">
                <h2 className="text-4xl font-black text-emerald-900 uppercase mb-2">Выбери сложность</h2>
                <p className="text-emerald-600 font-bold">Сложность определяет количество грамматических основ</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                {[
                  { id: 'easy', title: 'Легко', desc: '3 основы', color: 'bg-emerald-100 border-emerald-300 text-emerald-700' },
                  { id: 'medium', title: 'Средне', desc: '4 основы', color: 'bg-emerald-500 border-emerald-700 text-white' },
                  { id: 'hard', title: 'Сложно', desc: '5+ основ', color: 'bg-emerald-900 border-emerald-950 text-emerald-100' }
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => startPlaying(d.id as DifficultyLevel)}
                    className={`${d.color} p-10 rounded-3xl border-4 text-center shadow-xl hover:scale-105 transition-all transform active:scale-95 flex flex-col items-center`}
                  >
                    <span className="text-3xl font-black mb-2">{d.title}</span>
                    <span className="text-sm font-bold opacity-80 uppercase tracking-tighter">{d.desc}</span>
                  </button>
                ))}
             </div>
             <button onClick={goToSelector} className="text-emerald-700 font-bold text-lg hover:underline mt-4">← К выбору типа игры</button>
          </div>
        )}

        {stage === AppStage.PLAYING && (
          <div className="w-full max-w-4xl animate-fade-in">
            <div className="mb-10 text-center">
              <div className="inline-block px-6 py-2 bg-emerald-100 text-emerald-800 rounded-full font-black text-sm uppercase tracking-widest mb-4">
                Сложность: {difficulty === 'easy' ? 'Легко (3 основы)' : difficulty === 'medium' ? 'Средне (4 основы)' : 'Сложно (5+ основ)'}
              </div>
              <h2 className="text-4xl font-black text-emerald-900">
                Задание {currentSentenceIndex + 1} из {levelSentences.length}
              </h2>
            </div>

            {currentLevel === GameLevel.SELECT && <Level1 sentence={currentSentence} onNext={handleNext} />}
            {currentLevel === GameLevel.DRAG_DROP && <Level2 sentence={currentSentence} onNext={handleNext} />}
            {currentLevel === GameLevel.SCHEME && <Level3 sentence={currentSentence} onNext={handleNext} />}
          </div>
        )}

        {stage === AppStage.RESULT && (
          <div className="text-center bsp-card p-16 rounded-[50px] bg-emerald-50 max-w-2xl animate-fade-in shadow-2xl border-8 border-emerald-200">
            <h2 className="text-6xl font-black text-emerald-800 mb-8 font-serif uppercase tracking-tighter">Финиш!</h2>
            <p className="text-2xl mb-10 text-emerald-900 font-medium italic">Твой результат:</p>
            <div className="text-[120px] leading-none font-black text-emerald-600 mb-12 drop-shadow-lg">
              {score}<span className="text-4xl text-emerald-300">/</span>{levelSentences.length}
            </div>
            <div className="flex flex-col gap-4">
              <button 
                onClick={goToSelector}
                className="bg-emerald-600 text-white px-12 py-6 rounded-2xl font-black text-2xl hover:bg-emerald-700 transition-all shadow-xl hover:scale-105 active:scale-95"
              >
                К ВЫБОРУ ТИТИПА ИГРЫ
              </button>
              <button 
                onClick={goToMenu}
                className="text-emerald-600 font-bold text-xl hover:underline"
              >
                Вернуться на главный экран
              </button>
            </div>
          </div>
        )}
      </main>

      {stage === AppStage.MENU && <Footer authors={AUTHORS} />}
      
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
