import React, { useState, useCallback } from 'react';
import './PortionSelector.css';

const PortionSelector = ({ 
  ingredient, 
  onPortionComplete, 
  onCancel,
  hideNutrition = false // New prop to hide nutrition info
}) => {
  const [selectedQuantity, setSelectedQuantity] = useState(ingredient.defaultAmount || 1);
  const [selectedPortions, setSelectedPortions] = useState([]);

  // Calculate nutrition for selected quantity (but don't show if hideNutrition is true)
  const calculateNutrition = useCallback((quantity) => {
    return {
      calories: Math.round(ingredient.nutrition.calories * quantity),
      protein: Math.round(ingredient.nutrition.protein * quantity * 10) / 10,
      carbs: Math.round(ingredient.nutrition.carbs * quantity * 10) / 10,
      fat: Math.round(ingredient.nutrition.fat * quantity * 10) / 10
    };
  }, [ingredient.nutrition]);

  const selectedNutrition = calculateNutrition(selectedQuantity);

  // Handle quantity change
  const handleQuantityChange = useCallback((newQuantity) => {
    const min = ingredient.minAmount || 1;
    const max = ingredient.maxAmount || 10;
    const step = 1;
    
    const clampedQuantity = Math.max(min, Math.min(max, newQuantity));
    const steppedQuantity = Math.round(clampedQuantity / step) * step;
    
    setSelectedQuantity(steppedQuantity);
  }, [ingredient.minAmount, ingredient.maxAmount]);

  // Handle adding portions to visual display
  const addPortion = useCallback(() => {
    const newPortion = {
      id: Date.now(),
      quantity: selectedQuantity,
      unit: ingredient.unit || 'pieces',
      nutrition: calculateNutrition(selectedQuantity),
      x: 150 + Math.random() * 200, // Random position on plate
      y: 150 + Math.random() * 200,
      rotation: Math.random() * 30 - 15
    };
    
    setSelectedPortions(prev => [...prev, newPortion]);
  }, [selectedQuantity, ingredient.unit, calculateNutrition]);

  // Remove portion from visual display
  const removePortion = useCallback((portionId) => {
    setSelectedPortions(prev => prev.filter(p => p.id !== portionId));
  }, []);

  // Complete portion selection
  const handleComplete = useCallback(() => {
    if (selectedPortions.length === 0) return;
    
    const totalQuantity = selectedPortions.reduce((sum, p) => sum + p.quantity, 0);
    const totalNutrition = selectedPortions.reduce((acc, p) => ({
      calories: acc.calories + p.nutrition.calories,
      protein: acc.protein + p.nutrition.protein,
      carbs: acc.carbs + p.nutrition.carbs,
      fat: acc.fat + p.nutrition.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

    const result = {
      ...ingredient,
      selectedAmount: totalQuantity,
      selectedUnit: ingredient.unit || 'pieces',
      actualNutrition: {
        calories: Math.round(totalNutrition.calories),
        protein: Math.round(totalNutrition.protein * 10) / 10,
        carbs: Math.round(totalNutrition.carbs * 10) / 10,
        fat: Math.round(totalNutrition.fat * 10) / 10
      },
      portionData: {
        totalPortions: selectedPortions.length,
        individualPortions: selectedPortions.map(p => ({ quantity: p.quantity, unit: p.unit }))
      }
    };

    onPortionComplete(result);
  }, [selectedPortions, ingredient, onPortionComplete]);

  // Get ingredient visual properties
  const getIngredientVisual = () => {
    const ingredientId = ingredient.id.toLowerCase();
    
    const visualMap = {
      'lettuce': { emoji: '🥬', color: '#2ecc71', shape: 'circle' },
      'tomato': { emoji: '🍅', color: '#e74c3c', shape: 'circle' },
      'onion': { emoji: '🧅', color: '#f39c12', shape: 'circle' },
      'pickles': { emoji: '🥒', color: '#2ecc71', shape: 'circle' },
      'avocado': { emoji: '🥑', color: '#27ae60', shape: 'circle' }
    };

    return visualMap[ingredientId] || {
      emoji: ingredient.emoji || '🥗',
      color: '#3498db',
      shape: 'circle'
    };
  };

  const visual = getIngredientVisual();
  const unit = ingredient.unit || 'pieces';
  const min = ingredient.minAmount || 1;
  const max = ingredient.maxAmount || 10;

  return (
    <div className="portion-selector-overlay">
      <div className="portion-selector-interface">
        {/* Header */}
        <div className="portion-header">
          <h2>🍽️ Add {ingredient.name}</h2>
          <p>Choose how much {ingredient.name} you want to add</p>
          {hideNutrition && (
            <div className="no-nutrition-notice">
              <span>🎮 Nutrition hidden for the game!</span>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="portion-workspace">
          {/* Ingredient Control Panel */}
          <div className="ingredient-controls">
            <div className="ingredient-display">
              <div className={`ingredient-visual ${visual.shape}`} style={{ backgroundColor: visual.color }}>
                <span className="ingredient-emoji-display">{visual.emoji}</span>
              </div>
              <h3>{ingredient.name}</h3>
            </div>

            {/* Quantity Selector */}
            <div className="quantity-selector">
              <label>Amount:</label>
              <div className="quantity-controls">
                <button 
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(selectedQuantity - 1)}
                  disabled={selectedQuantity <= min}
                >
                  −
                </button>
                <span className="quantity-display">
                  {selectedQuantity} {unit}
                </span>
                <button 
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(selectedQuantity + 1)}
                  disabled={selectedQuantity >= max}
                >
                  +
                </button>
              </div>
              
              {/* Range Slider */}
              <input
                type="range"
                min={min}
                max={max}
                step="1"
                value={selectedQuantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                className="quantity-slider"
              />
            </div>

            {/* Nutrition Preview - Only show if hideNutrition is false */}
            {!hideNutrition && (
              <div className="nutrition-preview">
                <h4>Nutrition for {selectedQuantity} {unit}:</h4>
                <div className="nutrition-grid">
                  <div className="nutrition-item">
                    <span className="nutrition-icon">🔥</span>
                    <span className="nutrition-value">{selectedNutrition.calories}</span>
                    <span className="nutrition-label">cal</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-icon">💪</span>
                    <span className="nutrition-value">{selectedNutrition.protein}g</span>
                    <span className="nutrition-label">protein</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-icon">🌾</span>
                    <span className="nutrition-value">{selectedNutrition.carbs}g</span>
                    <span className="nutrition-label">carbs</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-icon">🥑</span>
                    <span className="nutrition-value">{selectedNutrition.fat}g</span>
                    <span className="nutrition-label">fat</span>
                  </div>
                </div>
              </div>
            )}

            <button className="add-portion-btn" onClick={addPortion}>
              ➕ Add to Plate
            </button>
          </div>

          {/* Visual Plate Display */}
          <div className="plate-area">
            <h3>🍽️ Your Portions</h3>
            <div className="plate">
              {selectedPortions.length === 0 ? (
                <div className="empty-plate">
                  <span className="plate-emoji">🍽️</span>
                  <p>Add portions to see them here</p>
                </div>
              ) : (
                selectedPortions.map((portion, index) => (
                  <div
                    key={portion.id}
                    className={`plate-portion ${visual.shape}`}
                    style={{
                      left: portion.x,
                      top: portion.y,
                      transform: `rotate(${portion.rotation}deg)`,
                      backgroundColor: visual.color,
                      zIndex: index + 1
                    }}
                    onClick={() => removePortion(portion.id)}
                  >
                    <span className="portion-emoji">{visual.emoji}</span>
                    <div className="portion-info">
                      <span>{portion.quantity} {portion.unit}</span>
                    </div>
                    <div className="remove-hint">Click to remove</div>
                  </div>
                ))
              )}
            </div>

            {/* Total Summary */}
            {selectedPortions.length > 0 && (
              <div className="portion-summary">
                <h4>Total Selected:</h4>
                <div className="summary-stats">
                  <div className="summary-item">
                    <strong>{selectedPortions.reduce((sum, p) => sum + p.quantity, 0)} {unit}</strong>
                  </div>
                  {!hideNutrition && (
                    <div className="summary-item">
                      <strong>{selectedPortions.reduce((sum, p) => sum + p.nutrition.calories, 0)} calories</strong>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="portion-controls">
          <button className="cancel-btn" onClick={onCancel}>
            ❌ Cancel
          </button>
          
          <button 
            className="complete-btn" 
            onClick={handleComplete}
            disabled={selectedPortions.length === 0}
          >
            ✅ Use Selected ({selectedPortions.length})
          </button>
        </div>

        {/* Instructions */}
        <div className="portion-instructions">
          <div className="instruction-item">
            <span className="instruction-icon">🔢</span>
            <span>Adjust the amount using + / - buttons or slider</span>
          </div>
          <div className="instruction-item">
            <span className="instruction-icon">➕</span>
            <span>Click "Add to Plate" to add portions</span>
          </div>
          <div className="instruction-item">
            <span className="instruction-icon">🗑️</span>
            <span>Click portions on the plate to remove them</span>
          </div>
          {hideNutrition && (
            <div className="instruction-item game-mode">
              <span className="instruction-icon">🎮</span>
              <span>Nutrition info hidden - guess the calories at the end!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortionSelector;