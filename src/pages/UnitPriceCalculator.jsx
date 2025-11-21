import { useState } from 'react';
import Ingredients from './unit-price-calculator/components/Ingredients.jsx';
import Recipes from './unit-price-calculator/components/Recipes.jsx';
import './UnitPriceCalculator.css';

function UnitPriceCalculator() {
  const [ingredients, setIngredients] = useState([]);

  const handleIngredientsUpdate = (updatedIngredients) => {
    setIngredients(updatedIngredients);
  };

  return (
    <>
      <header className="topbar">
        <h1 className="title">빵 단가 계산기</h1>
        <p className="subtitle">재료 등록 → 레시피 등록 → 개당 단가 계산</p>
      </header>

      <main className="container">
        <section className="unit-price-grid">
          <Ingredients onUpdate={handleIngredientsUpdate} />
          <Recipes ingredients={ingredients} />
        </section>
      </main>
    </>
  );
}

export default UnitPriceCalculator;
