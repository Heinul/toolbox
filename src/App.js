import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// 페이지 컴포넌트 임포트
import Home from './pages/Home';
import Calculator from './pages/Calculator';
import QualityReader from './pages/QualityReader';

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="App">
        <header className="App-header">
          <h1>툴박스</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/quality-reader" element={<QualityReader />} />
          </Routes>
        </main>
        <footer className="App-footer">
          <p>© Heinul - 툴박스</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
