import React, { useState, useEffect } from 'react';
import './index.css';
import Nutrition from './Nutrition';
import IngredientGame from './IngredientGame';

function App() {
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 }),
    [isDragging, setIsDragging] = useState(false),
    [isCooking, setIsCooking] = useState(false),
    [isCarrotNear, setIsCarrotNear] = useState(false),
    [currentPage, setCurrentPage] = useState('animation'),
    [selectedFood, setSelectedFood] = useState(null);

  const startDrag = e => {
    setIsDragging(true);
    if (isCooking) setIsCooking(false);
    setDragPos({ x: e.clientX - 30, y: e.clientY - 30 });
  };

  const checkCarrotProximity = (mouseX, mouseY) => {
    const pan = document.querySelector('.pan');
    if (pan) {
      const panRect = pan.getBoundingClientRect();
      const distance = Math.hypot(
        mouseX - (panRect.left + panRect.width / 2),
        mouseY - (panRect.top + panRect.height / 2)
      );
      setIsCarrotNear(distance < 150);
    }
  };

  const handleBackToAnimation = () => {
    setCurrentPage('animation');
    setIsCooking(false);
    setIsDragging(false);
    setIsCarrotNear(false);
    setSelectedFood(null);
  };

  const handleFoodSelect = foodName => {
    setSelectedFood(foodName);
    setCurrentPage('game');
  };

  const handleGameComplete = () => setCurrentPage('nutrition');

  useEffect(() => {
    const handleMove = e => {
      if (isDragging) {
        setDragPos({ x: e.clientX - 30, y: e.clientY - 30 });
        checkCarrotProximity(e.clientX, e.clientY);
      }
    };
    const handleStop = e => {
      if (!isDragging) return;
      setIsDragging(false);
      setIsCarrotNear(false);
      const pan = document.querySelector('.pan');
      if (pan) {
        const rect = pan.getBoundingClientRect();
        if (
          e.clientX > rect.left + 20 && e.clientX < rect.right - 20 &&
          e.clientY > rect.top + 20 && e.clientY < rect.bottom - 20
        ) {
          setIsCooking(true);
          setTimeout(() => setCurrentPage('nutrition'), 3000);
        }
      }
    };
    if (isDragging) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleStop);
    }
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleStop);
    };
  }, [isDragging]);

  if (currentPage === 'nutrition')
    return <Nutrition onBack={handleBackToAnimation} onFoodSelect={handleFoodSelect} />;
  if (currentPage === 'game' && selectedFood)
    return <IngredientGame foodName={selectedFood} onBack={() => setCurrentPage('nutrition')} onComplete={handleGameComplete} />;

  return (
    <div className="app">
      <h1>Macro Master </h1>
      <h2 className="game-title">Know What You Eat!</h2>
      <div className="game-area">
        <div
          className="carrot"
          onMouseDown={startDrag}
          style={{ opacity: isDragging || isCooking ? 0 : 1 }}
        >
          🥕
        </div>
        <div className={`pan${isCooking ? ' cooking' : ''}${isCarrotNear && isDragging ? ' near' : ''}`}>
          {isCooking && <><div className="steam">💨</div><div className="carrot cooking">🥕</div></>}
        </div>
        {isDragging && (
          <div
            className={`dragging${isCarrotNear ? ' near' : ''}`}
            style={{ left: dragPos.x, top: dragPos.y }}
          >
            🥕
          </div>
        )}
      </div>
    </div>
  );
}

export default App;