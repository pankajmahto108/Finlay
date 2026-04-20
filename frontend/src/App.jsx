import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import StrategyTester from './pages/StrategyTester';
import MarketScanner from './pages/MarketScanner';
import Watchlist from './pages/Watchlist';
import Qbit from './pages/Qbit';

function App() {
  return (
    <Router>
      <Routes>
        {/* App Pages — with sidebar layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/strategy" element={<StrategyTester />} />
          <Route path="/scanner" element={<MarketScanner />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/qbit" element={<Qbit />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App;
