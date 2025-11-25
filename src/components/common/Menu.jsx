import React from 'react';
import { NavLink } from 'react-router-dom';
import './Menu.css';

const Menu = ({ toggleMenu, isMenuOpen }) => {
  return (
    <nav className="menu">
      <button className={`menu-toggle-open ${!isMenuOpen ? 'is-closing' : ''}`} onClick={toggleMenu}>
        <span className="menu-toggle-icon" key="menu-open-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="11 17 6 12 11 7"></polyline>
            <polyline points="18 17 13 12 18 7"></polyline>
          </svg>
        </span>
      </button>
      <ul>
        <li>
          <NavLink to="/" exact activeClassName="active">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span>홈</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/unit-price-calculator" activeClassName="active">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            <span>빵 단가 계산기</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/baking-scheduler" activeClassName="active">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>베이킹 스케줄러</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/water-temperature-calculator" activeClassName="active">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"></path>
            </svg>
            <span>물 온도 계산기</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Menu;