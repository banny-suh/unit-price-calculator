import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Menu from './components/common/Menu';
import UnitPriceCalculator from './pages/UnitPriceCalculator';

const Home = () => <h1>Home</h1>;

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isPeeking, setIsPeeking] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isPeeking) {
      setIsPeeking(false);
    }
  };

  return (
    <Router>
      <div className={`app-grid ${isMenuOpen ? 'menu-open' : 'menu-closed'} ${isPeeking ? 'peeking' : ''}`}>
        {!isMenuOpen && (
          <div 
            className="menu-peek-area" 
            onMouseEnter={() => setIsPeeking(true)} 
          />
        )}
        <div className="menu-container" onMouseLeave={() => setIsPeeking(false)}>
          <Menu toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />
        </div>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/unit-price-calculator" element={<UnitPriceCalculator />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;