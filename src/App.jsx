import { useState } from 'react'
import './App.css'
import Ingredients from './components/Ingredients.jsx'
import Recipes from './components/Recipes.jsx'

function App() {
  const [ingredients, setIngredients] = useState([])

  const handleIngredientsUpdate = (updatedIngredients) => {
    setIngredients(updatedIngredients)
  }

  return (
    <>
      <header className="topbar">
        <h1 className="title">빵 단가 계산기</h1>
        <p className="subtitle">재료 등록 → 레시피 등록 → 개당 단가 계산</p>
      </header>

      <main className="container">
        <section className="grid">
          <Ingredients onUpdate={handleIngredientsUpdate} />
          <Recipes ingredients={ingredients} />
        </section>

        {/* <section className="card info">
          <h3>유용한 팁</h3>
          <ul>
            <li>재료는 g 단위로 입력하세요.</li>
            <li>가격은 해당 구매량 전체의 가격(원)으로 입력하세요.</li>
          </ul>
        </section> */}
      </main>
    </>
  )
}

export default App
