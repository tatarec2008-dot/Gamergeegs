
import React, { useState, useEffect, useMemo } from 'react';
import { PunctuationSign, Sentence } from '../types';

interface Level2Props {
  sentence: Sentence;
  onNext: (isCorrect: boolean) => void;
}

const Level2: React.FC<Level2Props> = ({ sentence, onNext }) => {
  const initialInventory = useMemo(() => {
    // Inventory starts with the correct signs
    const signs = [...sentence.correctSigns];
    
    // Always add distractors so that even on Easy (1 sign) there are choices.
    // We want at least 4 signs total in the inventory for all levels.
    const allSigns: PunctuationSign[] = [',', ';', ':', '-'];
    
    while (signs.length < 4) {
      const randomSign = allSigns[Math.floor(Math.random() * allSigns.length)];
      signs.push(randomSign);
    }
    
    return signs.sort(() => Math.random() - 0.5);
  }, [sentence.id]);

  const [inventory, setInventory] = useState<PunctuationSign[]>([]);
  const [slots, setSlots] = useState<(PunctuationSign | null)[]>([]);
  const [selectedInventoryIndex, setSelectedInventoryIndex] = useState<number | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    setInventory(initialInventory);
    const placeholdersCount = (sentence.text.match(/\[\?\]/g) || []).length;
    setSlots(new Array(placeholdersCount).fill(null));
    setIsConfirmed(false);
    setSelectedInventoryIndex(null);
  }, [sentence.id, initialInventory]);

  const textParts = sentence.text.split('[?]');

  const handleInventoryClick = (index: number) => {
    if (isConfirmed) return;
    setSelectedInventoryIndex(index);
  };

  const handleSlotClick = (slotIndex: number) => {
    if (isConfirmed) return;

    const existingSign = slots[slotIndex];
    
    if (selectedInventoryIndex !== null) {
      const signToPlace = inventory[selectedInventoryIndex];
      const newSlots = [...slots];
      newSlots[slotIndex] = signToPlace;
      setSlots(newSlots);

      const newInventory = [...inventory];
      if (existingSign) {
        newInventory[selectedInventoryIndex] = existingSign;
      } else {
        newInventory.splice(selectedInventoryIndex, 1);
        setSelectedInventoryIndex(null);
      }
      setInventory(newInventory);
    } else if (existingSign) {
      const newSlots = [...slots];
      newSlots[slotIndex] = null;
      setSlots(newSlots);
      setInventory([...inventory, existingSign]);
    }
  };

  const handleConfirm = () => {
    if (slots.some(s => s === null)) return;
    setIsConfirmed(true);
  };

  const isCorrect = useMemo(() => {
    return slots.every((sign, index) => sign === sentence.correctSigns[index]);
  }, [slots, sentence.correctSigns]);

  return (
    <div className="flex flex-col items-center gap-10 w-full max-w-5xl">
      <div className="bg-emerald-600 text-white px-8 py-3 rounded-2xl text-lg font-black shadow-lg">
        УРОВЕНЬ 2: РАССТАНОВКА ЗНАКОВ
      </div>

      <div className="text-center max-w-3xl">
        <h3 className="text-2xl font-bold text-emerald-900 mb-2">Выберите знак из набора и нажмите на пустой блок [?] в тексте:</h3>
        <p className="text-emerald-600 font-medium italic">В наборе могут быть лишние знаки. Поставьте только правильные!</p>
      </div>

      <div className="relative w-full p-8 md:p-12 rounded-[40px] bg-white text-center shadow-xl border-8 border-emerald-50 flex flex-wrap justify-center items-center gap-x-4 gap-y-6 min-h-[250px]">
        {textParts.map((part, i) => (
          <React.Fragment key={i}>
            <span className="text-2xl md:text-3xl font-serif text-emerald-950 leading-relaxed">{part}</span>
            {i < textParts.length - 1 && (
              <button
                onClick={() => handleSlotClick(i)}
                className={`w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-3xl md:text-4xl font-black transition-all border-4 shadow-inner ${
                  isConfirmed 
                    ? slots[i] === sentence.correctSigns[i] ? 'bg-emerald-500 border-emerald-600 text-white scale-110' : 'bg-red-500 border-red-600 text-white scale-110'
                    : slots[i] 
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-800' 
                      : 'bg-emerald-50 border-dashed border-emerald-200 text-emerald-200 hover:border-emerald-400'
                }`}
              >
                {slots[i] || '?'}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="flex flex-col items-center gap-6 w-full bg-emerald-50 p-8 rounded-[30px] border-4 border-white shadow-xl">
        <h4 className="text-emerald-800 font-black uppercase text-sm tracking-widest">Твой набор знаков:</h4>
        <div className="flex flex-wrap justify-center gap-4 min-h-[80px]">
          {inventory.length === 0 && !isConfirmed && (
             <p className="text-emerald-400 font-bold italic animate-bounce">Все знаки распределены! Можно проверять.</p>
          )}
          {inventory.map((sign, index) => (
            <button
              key={`${sign}-${index}`}
              disabled={isConfirmed}
              onClick={() => handleInventoryClick(index)}
              className={`w-16 h-16 text-3xl font-black rounded-2xl border-4 transition-all transform hover:scale-105 active:scale-90 ${
                selectedInventoryIndex === index 
                  ? 'bg-emerald-600 border-emerald-800 text-white shadow-xl -translate-y-2' 
                  : 'bg-white border-emerald-200 text-emerald-600'
              }`}
            >
              {sign}
            </button>
          ))}
        </div>

        {!isConfirmed ? (
          <button
            disabled={slots.some(s => s === null)}
            onClick={handleConfirm}
            className={`px-16 py-5 rounded-2xl font-black text-xl transition-all shadow-xl border-b-8 ${
              !slots.some(s => s === null)
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-800 active:border-b-0 active:translate-y-2' 
                : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed opacity-50'
            }`}
          >
            ПРОВЕРИТЬ ОТВЕТ
          </button>
        ) : (
          <div className="flex flex-col items-center gap-6 animate-fade-in w-full">
            <div className={`w-full p-8 rounded-3xl border-4 ${isCorrect ? 'bg-emerald-100 border-emerald-300' : 'bg-red-50 border-red-200 shadow-inner'}`}>
              <div className="flex items-center gap-4 mb-3">
                 <span className="text-4xl">{isCorrect ? '🌟' : '🧐'}</span>
                 <p className={`text-2xl font-black ${isCorrect ? 'text-emerald-800' : 'text-red-800'}`}>
                   {isCorrect ? 'ВЕРНО!' : 'ЕСТЬ ОШИБКИ'}
                 </p>
              </div>
              {!isCorrect && (
                <p className="text-emerald-900 font-bold mb-2">Верный вариант: {sentence.fullText}</p>
              )}
              <p className="text-gray-700 font-medium">
                 {sentence.explanation}
              </p>
            </div>
            <button
              onClick={() => onNext(isCorrect)}
              className="w-full max-sm bg-emerald-600 text-white py-5 rounded-2xl font-black text-2xl hover:bg-emerald-700 transition-all shadow-xl border-b-8 border-emerald-900 active:border-b-0 active:translate-y-2"
            >
              ДАЛЕЕ →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Level2;
