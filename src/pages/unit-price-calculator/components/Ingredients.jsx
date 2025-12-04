import { useState, useEffect } from 'react'
import { ingredientsData } from '../../../data/ingredientsData.js'
import Modal from '../../../components/common/Modal.jsx' // Import the Modal component

const STORAGE_KEY = 'upc_ingredients_v1'
const ITEMS_PER_PAGE = 7

export default function Ingredients({ onUpdate }) {
    const [items, setItems] = useState([])
    const [name, setName] = useState('')
    const [gramsPurchased, setGramsPurchased] = useState('')
    const [price, setPrice] = useState('')
    const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE)
    const [searchTerm, setSearchTerm] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false) // Changed to isModalOpen
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

    const removeOne = (id) => setItems(s => s.filter(i => i.id !== id))

    const showMore = () => {
        setVisibleItems(prev => prev + ITEMS_PER_PAGE)
    }

    const resetForm = () => {
        setName('');
        setGramsPurchased('');
        setPrice('');
        setErrors({ name: false, gramsPurchased: false, price: false }); // Also reset errors
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

        resetForm(); // Reset form fields and errors
        setIsModalOpen(false); // Close the modal after submission
    };

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="side-panel">
            <div className="panel-header">
                <h3>재료 관리</h3>
                <button
                    className="btn secondary"
                    onClick={() => setIsModalOpen(true)} // Open modal
                >
                    재료 추가하기
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

            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title="새 재료 추가">
                <form className="ingredients-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>재료 이름</label>
                        <input
                            className={errors.name ? 'invalid' : ''}
                            placeholder="예: 강력분, 버터"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
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
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-add">재료 추가</button>
                        <button type="button" className="btn-reset" onClick={resetForm}>초기화</button>
                    </div>
                </form>
            </Modal>

            <div className="ingredients-list">
                {filteredItems.slice(0, visibleItems).map(item => (
                    <div key={item.id} className="ingredient-item">
                        <div className="content">
                            {item.link ? (
                                <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ingredient-link"
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    <strong>{item.name}</strong>
                                </a>
                            ) : (
                                <strong>{item.name}</strong>
                            )}
                            <span className="muted">
                                {item.gramsPurchased}g · {item.price}원 · {((item.price / item.gramsPurchased) || 0).toFixed(2)}원/g
                            </span>
                        </div>
                        <button className="btn ghost" onClick={() => removeOne(item.id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
            {visibleItems < filteredItems.length && (
                <div className="show-more">
                    <button className="btn" onClick={showMore}>더보기</button>
                </div>
            )}
        </div>
    )
}