import React, { useState, useCallback } from 'react';
import './KitchenScale.css';

const KitchenScale = ({ 
  ingredient, 
  onScaleComplete, 
  onCancel 
}) => {
  const [currentWeight, setCurrentWeight] = useState(ingredient.defaultGrams || 100);
  const [isWeighing, setIsWeighing] = useState(false);

  const minWeight = ingredient.minGrams || 10;
  const maxWeight = ingredient.maxGrams || 500;

  // Handle weight change with visual feedback
  const handleWeightChange = useCallback((newWeight) => {
    const clampedWeight = Math.max(minWeight, Math.min(maxWeight, newWeight));
    setCurrentWeight(clampedWeight);
    
    // Trigger weighing animation
    setIsWeighing(true);
    setTimeout(() => setIsWeighing(false), 300);
  }, [minWeight, maxWeight]);

  // Handle scale completion
  const handleComplete = useCallback(() => {
    const result = {
      ...ingredient,
      selectedAmount: currentWeight,
      selectedUnit: 'grams'
    };
    onScaleComplete(result);
  }, [ingredient, currentWeight, onScaleComplete]);

  // Get ingredient visual properties
  const getIngredientVisual = () => {
    const ingredientId = ingredient.id.toLowerCase();
    
    const visualMap = {
      'beef-patty': { emoji: '🥩', color: '#8b0000', shape: 'patty' },
      'chicken-breast': { emoji: '🍗', color: '#deb887', shape: 'patty' },
      'black-bean-patty': { emoji: '🫘', color: '#2f4f2f', shape: 'patty' },
      'fish-fillet': { emoji: '🐟', color: '#ffa500', shape: 'patty' },
      'cheddar': { emoji: '🧀', color: '#ffa500', shape: 'slice' },
      'swiss': { emoji: '🟡', color: '#ffff99', shape: 'slice' },
      'american': { emoji: '🟨', color: '#ffff66', shape: 'slice' },
      'ketchup': { emoji: '🔴', color: '#dc143c', shape: 'sauce' },
      'mustard': { emoji: '🟡', color: '#ffdb58', shape: 'sauce' },
      'mayo': { emoji: '⚪', color: '#f5f5dc', shape: 'sauce' },
      'bbq-sauce': { emoji: '🟤', color: '#8b4513', shape: 'sauce' }
    };

    return visualMap[ingredientId] || {
      emoji: ingredient.emoji || '🥗',
      color: '#808080',
      shape: 'generic'
    };
  };

  const visual = getIngredientVisual();
  
  // Calculate scale platform tilt based on weight
  const getTiltAngle = () => {
    const weightRatio = currentWeight / maxWeight;
    return weightRatio * 3; // Max 3 degrees tilt
  };

  // Get recommended weight ranges
  const getWeightStatus = () => {
    const third = (maxWeight - minWeight) / 3;
    if (currentWeight < minWeight + third) return 'light';
    if (currentWeight < minWeight + (third * 2)) return 'medium';
    return 'heavy';
  };

  return (
    <div className="kitchen-scale-overlay">
      <div className="kitchen-scale-interface">
        {/* Header */}
        <div className="scale-header">
          <h2>⚖️ Weigh Your {ingredient.name}</h2>
          <p>Use the scale to measure the perfect amount</p>
        </div>

        {/* Scale Container */}
        <div className="scale-container">
          <div className="scale-base">
            {/* Digital Display */}
            <div className="digital-display">
              <div className="display-screen">
                <span className="weight-number">{currentWeight}</span>
                <span className="weight-unit">g</span>
              </div>
              <div className="display-indicators">
                <div className={`status-light ${getWeightStatus()}`}></div>
                <span className="status-text">{getWeightStatus()}</span>
              </div>
            </div>

            {/* Scale Platform */}
            <div 
              className={`scale-platform ${isWeighing ? 'weighing' : ''}`}
              style={{
                transform: `rotate(${getTiltAngle()}deg)`,
              }}
            >
              {/* Ingredient on Scale */}
              <div 
                className={`scale-ingredient ${visual.shape}`}
                style={{
                  backgroundColor: visual.color,
                  transform: `scale(${0.5 + (currentWeight / maxWeight) * 0.8})` // Size based on weight
                }}
              >
                <span className="scale-ingredient-emoji">{visual.emoji}</span>
              </div>

              {/* Platform Grid */}
              <div className="platform-grid"></div>
            </div>

            {/* Scale Arms */}
            <div className="scale-arm left-arm"></div>
            <div className="scale-arm right-arm"></div>
          </div>

          {/* Weight Controls */}
          <div className="weight-controls">
            <div className="weight-slider-container">
              <label>Adjust Weight:</label>
              <input
                type="range"
                min={minWeight}
                max={maxWeight}
                step="1"
                value={currentWeight}
                onChange={(e) => handleWeightChange(parseInt(e.target.value))}
                className="weight-slider"
              />
              <div className="weight-range">
                <span>{minWeight}g</span>
                <span>{maxWeight}g</span>
              </div>
            </div>

            <div className="quick-weights">
              <button 
                className="quick-weight-btn"
                onClick={() => handleWeightChange(minWeight)}
              >
                Light ({minWeight}g)
              </button>
              <button 
                className="quick-weight-btn"
                onClick={() => handleWeightChange(Math.round((minWeight + maxWeight) / 2))}
              >
                Medium ({Math.round((minWeight + maxWeight) / 2)}g)
              </button>
              <button 
                className="quick-weight-btn"
                onClick={() => handleWeightChange(maxWeight)}
              >
                Heavy ({maxWeight}g)
              </button>
            </div>

            <div className="precision-controls">
              <button 
                className="precision-btn"
                onClick={() => handleWeightChange(currentWeight - 10)}
                disabled={currentWeight <= minWeight}
              >
                -10g
              </button>
              <button 
                className="precision-btn"
                onClick={() => handleWeightChange(currentWeight - 1)}
                disabled={currentWeight <= minWeight}
              >
                -1g
              </button>
              <button 
                className="precision-btn"
                onClick={() => handleWeightChange(currentWeight + 1)}
                disabled={currentWeight >= maxWeight}
              >
                +1g
              </button>
              <button 
                className="precision-btn"
                onClick={() => handleWeightChange(currentWeight + 10)}
                disabled={currentWeight >= maxWeight}
              >
                +10g
              </button>
            </div>
          </div>
        </div>

        {/* Weight Information */}
        <div className="weight-info">
          <div className="current-selection">
            <h3>Current Selection:</h3>
            <div className="selection-display">
              <span className="selection-emoji">{visual.emoji}</span>
              <span className="selection-name">{ingredient.name}</span>
              <span className="selection-weight">{currentWeight}g</span>
            </div>
          </div>

          <div className="weight-guide">
            <h4>Weight Guide:</h4>
            <div className="guide-items">
              <div className="guide-item light">
                <span className="guide-emoji">🪶</span>
                <span>Light: {minWeight}-{Math.round(minWeight + (maxWeight - minWeight) / 3)}g</span>
              </div>
              <div className="guide-item medium">
                <span className="guide-emoji">⚖️</span>
                <span>Medium: {Math.round(minWeight + (maxWeight - minWeight) / 3)}-{Math.round(minWeight + ((maxWeight - minWeight) * 2) / 3)}g</span>
              </div>
              <div className="guide-item heavy">
                <span className="guide-emoji">🏋️</span>
                <span>Heavy: {Math.round(minWeight + ((maxWeight - minWeight) * 2) / 3)}-{maxWeight}g</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="scale-controls">
          <button className="cancel-scale" onClick={onCancel}>
            ❌ Cancel
          </button>
          
          <button className="reset-scale" onClick={() => handleWeightChange(ingredient.defaultGrams || 100)}>
            🔄 Reset to Default
          </button>
          
          <button 
            className="confirm-weight" 
            onClick={handleComplete}
          >
            ✅ Use {currentWeight}g
          </button>
        </div>

        {/* Instructions */}
        <div className="scale-instructions">
          <div className="instruction-item">
            <span className="instruction-icon">🎛️</span>
            <span>Use the slider or buttons to adjust weight</span>
          </div>
          <div className="instruction-item">
            <span className="instruction-icon">⚖️</span>
            <span>Watch the scale platform tilt with weight</span>
          </div>
          <div className="instruction-item">
            <span className="instruction-icon">📱</span>
            <span>Digital display shows exact grams</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenScale;