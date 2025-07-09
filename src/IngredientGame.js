import React, { useState, useEffect } from 'react';
import './cooking-game-layout.css';

const INGREDIENTS = [
  { id: 'bread', name: 'Burger Bun', emoji: '🍞', station: 'ready', time: 0 },
  { id: 'beef', name: 'Beef Patty', emoji: '🥩', station: 'grill', time: 3000 },
  { id: 'cheese', name: 'Cheese', emoji: '🧀', station: 'ready', time: 0 },
  { id: 'lettuce', name: 'Lettuce', emoji: '🥬', station: 'cutting', time: 2000 },
  { id: 'tomato', name: 'Tomato', emoji: '🍅', station: 'cutting', time: 2500 },
  { id: 'onion', name: 'Onion', emoji: '🧅', station: 'cutting', time: 2000 },
  { id: 'pickle', name: 'Pickles', emoji: '🥒', station: 'cutting', time: 1500 },
  { id: 'sauce', name: 'Special Sauce', emoji: '🟡', station: 'ready', time: 0 }
];

function SimpleKitchen({ onBack, onComplete }) {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [cuttingQueue, setCuttingQueue] = useState([]);
  const [grillQueue, setGrillQueue] = useState([]);
  const [readyIngredients, setReadyIngredients] = useState([]);
  const [currentScreen, setCurrentScreen] = useState('selection');
  const [processingTimes, setProcessingTimes] = useState({});

  // Add ingredient to preparation
  const handleIngredientClick = (ingredient) => {
    if (selectedIngredients.find(item => item.id === ingredient.id)) return;
    
    setSelectedIngredients(prev => [...prev, ingredient]);
    
    if (ingredient.station === 'cutting') {
      setCuttingQueue(prev => [...prev, ingredient]);
      startProcessing('cutting', ingredient);
    } else if (ingredient.station === 'grill') {
      setGrillQueue(prev => [...prev, ingredient]);
      startProcessing('grill', ingredient);
    } else {
      setReadyIngredients(prev => [...prev, ingredient]);
    }
  };

  // Start processing timer
  const startProcessing = (station, ingredient) => {
    const timeId = `${station}-${ingredient.id}`;
    setProcessingTimes(prev => ({ ...prev, [timeId]: Date.now() + ingredient.time }));
    
    setTimeout(() => {
      if (station === 'cutting') {
        setCuttingQueue(prev => prev.filter(item => item.id !== ingredient.id));
      } else if (station === 'grill') {
        setGrillQueue(prev => prev.filter(item => item.id !== ingredient.id));
      }
      setReadyIngredients(prev => [...prev, ingredient]);
      setProcessingTimes(prev => {
        const newTimes = { ...prev };
        delete newTimes[timeId];
        return newTimes;
      });
    }, ingredient.time);
  };

  // Remove ingredient
  const removeIngredient = (ingredientId) => {
    setSelectedIngredients(prev => prev.filter(item => item.id !== ingredientId));
    setCuttingQueue(prev => prev.filter(item => item.id !== ingredientId));
    setGrillQueue(prev => prev.filter(item => item.id !== ingredientId));
    setReadyIngredients(prev => prev.filter(item => item.id !== ingredientId));
  };

  // Progress to kitchen
  const goToKitchen = () => {
    if (selectedIngredients.length > 0) {
      setCurrentScreen('kitchen');
    }
  };

  // Complete cooking
  const completeCooking = () => {
    if (readyIngredients.length === selectedIngredients.length) {
      onComplete?.({ 
        ingredients: readyIngredients, 
        totalTime: Math.max(...selectedIngredients.map(i => i.time)) 
      });
    }
  };

  // INGREDIENT SELECTION SCREEN
  if (currentScreen === 'selection') {
    return (
      <div className="simple-kitchen">
        <button className="back-btn" onClick={onBack}>← Back</button>
        
        <div className="header">
          <div className="chef-emoji">👨‍🍳</div>
          <h1>Choose Your Ingredients</h1>
          <p>Click ingredients to add them to your burger!</p>
        </div>

        <div className="ingredient-grid">
          {INGREDIENTS.map(ingredient => (
            <div
              key={ingredient.id}
              className={`ingredient-card ${selectedIngredients.find(item => item.id === ingredient.id) ? 'selected' : ''}`}
              onClick={() => handleIngredientClick(ingredient)}
            >
              <div className="ingredient-emoji">{ingredient.emoji}</div>
              <div className="ingredient-name">{ingredient.name}</div>
              <div className="ingredient-station">
                {ingredient.station === 'cutting' && '🔪 Cut'}
                {ingredient.station === 'grill' && '🔥 Grill'}
                {ingredient.station === 'ready' && '✅ Ready'}
              </div>
            </div>
          ))}
        </div>

        <div className="selection-summary">
          <div className="selected-count">
            Selected: {selectedIngredients.length} ingredients
          </div>
          <button 
            className="start-cooking-btn"
            onClick={goToKitchen}
            disabled={selectedIngredients.length === 0}
          >
            🍳 Start Cooking!
          </button>
        </div>
      </div>
    );
  }

  // KITCHEN SCREEN
  return (
    <div className="simple-kitchen kitchen-mode">
      <button className="back-btn" onClick={() => setCurrentScreen('selection')}>← Back</button>
      
      <div className="header">
        <div className="chef-emoji">🍳</div>
        <h1>Kitchen Workspace</h1>
        <p>Watch your ingredients being prepared!</p>
      </div>

      <div className="kitchen-stations">
        {/* Cutting Board */}
        <div className="station cutting-station">
          <h3>🔪 Cutting Board</h3>
          <div className="station-area">
            {cuttingQueue.length === 0 ? (
              <div className="station-empty">Ready for vegetables</div>
            ) : (
              cuttingQueue.map(ingredient => (
                <div key={ingredient.id} className="processing-item">
                  <div className="processing-emoji">{ingredient.emoji}</div>
                  <div className="processing-name">{ingredient.name}</div>
                  <div className="processing-bar">
                    <div className="progress-fill cutting-progress"></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Grill */}
        <div className="station grill-station">
          <h3>🔥 Grill</h3>
          <div className="station-area">
            {grillQueue.length === 0 ? (
              <div className="station-empty">Ready for meat</div>
            ) : (
              grillQueue.map(ingredient => (
                <div key={ingredient.id} className="processing-item">
                  <div className="processing-emoji">{ingredient.emoji}</div>
                  <div className="processing-name">{ingredient.name}</div>
                  <div className="processing-bar">
                    <div className="progress-fill grill-progress"></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Ready Area */}
        <div className="station ready-station">
          <h3>✅ Ready to Use</h3>
          <div className="station-area">
            {readyIngredients.length === 0 ? (
              <div className="station-empty">Prepared items appear here</div>
            ) : (
              <div className="ready-grid">
                {readyIngredients.map((ingredient, index) => (
                  <div key={`${ingredient.id}-${index}`} className="ready-item">
                    <div className="ready-emoji">{ingredient.emoji}</div>
                    <div className="ready-name">{ingredient.name}</div>
                    <button 
                      className="remove-btn"
                      onClick={() => removeIngredient(ingredient.id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="cooking-summary">
        <div className="progress-info">
          Ready: {readyIngredients.length} / {selectedIngredients.length}
        </div>
        <button 
          className="complete-btn"
          onClick={completeCooking}
          disabled={readyIngredients.length !== selectedIngredients.length}
        >
          🍔 Build My Burger!
        </button>
      </div>
    </div>
  );
}

export default SimpleKitchen;