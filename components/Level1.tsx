
import React, { useState, useEffect } from 'react';
import { PunctuationSign, Sentence } from '../types';
import { getBSPExplanation } from '../services/geminiService';

interface Level1Props {
  sentence: Sentence;
  onNext: (isCorrect: boolean) => void;
}

const Level1: React.FC<Level1Props> = ({ sentence, onNext }) => {
  const [selected, setSelected] = useState<PunctuationSign | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [loadingHint, setLoadingHint] = useState(false);
  const [testIndex, setTestIndex] = useState(0);

  useEffect(() => {
    setSelected(null);
    setIsAnswered(false);
    setHint(null);
    
    // Randomly select which placeholder in the sentence to test
    const count = (sentence.text.match(/\[\?\]/g) || []).length;
    if (count > 0) {
      setTestIndex(Math.floor(Math.random() * count));
    } else {
      setTestIndex(0);
    }
  }, [sentence.id]);

  const signs: PunctuationSign[] = [',', ';', ':', '-'];
  const targetSign = sentence.correctSigns[testIndex];

  const handleSelect = (sign: PunctuationSign) => {
    if (isAnswered) return;
    setSelected(sign);
    setIsAnswered(true);
  };

  const fetchHint = async () => {
    if (!selected) return;
    setLoadingHint(true);
    const explanation = await getBSPExplanation(sentence.text, selected, targetSign);
    setHint(explanation);
    setLoadingHint(false);
  };

  const isCorrect = selected === targetSign;

  // Render text replacing the picked [?] with ... and others with correct signs
  const renderTextForTest = () => {
    const parts = sentence.text.split('[?]');
    let result = "";
    for (let i = 0; i < parts.length; i++) {
      result += parts[i];
      if (i < parts.length - 1) {
        if (i === testIndex) {
          result += ' ... ';
        } else {
          result += sentence.correctSigns[i];
        }
      }
    }
    return result;
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="bg-emerald-600 text-white px-8 py-3 rounded-2xl text-lg font-black shadow-lg">
        УРОВЕНЬ 1: ТЕСТОВЫЙ ВЫБОР
      </div>
      
      <div className="text-center max-w-2xl">
        <h3 className="text-2xl font-bold text-emerald-900 mb-2">Прочитайте предложение и выберите знак для места " ... ":</h3>
        <p className="text-emerald-600 font-medium italic">В сложных предложениях остальные знаки уже расставлены для подсказки.</p>
      </div>

      <div className="bsp-card w-full p-12 md:p-16 rounded-[40px] bg-white text-center shadow-xl border-8 border-emerald-50">
        <p className="text-3xl md:text-4xl leading-relaxed text-emerald-950 font-serif italic">
          "{renderTextForTest()}"
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-3xl">
        {signs.map((sign) => (
          <button
            key={sign}
            onClick={() => handleSelect(sign)}
            className={`h-28 text-5xl font-black rounded-[30px] transition-all border-4 transform active:scale-90 shadow-lg ${
              isAnswered 
                ? sign === targetSign 
                  ? 'bg-emerald-500 border-emerald-700 text-white scale-110 z-10 shadow-emerald-200' 
                  : sign === selected 
                    ? 'bg-red-100 border-red-500 text-red-600' 
                    : 'bg-gray-50 border-gray-200 text-gray-400 opacity-50'
                : 'bg-white border-emerald-500 text-emerald-700 hover:bg-emerald-50 hover:-translate-y-2'
            }`}
          >
            {sign}
          </button>
        ))}
      </div>

      {isAnswered && (
        <div className={`w-full max-w-2xl p-8 rounded-3xl animate-fade-in border-4 ${isCorrect ? 'bg-emerald-100 border-emerald-300' : 'bg-red-50 border-red-200'}`}>
          <div className="flex justify-between items-start mb-4">
            <h4 className={`text-2xl font-black ${isCorrect ? 'text-emerald-800' : 'text-red-800'}`}>
              {isCorrect ? '✅ ПРАВИЛЬНО!' : '❌ ОШИБКА'}
            </h4>
            {!isCorrect && !hint && (
              <button 
                onClick={fetchHint}
                className="text-xs bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-emerald-700 shadow-md"
                disabled={loadingHint}
              >
                {loadingHint ? 'Анализирую...' : '💡 Почему так?'}
              </button>
            )}
          </div>
          <p className="text-gray-800 font-medium mb-2">{sentence.explanation}</p>
          {hint && (
            <div className="mt-4 p-5 bg-white rounded-2xl border-2 border-emerald-100 text-sm italic text-emerald-900 shadow-inner">
              <span className="font-black text-emerald-600 uppercase">ИИ-Помощник:</span> {hint}
            </div>
          )}
          
          <button
            onClick={() => onNext(isCorrect)}
            className="mt-8 w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-emerald-700 transition-all shadow-xl border-b-8 border-emerald-900 active:border-b-0 active:translate-y-2"
          >
            СЛЕДУЮЩЕЕ ПРЕДЛОЖЕНИЕ →
          </button>
        </div>
      )}
    </div>
  );
};

export default Level1;
