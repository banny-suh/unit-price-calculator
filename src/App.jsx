import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import UnitPriceCalculator from './pages/unit-price-calculator/UnitPriceCalculator';
import Home from './pages/Home';
import BakingScheduler from './pages/baking-scheduler/BakingScheduler'; // Import the new Scheduler component
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/unit-price-calculator" element={<UnitPriceCalculator />} />
          <Route path="/baking-scheduler" element={<BakingScheduler />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;