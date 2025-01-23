import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StartPage } from './pages/StartPage';
import { HomePage } from './pages/HomePage';
import './App.css';

function App() {
  return (
    <Router>
      {/* Общий "фон" и контейнер */}
      <div className='container-1920 flex justify-center bg-white text-text'>
        
        {/* Точка переключения маршрутов */}
        <Routes>
          {/* Стартовая страница */}
          <Route path="/" element={<StartPage />} />

          {/* Главная страница после клика */}
          <Route path="/home" element={<HomePage />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;
