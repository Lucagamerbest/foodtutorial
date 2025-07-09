import React, { useState } from 'react';
import './Nutrition.css';

function Nutrition({ onBack, onFoodSelect }) {
  const [showOptions, setShowOptions] = useState(false),
    [searchValue, setSearchValue] = useState(''),
    [selectedCategories, setSelectedCategories] = useState([]),
    [expandedCategories, setExpandedCategories] = useState([]);

  const handleBackClick = () => onBack ? onBack() : console.log('Back button clicked - please provide onBack prop');
  const handleFoodItemClick = food => onFoodSelect && onFoodSelect(food.name);
  const foodOptions = [
    { name: 'Spaghetti', emoji: '🍝' },
    { name: 'Burger', emoji: '🍔' },
    { name: 'Pizza', emoji: '🍕' },
    { name: 'Sandwich', emoji: '🥪' },
    { name: 'Soup', emoji: '🍲' }
  ];
  const categoryFoods = {
    Breakfast: [
      { name: 'Omelette', emoji: '🍳' },
      { name: 'Pancakes', emoji: '🥞' },
      { name: 'Toast', emoji: '🍞' },
      { name: 'Cereal', emoji: '🥣' },
      { name: 'Bagel', emoji: '🥯' },
      { name: 'Waffle', emoji: '🧇' }
    ],
    Dinner: [
      { name: 'Steak', emoji: '🥩' },
      { name: 'Chicken', emoji: '🍗' },
      { name: 'Fish', emoji: '🐟' },
      { name: 'Pasta', emoji: '🍝' },
      { name: 'Rice Bowl', emoji: '🍚' },
      { name: 'Salad', emoji: '🥗' }
    ],
    Supper: [
      { name: 'Soup', emoji: '🍲' },
      { name: 'Sandwich', emoji: '🥪' },
      { name: 'Leftovers', emoji: '🍱' },
      { name: 'Snack Mix', emoji: '🥨' },
      { name: 'Light Meal', emoji: '🍽️' },
      { name: 'Tea & Biscuits', emoji: '🍪' }
    ],
    Dessert: [
      { name: 'Ice Cream', emoji: '🍦' },
      { name: 'Cake', emoji: '🍰' },
      { name: 'Cookies', emoji: '🍪' },
      { name: 'Chocolate', emoji: '🍫' },
      { name: 'Pie', emoji: '🥧' },
      { name: 'Donut', emoji: '🍩' }
    ]
  };
  const handleSearchFocus = () => { setShowOptions(true); setExpandedCategories([]); };
  const handleSearchBlur = () => setTimeout(() => setShowOptions(false), 200);
  const handleOptionClick = food => handleFoodItemClick(food);
  const handleCategoryClick = categoryName => {
    if (categoryName === 'Custom') {
      setSelectedCategories(selectedCategories.includes(categoryName) ? selectedCategories.filter(cat => cat !== categoryName) : [...selectedCategories, categoryName]);
    } else {
      let newSelectedCategories = selectedCategories.includes(categoryName) ? selectedCategories.filter(cat => cat !== categoryName) : [...selectedCategories, categoryName];
      setSelectedCategories(newSelectedCategories);
      let newExpandedCategories;
      if (expandedCategories.includes(categoryName)) {
        newExpandedCategories = expandedCategories.filter(cat => cat !== categoryName);
      } else {
        newExpandedCategories = [...expandedCategories, categoryName];
        setTimeout(() => {
          const expandedElements = document.querySelectorAll('.expanded-foods');
          const lastExpanded = expandedElements[expandedElements.length - 1];
          if (lastExpanded) lastExpanded.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        }, 300);
      }
      setExpandedCategories(newExpandedCategories);
    }
    setShowOptions(false);
  };
  const handleCategoryFoodClick = food => handleFoodItemClick(food);
  const isSearching = showOptions;

  return (
    <div className="nutrition-page">
      <button className="back-button" onClick={handleBackClick}>
        ←
      </button>
      
      <div className="search-container">
        <div className="search-icon">🔍</div>
        <input 
          type="text" 
          className="search-bar" 
          placeholder="Search for food nutrition info..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
        />
        
        {showOptions && (
          <div className="search-options">
            {foodOptions.map((food, index) => (
              <div key={index} className="search-option" onClick={() => handleOptionClick(food)}>
                <span className="food-emoji">{food.emoji}</span>
                <span className="food-name">{food.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={`category-buttons ${isSearching ? 'searching' : ''}`}>
        {/* Normal layout: 2-2-1 structure */}
        {/* Row 1: Breakfast & Dinner */}
        <div className="category-row">
          <div className="category-section">
            <button
              className={`category-btn ${selectedCategories.includes('Breakfast') ? 'active' : ''}`}
              onClick={() => handleCategoryClick('Breakfast')}
            >
              <span className="category-emoji">🌅</span>
              <span className="category-name">Breakfast</span>
            </button>
            {expandedCategories.includes('Breakfast') && (
              <div className="expanded-foods">
                {categoryFoods.Breakfast.map((food, index) => (
                  <div key={index} className="food-item" onClick={() => handleCategoryFoodClick(food)}>
                    <span className="food-emoji">{food.emoji}</span>
                    <span className="food-name">{food.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="category-section">
            <button
              className={`category-btn ${selectedCategories.includes('Dinner') ? 'active' : ''}`}
              onClick={() => handleCategoryClick('Dinner')}
            >
              <span className="category-emoji">🍽️</span>
              <span className="category-name">Dinner</span>
            </button>
            {expandedCategories.includes('Dinner') && (
              <div className="expanded-foods">
                {categoryFoods.Dinner.map((food, index) => (
                  <div key={index} className="food-item" onClick={() => handleCategoryFoodClick(food)}>
                    <span className="food-emoji">{food.emoji}</span>
                    <span className="food-name">{food.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Supper & Dessert */}
        <div className="category-row">
          <div className="category-section">
            <button
              className={`category-btn ${selectedCategories.includes('Supper') ? 'active' : ''}`}
              onClick={() => handleCategoryClick('Supper')}
            >
              <span className="category-emoji">🌙</span>
              <span className="category-name">Supper</span>
            </button>
            {expandedCategories.includes('Supper') && (
              <div className="expanded-foods">
                {categoryFoods.Supper.map((food, index) => (
                  <div key={index} className="food-item" onClick={() => handleCategoryFoodClick(food)}>
                    <span className="food-emoji">{food.emoji}</span>
                    <span className="food-name">{food.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="category-section">
            <button
              className={`category-btn ${selectedCategories.includes('Dessert') ? 'active' : ''}`}
              onClick={() => handleCategoryClick('Dessert')}
            >
              <span className="category-emoji">🍰</span>
              <span className="category-name">Dessert</span>
            </button>
            {expandedCategories.includes('Dessert') && (
              <div className="expanded-foods">
                {categoryFoods.Dessert.map((food, index) => (
                  <div key={index} className="food-item" onClick={() => handleCategoryFoodClick(food)}>
                    <span className="food-emoji">{food.emoji}</span>
                    <span className="food-name">{food.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Row 3: Custom (full width) */}
        <div className="category-row custom-row">
          <button
            className={`category-btn custom-btn ${selectedCategories.includes('Custom') ? 'active' : ''}`}
            onClick={() => handleCategoryClick('Custom')}
          >
            <span className="category-emoji">⭐</span>
            <span className="category-name">Custom</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Nutrition;