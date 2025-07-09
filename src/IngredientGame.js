import React, { useState, useRef } from 'react';
import './IngredientGame.css';
import './WorkspaceInterface.css';
import './cooking-game-layout.css';
import KitchenScale from './KitchenScale';
import PortionSelector from './PortionSelector';

// Updated gameData with workspace approach
const gameData = {
  'Burger': {
    emoji: '🍔',
    title: 'Build Your Perfect Burger!',
    instruction: 'Select ingredients and use the workspace to prepare your burger',
    ingredients: [
      // BREAD OPTIONS
      { 
        id: 'white-bun', 
        name: 'White Hamburger Bun', 
        emoji: '🍞', 
        category: 'bread',
        nutrition: { calories: 150, protein: 5, carbs: 28, fat: 2.5 },
        workspaceType: 'direct-use' // Goes straight to plate
      },
      { 
        id: 'wheat-bun', 
        name: 'Whole Wheat Bun', 
        emoji: '🥖', 
        category: 'bread',
        nutrition: { calories: 130, protein: 5, carbs: 24, fat: 2 },
        workspaceType: 'direct-use'
      },
      { 
        id: 'sesame-bun', 
        name: 'Sesame Seed Bun', 
        emoji: '🥯', 
        category: 'bread',
        nutrition: { calories: 160, protein: 6, carbs: 30, fat: 3 },
        workspaceType: 'direct-use'
      },
      
      // PROTEINS - go to scale first
      { 
        id: 'beef-patty', 
        name: 'Beef Patty', 
        emoji: '🥩', 
        category: 'protein',
        nutrition: { calories: 221, protein: 19.4, carbs: 0, fat: 15.9 }, // per 100g
        workspaceType: 'scale',
        minGrams: 80,
        maxGrams: 200,
        defaultGrams: 113,
        maxQuantity: 3
      },
      { 
        id: 'chicken-breast', 
        name: 'Chicken Breast', 
        emoji: '🍗', 
        category: 'protein',
        nutrition: { calories: 164, protein: 31, carbs: 0, fat: 3.6 },
        workspaceType: 'scale',
        minGrams: 80,
        maxGrams: 200,
        defaultGrams: 113,
        maxQuantity: 3
      },
      
      // VEGETABLES - go to cutting board
      { 
        id: 'lettuce', 
        name: 'Lettuce Leaves', 
        emoji: '🥬', 
        category: 'vegetables',
        nutrition: { calories: 0.7, protein: 0.07, carbs: 0.13, fat: 0 }, // per leaf
        workspaceType: 'cutting-board',
        unit: 'leaves',
        defaultAmount: 3,
        minAmount: 1,
        maxAmount: 8
      },
      { 
        id: 'tomato', 
        name: 'Tomato', 
        emoji: '🍅', 
        category: 'vegetables',
        nutrition: { calories: 4, protein: 0.2, carbs: 1, fat: 0 }, // per slice
        workspaceType: 'cutting-board',
        unit: 'slices',
        defaultAmount: 3,
        minAmount: 1,
        maxAmount: 6
      },
      { 
        id: 'onion', 
        name: 'Red Onion', 
        emoji: '🧅', 
        category: 'vegetables',
        nutrition: { calories: 5, protein: 0.1, carbs: 1.2, fat: 0 }, // per slice
        workspaceType: 'cutting-board',
        unit: 'slices',
        defaultAmount: 2,
        minAmount: 1,
        maxAmount: 4
      },
      
      // CHEESE - goes to scale
      { 
        id: 'cheddar', 
        name: 'Cheddar Cheese', 
        emoji: '🧀', 
        category: 'cheese',
        nutrition: { calories: 403, protein: 25, carbs: 3.4, fat: 33 }, // per 100g
        workspaceType: 'scale',
        minGrams: 10,
        maxGrams: 60,
        defaultGrams: 28,
        maxQuantity: 4
      },
      { 
        id: 'swiss', 
        name: 'Swiss Cheese', 
        emoji: '🟡', 
        category: 'cheese',
        nutrition: { calories: 393, protein: 28.4, carbs: 1.4, fat: 31 },
        workspaceType: 'scale',
        minGrams: 10,
        maxGrams: 60,
        defaultGrams: 28,
        maxQuantity: 4
      },
      
      // SAUCES - go to scale
      { 
        id: 'ketchup', 
        name: 'Ketchup', 
        emoji: '🔴', 
        category: 'sauces',
        nutrition: { calories: 112, protein: 1.2, carbs: 27.4, fat: 0.1 }, // per 100g
        workspaceType: 'scale',
        minGrams: 5,
        maxGrams: 30,
        defaultGrams: 15,
        maxQuantity: 2
      },
      { 
        id: 'mayo', 
        name: 'Mayonnaise', 
        emoji: '⚪', 
        category: 'sauces',
        nutrition: { calories: 680, protein: 1, carbs: 0.6, fat: 75 },
        workspaceType: 'scale',
        minGrams: 5,
        maxGrams: 25,
        defaultGrams: 15,
        maxQuantity: 2
      }
    ]
  }
};

