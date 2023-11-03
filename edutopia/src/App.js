import './App.css';
import { BrowserRouter as Router, Route, Switch, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Game from './components/Game';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/game" element={<Game />} />
        </Routes>
    </Router>

    </div>
  );
}

export default App;
