import { useState, useEffect } from 'react'
import { ingredientsData } from '../data/ingredientsData.js'

const STORAGE_KEY = 'upc_ingredients_v1'
const ITEMS_PER_PAGE = 10

export default function Ingredients({ onUpdate }) {
    const [items, setItems] = useState([])
    const [name, setName] = useState('')
    const [gramsPurchased, setGramsPurchased] = useState('')
    const [price, setPrice] = useState('')
    const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE)
    const [searchTerm, setSearchTerm] = useState('')
    const [isFormVisible, setIsFormVisible] = useState(false)
    const [errors, setErrors] = useState({
        name: false,
        gramsPurchased: false,
        price: false
    });

    useEffect(() => {
        setItems(ingredientsData)
    }, [])

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
        if (onUpdate) onUpdate(items)
    }, [items])

    const add = () => {
        if (!name.trim() || !gramsPurchased || !price) return
        const id = Date.now().toString()
        setItems(s => [{ id, name: name.trim(), gramsPurchased: Number(gramsPurchased), price: Number(price) }, ...s])
        setName(''); setGramsPurchased(''); setPrice('')
    }

    const removeOne = (id) => setItems(s => s.filter(i => i.id !== id))

    const showMore = () => {
        setVisibleItems(prev => prev + ITEMS_PER_PAGE)
    }

    const resetForm = () => {
        setName('');
        setGramsPurchased('');
        setPrice('');
    }

    const validateForm = () => {
        const newErrors = {
            name: !name.trim(),
            gramsPurchased: !gramsPurchased || gramsPurchased <= 0,
            price: !price || price < 0
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        
        const id = Date.now().toString();
        setItems(s => [{
          id,
          name: name.trim(),
          gramsPurchased: Number(gramsPurchased),
          price: Number(price)
        }, ...s]);
        
        setName('');
        setGramsPurchased('');
        setPrice('');
        setErrors({ name: false, gramsPurchased: false, price: false });
    };

    const filteredItems = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="side-panel">
            <div className="panel-header">
                <h3>재료 관리</h3>
                <button 
                    className="btn-toggle" 
                    onClick={() => setIsFormVisible(!isFormVisible)}
                >
                    {isFormVisible ? '닫기' : '재료 추가하기'}
                </button>
            </div>

            <div className="search-box">
                <input 
                    type="text"
                    placeholder="재료 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            {isFormVisible && (
                <form className="ingredients-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>재료 이름</label>
                        <input 
                            className={errors.name ? 'invalid' : ''}
                            placeholder="예: 강력분, 버터" 
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                        {errors.name && <span className="error-message">재료 이름을 입력해주세요</span>}
                    </div>

                    <div className="form-group">
                        <label>구매 용량</label>
                        <input 
                            className={errors.gramsPurchased ? 'invalid' : ''}
                            type="number"
                            placeholder="단위: g"
                            value={gramsPurchased}
                            onChange={e => setGramsPurchased(e.target.value)}
                            min="0"
                        />
                        {errors.gramsPurchased && <span className="error-message">유효한 용량을 입력해주세요</span>}
                    </div>

                    <div className="form-group">
                        <label>구매 가격</label>
                        <input 
                            className={errors.price ? 'invalid' : ''}
                            type="number"
                            placeholder="단위: 원"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            min="0"
                        />
                        {errors.price && <span className="error-message">유효한 가격을 입력해주세요</span>}
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-add">재료 추가</button>
                        <button type="button" className="btn-reset" onClick={resetForm}>초기화</button>
                    </div>
                </form>
            )}

            <div className="ingredients-list">
                {filteredItems.map(item => (
                    <div key={item.id} className="ingredient-item">
                        <div className="content">
                            <strong>{item.name}</strong>
                            <span className="muted">
                                {item.gramsPurchased}g · {item.price}원 · {((item.price / item.gramsPurchased) || 0).toFixed(2)}원/g
                            </span>
                        </div>
                        <button className="btn ghost" onClick={() => removeOne(item.id)}>삭제</button>
                    </div>
                ))}
            </div>
        </div>
    )
}