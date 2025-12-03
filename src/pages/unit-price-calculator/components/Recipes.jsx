import { useState, useEffect, useRef } from 'react'
import { recipesData } from '../../../data/recipesData.js'
import Modal from '../../../components/common/Modal.jsx'

const REC_KEY = 'upc_recipes_v1'
const SELLING_PERCENT = 0.35 // 35% of selling price, 65% margin

function calcUnitCost(recipe, ingredients) {
  const map = Object.fromEntries(ingredients.map(i => [i.id, i]))
  let total = 0
  for (const it of recipe.items) {
    const ing = map[it.ingredientId]
    if (!ing) continue
    total += (ing.price / ing.gramsPurchased) * it.gramsUsed
  }
  const perItem = recipe.count && recipe.count > 0 ? total / recipe.count : total

  const marketPricePerItem = Math.ceil(perItem / SELLING_PERCENT);

  return {
    total: Number(total.toFixed(2)),
    perItem: Number(perItem.toFixed(2)),
    marketPricePerItem: Number(marketPricePerItem.toFixed(2))
  }
}

export default function Recipes({ ingredients }) {
  const [recipes, setRecipes] = useState([])
  const [openIngredients, setOpenIngredients] = useState({});

  const [name, setName] = useState('')
  const [count, setCount] = useState(1)
  const [selectedIng, setSelectedIng] = useState('')
  const [gramsUsed, setGramsUsed] = useState('')
  const [currentItems, setCurrentItems] = useState([])
  const [searchIngredient, setSearchIngredient] = useState('')
  const [isSelectOpen, setIsSelectOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [addIngredientErrors, setAddIngredientErrors] = useState({ selectedIng: false, gramsUsed: false });
  const [editingRecipeId, setEditingRecipeId] = useState(null); // New state for editing
  const [searchRecipe, setSearchRecipe] = useState('')

  useEffect(() => {
    const r = localStorage.getItem(REC_KEY)
    if (r) setRecipes(JSON.parse(r))

    setRecipes(recipesData)
  }, [])

  useEffect(() => localStorage.setItem(REC_KEY, JSON.stringify(recipes)), [recipes])

  const addIngToRecipe = () => {
    let hasError = false;
    const newAddErrors = { selectedIng: false, gramsUsed: false };

    if (!selectedIng) {
      newAddErrors.selectedIng = true;
      hasError = true;
    }
    if (!gramsUsed || Number(gramsUsed) <= 0) {
      newAddErrors.gramsUsed = true;
      hasError = true;
    }

    setAddIngredientErrors(newAddErrors);

    if (hasError) {
      return;
    }

    setCurrentItems(s => [...s, { ingredientId: selectedIng, gramsUsed: Number(gramsUsed) }]);
    setSelectedIng('');
    setGramsUsed('');
    setSearchIngredient('');
    setAddIngredientErrors({ selectedIng: false, gramsUsed: false });
  }

  const validateForm = () => {
    const validationErrors = [];
    if (!name.trim()) {
      validationErrors.push('레시피 이름을 입력해주세요.');
    }
    if (!count || count < 1) {
      validationErrors.push('완성 개수는 1개 이상의 값을 입력해주세요.');
    }
    if (currentItems.length === 0) {
      validationErrors.push('최소 1개 이상의 재료를 추가해주세요.');
    }
    return validationErrors;
  };

  const resetForm = () => {
    setName('');
    setCount(1);
    setCurrentItems([]);
    setEditingRecipeId(null);
    setAddIngredientErrors({ selectedIng: false, gramsUsed: false });
  }

  const saveRecipe = () => {
    const errors = validateForm();
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    if (editingRecipeId) {
      // Update existing recipe
      setRecipes(s => s.map(r =>
        r.id === editingRecipeId
          ? { ...r, name: name.trim(), count: Number(count), items: currentItems }
          : r
      ));
    } else {
      // Add new recipe
      const r = {
        id: Date.now().toString(),
        name: name.trim(),
        count: Number(count),
        items: currentItems
      };
      setRecipes(s => [r, ...s]);
    }
    resetForm();
    setIsModalOpen(false);
  };

  const startEditRecipe = (id) => {
    const recipeToEdit = recipes.find(r => r.id === id);
    if (recipeToEdit) {
      setEditingRecipeId(id);
      setName(recipeToEdit.name);
      setCount(recipeToEdit.count);
      setCurrentItems(recipeToEdit.items);
      setIsModalOpen(true);
    }
  };

  const removeRecipe = (id) => setRecipes(s => s.filter(r => r.id !== id))

  const filteredIngredients = ingredients.filter(ing =>
    ing.name.toLowerCase().includes(searchIngredient.toLowerCase())
  )

  const filteredRecipes = recipes.filter(r =>
    r.name.toLowerCase().includes(searchRecipe.toLowerCase())
  )

  const handleIngredientSelect = (id) => {
    setSelectedIng(id)
    setSearchIngredient(ingredients.find(ing => ing.id === id)?.name || '')
    setIsSelectOpen(false)
    setAddIngredientErrors(prev => ({ ...prev, selectedIng: false }));
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
        <h3>레시피 관리</h3>
        <button
          className="btn secondary"
          onClick={() => setIsModalOpen(true)} // Open modal
        >
          레시피 추가하기
        </button>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="레시피 검색..."
          value={searchRecipe}
          onChange={(e) => setSearchRecipe(e.target.value)}
          className="search-input"
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={editingRecipeId ? "레시피 수정" : "새 레시피 추가"}>
        <div className="recipe-form">
          <div className="form-group">
            <label>레시피 이름</label>
            <input
              placeholder="예: 통밀식빵"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>완성 개수</label>
            <input
              type="number"
              min="1"
              placeholder="몇 개가 나오나요?"
              value={count}
              onChange={e => setCount(e.target.value)}
            />
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
                    setAddIngredientErrors(prev => ({ ...prev, selectedIng: false }));
                  }}
                  onClick={() => setIsSelectOpen(true)}
                  className={addIngredientErrors.selectedIng ? 'invalid' : ''}
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
                onChange={e => {
                  setGramsUsed(e.target.value)
                  setAddIngredientErrors(prev => ({ ...prev, gramsUsed: false }));
                }}
                min="0"
                className={addIngredientErrors.gramsUsed ? 'invalid' : ''}
              />
            </div>
            <button className="btn primary" onClick={addIngToRecipe}>재료 추가</button>
          </div>

          <ul className="list small">
            {currentItems.map((it, idx) => {
              const ing = ingredients.find(i => i.id === it.ingredientId)
              return <li key={idx}>{ing ? ing.name : '삭제된 재료'} — {it.gramsUsed}g</li>
            })}
            {currentItems.length === 0 && <li className="muted">레시피에 추가된 재료가 없습니다.</li>}
          </ul>

          <div className="row">
            <button className="btn primary" onClick={saveRecipe}>
              {editingRecipeId ? '레시피 업데이트' : '레시피 저장'}
            </button>
          </div>
        </div>
      </Modal>

      <ul className="list">
        {filteredRecipes.map(r => {
          const c = calcUnitCost(r, ingredients)
          const isIngredientsVisible = openIngredients[r.id];
          return (
            <li key={r.id} className="list-item recipe-item">
              <div>
                <strong>{r.name}</strong>
                <div className="muted">
                  총비용: {c.total} 원 · 개당: {c.perItem} 원 · ({r.count}개)
                </div>
                <div className="muted">
                  개당 시중가: {c.marketPricePerItem} 원
                </div>
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
                <button className="btn ghost" onClick={() => startEditRecipe(r.id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
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
      </ul>
    </div>
  )
}