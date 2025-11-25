import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import UnitPriceCalculator from './pages/unit-price-calculator/UnitPriceCalculator';
import Home from './pages/Home';
import BakingScheduler from './pages/baking-scheduler/BakingScheduler';
import WaterTemperatureCalculator from './pages/water-temperature-calculator/WaterTemperatureCalculator';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/unit-price-calculator" element={<UnitPriceCalculator />} />
          <Route path="/baking-scheduler" element={<BakingScheduler />} />
          <Route path="/water-temperature-calculator" element={<WaterTemperatureCalculator />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;