import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartPage from './pages/StartPage';
import HomePage  from './pages/HomePage';
import './App.css';

function App() {
  return (
    <Router>
      <div className='container-1920 h-full flex justify-center bg-white text-text bg-start-page bg-cover bg-center bg-no-repeat'>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
