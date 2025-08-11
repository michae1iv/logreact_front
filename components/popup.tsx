// components/PopupMessage.tsx
'use client';

import { usePopup } from '@/context/popup_ctx'; // Используем хук для контекста
import { useEffect, useState } from 'react';

const PopupMessage = () => {
  const { message, showPopup, setPopup } = usePopup();
  const [timeLeft, setTimeLeft] = useState(3); // Время до закрытия попапа в секундах (5 секунд)
  const [progress, setProgress] = useState(0); // Прогресс от 0 до 100

  useEffect(() =>  {
    if (showPopup && message) {
      const interval = setInterval (() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 0.01; // уменьшаем время на 0.1 секунды каждый интервал
          if (newTime <= 0) {
            clearInterval(interval); // Закрыть попап по истечении времени
            setPopup(null, false);
          }
          setProgress(((3 - newTime) / 3) * 100); // Обновляем прогресс на основе оставшегося времени
          return newTime;
        });
      }, 10); // Обновляем каждую 0.1 секунду (10 раз в секунду)
      setTimeLeft(3)
      setProgress(0)
      return () => clearInterval(interval); // Очистить интервал при размонтировании компонента
    }
  }, [showPopup, message, setPopup]);

  if (!showPopup || !message) return null; // Если попап не должен показываться, не рендерим

  return (
    <div className="fixed top-21 right-10 p-6 bg-white text-black shadow-xl max-w-md w-full rounded">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Server response</h3>
        
        {/* Увеличенный крестик */}
        <button
          onClick={() => setPopup(null, false)}
          className="text-red-500 hover:text-red-700 text-3xl" // Увеличиваем крестик в 2 раза (text-3xl)
        >
          ×
        </button>
      </div>
      <p className="text-sm">{message}</p>
      
      {/* Прогресс-бар */}
      <div className="w-full bg-gray-300 mt-4 rounded-full">
        <div
          className="h-1 bg-green-500 rounded-full"
          style={{ width: `${progress}%` }} // Динамически меняем ширину
        />
      </div>
    </div>
  );
};

export default PopupMessage;