function IngredientGame({ foodName, onBack, onComplete }) {
  // Game flow states
  const [currentScreen, setCurrentScreen] = useState('selection'); // 'selection', 'kitchen', 'assembly'
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [preparedIngredients, setPreparedIngredients] = useState([]);
  const [plateItems, setPlateItems] = useState([]);
  
  // Modal states
  const [showScale, setShowScale] = useState(false);
  const [showCuttingBoard, setShowCuttingBoard] = useState(false);
  const [currentIngredient, setCurrentIngredient] = useState(null);
  
  // Dragging state
  const [draggedIngredient, setDraggedIngredient] = useState(null);
  
  const containerRef = useRef(null);
  const foodData = gameData[foodName] || gameData['Burger'];

  // Handle ingredient selection - toggle add/remove from shopping list
  const handleIngredientSelect = ingredient => {
    const isAlreadySelected = selectedIngredients.find(item => item.id === ingredient.id);
    isAlreadySelected
      ? setSelectedIngredients(prev => prev.filter(item => item.id !== ingredient.id))
      : setSelectedIngredients(prev => [...prev, ingredient]);
  };

  // Remove ingredient from selected list
  const removeSelectedIngredient = ingredientId => setSelectedIngredients(prev => prev.filter(item => item.id !== ingredientId));

  // Proceed to kitchen with selected ingredients
  const proceedToKitchen = () => { if (selectedIngredients.length > 0) setCurrentScreen('kitchen'); };

  // Handle drag start in kitchen
  const handleDragStart = (e, ingredient) => {
    setDraggedIngredient(ingredient);
  };

  // Handle drag over workspace areas
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle drop on cutting board
  const handleDropOnCuttingBoard = e => {
    e.preventDefault();
    if (draggedIngredient && draggedIngredient.workspaceType === 'cutting-board') {
      setCurrentIngredient(draggedIngredient);
      setShowCuttingBoard(true);
    }
    setDraggedIngredient(null);
  };

  // Handle drop on scale
  const handleDropOnScale = e => {
    e.preventDefault();
    if (draggedIngredient && draggedIngredient.workspaceType === 'scale') {
      setCurrentIngredient(draggedIngredient);
      setShowScale(true);
    }
    setDraggedIngredient(null);
  };

  // Handle preparation completion
  const handlePreparationComplete = result => {
    setPreparedIngredients(prev => [...prev, result]);
    setSelectedIngredients(prev => prev.filter(item => item.id !== result.id));
    setShowScale(false);
    setShowCuttingBoard(false);
    setCurrentIngredient(null);
  };

  // Proceed to assembly when all ingredients are prepared
  const proceedToAssembly = () => setCurrentScreen('assembly');

  // Add ingredient to final burger
  const addToBurger = ingredient => {
    setPlateItems(prev => [...prev, { ...ingredient, platePosition: prev.length }]);
    setPreparedIngredients(prev => prev.filter(item => item !== ingredient));
  };

  // Remove from burger
  const removeFromBurger = index => {
    const removedItem = plateItems[index];
    setPreparedIngredients(prev => [...prev, removedItem]);
    setPlateItems(prev => prev.filter((_, i) => i !== index));
  };

  // Calculate total nutrition (hidden from user)
  const calculateTotalNutrition = () => {
    let totalNutrition = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    plateItems.forEach(item => {
      const amount = item.selectedAmount, quantity = item.selectedQuantity || 1, nutrition = item.nutrition;
      if (item.workspaceType === 'scale') {
        const factor = (amount * quantity) / 100;
        totalNutrition.calories += nutrition.calories * factor;
        totalNutrition.protein += nutrition.protein * factor;
        totalNutrition.carbs += nutrition.carbs * factor;
        totalNutrition.fat += nutrition.fat * factor;
      } else {
        totalNutrition.calories += nutrition.calories * amount;
        totalNutrition.protein += nutrition.protein * amount;
        totalNutrition.carbs += nutrition.carbs * amount;
        totalNutrition.fat += nutrition.fat * amount;
      }
    });
    return {
      calories: Math.round(totalNutrition.calories),
      protein: Math.round(totalNutrition.protein * 10) / 10,
      carbs: Math.round(totalNutrition.carbs * 10) / 10,
      fat: Math.round(totalNutrition.fat * 10) / 10
    };
  };

  // Complete burger building
  const completeBurger = () => onComplete && onComplete({ plateItems, totalNutrition: calculateTotalNutrition(), ingredientCount: plateItems.length });

  // INGREDIENT SELECTION SCREEN
  if (currentScreen === 'selection') {
    return (
      <div className="ingredient-game selection-screen" ref={containerRef}>
        <button className="back-button" onClick={onBack}>←</button>
        
        <div className="workspace-header">
          <div className="food-display">{foodData.emoji}</div>
          <h1>Select Your Ingredients</h1>
          <p>Choose all the ingredients you want for your {foodName.toLowerCase()}</p>
        </div>

        <div className="ingredient-selection-container">
          <div className="available-ingredients">
            <h3>🥘 Available Ingredients</h3>
            <div className="ingredient-grid">
              {foodData.ingredients.map(ingredient => (
                <div
                  key={ingredient.id}
                  className={`ingredient-card ${selectedIngredients.find(item => item.id === ingredient.id) ? 'selected' : ''}`}
                  data-category={ingredient.category}
                  onClick={() => handleIngredientSelect(ingredient)}
                >
                  <span className="ingredient-emoji-large">{ingredient.emoji}</span>
                  <span className="ingredient-name-small">{ingredient.name}</span>
                  <span className="ingredient-category">{ingredient.category}</span>
                </div>
              ))}
              
              {/* Add Ingredients Button */}
              <div
                className="ingredient-card add-ingredients-button"
                onClick={() => {
                  // TODO: Open full ingredient library modal
                  console.log('Opening full ingredient library...');
                }}
              >
                <span className="add-ingredients-icon">➕</span>
                <span className="add-ingredients-text">Add More Ingredients</span>
                <span className="add-ingredients-subtitle">Full Library</span>
              </div>
            </div>
          </div>

          <div className="shopping-cart">
            <h3>🛒 Selected Ingredients ({selectedIngredients.length})</h3>
            <div className="selected-list">
              {selectedIngredients.length === 0 ? (
                <div className="empty-cart">
                  <span>Select ingredients to add them here</span>
                </div>
              ) : (
                selectedIngredients.map(ingredient => (
                  <div key={ingredient.id} className="selected-item">
                    <span className="item-emoji">{ingredient.emoji}</span>
                    <span className="item-name">{ingredient.name}</span>
                    <button 
                      className="remove-btn"
                      onClick={() => removeSelectedIngredient(ingredient.id)}
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
            
            <button 
              className="proceed-btn"
              onClick={proceedToKitchen}
              disabled={selectedIngredients.length === 0}
            >
              👨‍🍳 Go to Kitchen ({selectedIngredients.length})
            </button>
          </div>
        </div>
      </div>
    );
  }

  // KITCHEN WORKSPACE SCREEN
  if (currentScreen === 'kitchen') {
    return (
      <div className="ingredient-game kitchen-screen" ref={containerRef}>
        <button className="back-button" onClick={() => setCurrentScreen('selection')}>←</button>
        
        <div className="workspace-header">
          <div className="food-display">👨‍🍳</div>
          <h1>Prepare Your Ingredients</h1>
          <p>Drag ingredients to the cutting board or scale to prepare them</p>
        </div>

        {/* Ingredient Display Bar - Game-like visual inventory */}
        <div className="ingredient-display-bar">
          <h3>🎒 Your Ingredient Inventory</h3>
          <div className="ingredient-icons-row">
            {selectedIngredients.map(ingredient => (
              <div
                key={ingredient.id}
                className={`inventory-ingredient ${ingredient.workspaceType}`}
                draggable
                onDragStart={e => handleDragStart(e, ingredient)}
                title={`${ingredient.name} - ${ingredient.workspaceType === 'scale' ? 'Drag to Scale ⚖️' : ingredient.workspaceType === 'cutting-board' ? 'Drag to Cutting Board 🔪' : 'Ready to Use ✅'}`}
              >
                <div className="ingredient-icon-large">{ingredient.emoji}</div>
                <div className="ingredient-type-indicator">
                  {ingredient.workspaceType === 'scale' ? '⚖️' : ingredient.workspaceType === 'cutting-board' ? '🔪' : '✅'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="kitchen-workspace">
          <div className="workspace-stations">
            <div 
              className="cutting-board-area"
              onDragOver={handleDragOver}
              onDrop={handleDropOnCuttingBoard}
            >
              <h3>🔪 Cutting Board</h3>
              <div className="cutting-board-surface">
                <div className="cutting-board-hint">
                  <span className="board-emoji">🔪</span>
                </div>
              </div>
            </div>
            <div 
              className="scale-area"
              onDragOver={handleDragOver}
              onDrop={handleDropOnScale}
            >
              <h3>⚖️ Kitchen Scale</h3>
              <div className="scale-surface">
                <div className="aesthetic-scale">
                  <svg width="90" height="120" viewBox="0 0 90 120">
                    <ellipse cx="45" cy="110" rx="38" ry="10" fill="#222" opacity="0.25"/>
                    <rect x="15" y="60" width="60" height="30" rx="15" fill="#e0e0e0" stroke="#bbb" strokeWidth="2"/>
                    <ellipse cx="45" cy="60" rx="35" ry="18" fill="#f5f5f5" stroke="#bbb" strokeWidth="2"/>
                    <circle cx="45" cy="60" r="8" fill="#fff" stroke="#bbb" strokeWidth="2"/>
                    <rect x="38" y="25" width="14" height="35" rx="7" fill="#bbb"/>
                    <rect x="41" y="10" width="8" height="20" rx="4" fill="#888"/>
                    <polygon points="45,60 45,30 48,38 45,60" fill="#f44336"/>
                  </svg>
                  <div className="scale-dial-label">kg</div>
                </div>
                <div className="scale-hint">
                  <span className="scale-emoji">⚖️</span>
                </div>
              </div>
            </div>
          </div>
          <div className="prepared-ingredients">
            <h3>✅ Prepared Ingredients</h3>
            <div className="prepared-list">
              {preparedIngredients.length === 0 ? (
                <div className="no-prepared">
                  <span>Prepared ingredients will appear here</span>
                </div>
              ) : (
                preparedIngredients.map((ingredient, index) => (
                  <div key={index} className="prepared-item">
                    <span className="item-emoji">{ingredient.emoji}</span>
                    <span className="item-name">{ingredient.name}</span>
                    <span className="item-amount">{ingredient.selectedUnit}</span>
                  </div>
                ))
              )}
            </div>
            
            <button 
              className="proceed-btn"
              onClick={proceedToAssembly}
              disabled={selectedIngredients.length > 0}
            >
              🍽️ Assemble Burger ({preparedIngredients.length})
            </button>
          </div>
        </div>

        {/* Modals */}
        {showScale && currentIngredient && (
          <KitchenScale
            ingredient={currentIngredient}
            onScaleComplete={handlePreparationComplete}
            onCancel={() => {
              setShowScale(false);
              setCurrentIngredient(null);
            }}
          />
        )}

        {showCuttingBoard && currentIngredient && (
          <PortionSelector
            ingredient={currentIngredient}
            onPortionComplete={handlePreparationComplete}
            onCancel={() => {
              setShowCuttingBoard(false);
              setCurrentIngredient(null);
            }}
            hideNutrition={true}
          />
        )}
      </div>
    );
  }

  // BURGER ASSEMBLY SCREEN
  if (currentScreen === 'assembly') {
    return (
      <div className="ingredient-game assembly-screen" ref={containerRef}>
        <button className="back-button" onClick={() => setCurrentScreen('kitchen')}>←</button>
        
        <div className="workspace-header">
          <div className="food-display">🍽️</div>
          <h1>Assemble Your Burger</h1>
          <p>Click ingredients to add them to your burger, build it layer by layer!</p>
        </div>

        <div className="assembly-workspace">
          <div className="available-prepared">
            <h3>✅ Prepared Ingredients</h3>
            <div className="prepared-grid">
              {preparedIngredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="prepared-ingredient-card"
                  onClick={() => addToBurger(ingredient)}
                >
                  <span className="ingredient-emoji-large">{ingredient.emoji}</span>
                  <span className="ingredient-name-small">{ingredient.name}</span>
                  <span className="ingredient-amount">{ingredient.selectedUnit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="burger-assembly">
            <h3>🍔 Your Burger</h3>
            <div className="burger-plate">
              {plateItems.length === 0 ? (
                <div className="plate-empty">
                  <span className="plate-icon">🍽️</span>
                  <p>Click ingredients to start building</p>
                </div>
              ) : (
                <div className="burger-stack">
                  {plateItems.map((item, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="burger-layer"
                      style={{ bottom: `${index * 25}px`, zIndex: plateItems.length - index }}
                      onClick={() => removeFromBurger(index)}
                    >
                      <span className="layer-emoji">{item.emoji}</span>
                      <div className="layer-info">
                        <span className="layer-name">{item.name}</span>
                        {item.selectedUnit && <span className="layer-amount">{item.selectedUnit}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="assembly-controls">
              <div className="burger-stats">
                <span>{plateItems.length} layers</span>
              </div>
              <button 
                className="complete-burger"
                onClick={completeBurger}
                disabled={plateItems.length < 2}
              >
                🏁 Complete Burger!
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default IngredientGame;
