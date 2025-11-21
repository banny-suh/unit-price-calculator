import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import UnitPriceCalculator from './pages/UnitPriceCalculator';
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/unit-price-calculator" element={<UnitPriceCalculator />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;