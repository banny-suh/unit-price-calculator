import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Menu from '../components/common/Menu';
import './MainLayout.css';

const MainLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isPeeking, setIsPeeking] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isPeeking) {
      setIsPeeking(false);
    }
  };

  return (
    <div className={`app-grid ${isMenuOpen ? 'menu-open' : 'menu-closed'} ${isPeeking ? 'peeking' : ''}`}>
      <button className={`menu-toggle ${isMenuOpen ? 'is-open' : ''}`} onClick={toggleMenu}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      {!isMenuOpen && (
        <div 
          className="menu-peek-area" 
          onMouseEnter={() => setIsPeeking(true)} 
        />
      )}
      <div className="menu-container" onMouseLeave={() => setIsPeeking(false)}>
        <Menu isMenuOpen={isMenuOpen} />
      </div>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;