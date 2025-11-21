import { useState, useEffect, useRef } from 'react'
import { recipesData } from '../../../data/recipesData.js' 

const REC_KEY = 'upc_recipes_v1'

function calcUnitCost(recipe, ingredients) {
  const map = Object.fromEntries(ingredients.map(i => [i.id, i]))
  let total = 0
  for (const it of recipe.items) {
    const ing = map[it.ingredientId]
    if (!ing) continue
    total += (ing.price / ing.gramsPurchased) * it.gramsUsed
  }
  const perItem = recipe.count && recipe.count > 0 ? total / recipe.count : total
  return { total: Number(total.toFixed(2)), perItem: Number(perItem.toFixed(2)) }
}

export default function Recipes({ ingredients }) {
  const [recipes, setRecipes] = useState([])
  const [openIngredients, setOpenIngredients] = useState({}); // State to manage toggle for each recipe

  const [name, setName] = useState('')
  const [count, setCount] = useState(1)
  const [selectedIng, setSelectedIng] = useState('')
  const [gramsUsed, setGramsUsed] = useState('')
  const [currentItems, setCurrentItems] = useState([])
  const [searchIngredient, setSearchIngredient] = useState('')
  const [isSelectOpen, setIsSelectOpen] = useState(false)
  const [errors, setErrors] = useState({
    name: false,
    ingredients: false,
    count: false
  });

  useEffect(() => {
    const r = localStorage.getItem(REC_KEY)
    if (r) setRecipes(JSON.parse(r))

    setRecipes(recipesData)
  }, [])

  useEffect(() => localStorage.setItem(REC_KEY, JSON.stringify(recipes)), [recipes])

  const addIngToRecipe = () => {
    if (!selectedIng || !gramsUsed) return
    setCurrentItems(s => [...s, { ingredientId: selectedIng, gramsUsed: Number(gramsUsed) }])
    setSelectedIng(''); 
    setGramsUsed('');
    setSearchIngredient('');
  }

  const validateForm = () => {
    const newErrors = {
      name: !name.trim(),
      ingredients: currentItems.length === 0,
      count: !count || count < 1
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const saveRecipe = () => {
    if (!validateForm()) {
      return;
    }
    const r = { 
      id: Date.now().toString(), 
      name: name.trim(), 
      count: Number(count), 
      items: currentItems 
    };
    setRecipes(s => [r, ...s]);
    setName(''); 
    setCount(1); 
    setCurrentItems([]);
    setErrors({ name: false, ingredients: false, count: false });
  };

  const removeRecipe = (id) => setRecipes(s => s.filter(r => r.id !== id))

  const filteredIngredients = ingredients.filter(ing => 
    ing.name.toLowerCase().includes(searchIngredient.toLowerCase())
  )

  const handleIngredientSelect = (id) => {
    setSelectedIng(id)
    setSearchIngredient(ingredients.find(ing => ing.id === id)?.name || '')
    setIsSelectOpen(false)
  }

  const selectRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsSelectOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleIngredientsVisibility = (recipeId) => {
    setOpenIngredients(prev => ({
      ...prev,
      [recipeId]: !prev[recipeId]
    }));
  };

  return (
    <div className="main-panel">
      <div className="panel-header">
        <h3>레시피 등록</h3>
      </div>

      <div className="recipe-form">
        <div className="form-group">
          <label>레시피 이름</label>
          <input 
            className={errors.name ? 'invalid' : ''}
            placeholder="예: 통밀식빵" 
            value={name} 
            onChange={e => setName(e.target.value)} 
          />
          {errors.name && <span className="error-message">레시피 이름을 입력해주세요</span>}
        </div>

        <div className="form-group">
          <label>완성 개수</label>
          <input 
            className={errors.count ? 'invalid' : ''}
            type="number"
            min="1"
            placeholder="몇 개가 나오나요?" 
            value={count} 
            onChange={e => setCount(e.target.value)} 
          />
          {errors.count && <span className="error-message">1개 이상의 값을 입력해주세요</span>}
        </div>

        <div className="ingredients-selector">
          <div className="form-group">
            <label>재료 선택</label>
            <div className="custom-select" ref={selectRef}>
              <input
                type="text"
                placeholder="재료 검색 또는 선택..."
                value={searchIngredient}
                onChange={e => {
                  setSearchIngredient(e.target.value)
                  setIsSelectOpen(true)
                }}
                onClick={() => setIsSelectOpen(true)}
              />
              {isSelectOpen && filteredIngredients.length > 0 && (
                <ul className="select-dropdown">
                  {filteredIngredients.map(ing => (
                    <li 
                      key={ing.id} 
                      onClick={() => handleIngredientSelect(ing.id)}
                    >
                      {ing.name} ({ing.gramsPurchased}g · {ing.price}원)
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="form-group">
            <label>사용량 (g)</label>
            <input
              type="number"
              placeholder="사용할 그램 수"
              value={gramsUsed}
              onChange={e => setGramsUsed(e.target.value)}
              min="0"
            />
          </div>
          <button className="btn primary" onClick={addIngToRecipe}>재료 추가</button>
        </div>
        {errors.ingredients && <span className="error-message">최소 1개 이상의 재료를 추가해주세요</span>}

        <ul className="list small">
          {currentItems.map((it, idx) => {
            const ing = ingredients.find(i => i.id === it.ingredientId)
            return <li key={idx}>{ing ? ing.name : '삭제된 재료'} — {it.gramsUsed}g</li>
          })}
          {currentItems.length === 0 && <li className="muted">레시피에 추가된 재료가 없습니다.</li>}
        </ul>

        <div className="row">
          <button className="btn primary" onClick={saveRecipe}>레시피 저장</button>
        </div>

        <h4>저장된 레시피</h4>
        <ul className="list">
          {recipes.map(r => {
            const c = calcUnitCost(r, ingredients)
            const isIngredientsVisible = openIngredients[r.id];
            return (
              <li key={r.id} className="list-item recipe-item">
                <div>
                  <strong>{r.name}</strong>
                  <div className="muted">총비용: {c.total} 원 · 개당: {c.perItem} 원 · ({r.count}개)</div>
                  <div className="recipe-ingredients">
                    <h5 onClick={() => toggleIngredientsVisibility(r.id)} style={{ cursor: 'pointer' }}>
                      사용 재료 
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        style={{ marginLeft: '5px', verticalAlign: 'middle', transform: isIngredientsVisible ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </h5>
                    {isIngredientsVisible && (
                      <ul className="ingredients-used">
                        {r.items.map((item, idx) => {
                          const ing = ingredients.find(i => i.id === item.ingredientId)
                          return ing ? (
                            <li key={idx}>
                              {ing.name} - {item.gramsUsed}g
                            </li>
                          ) : null
                        })}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="actions">
                  <button className="btn ghost" onClick={() => removeRecipe(r.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </li>
            )
          })}
          {recipes.length === 0 && <li className="muted">저장된 레시피가 없습니다.</li>}
        </ul>
      </div>
    </div>
  )
}