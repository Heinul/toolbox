import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import { logPageView } from './firebase/config';

// 페이지 컴포넌트 임포트
import Home from './pages/Home';
import Calculator from './pages/Calculator';
import QualityReader from './pages/QualityReader';
import SpecLog from './pages/SpecLog';


function PageViewTracker() {
  const location = useLocation();
  
  useEffect(() => {
    // 페이지 경로에 따라 적절한 페이지 이름 설정
    const getPageName = () => {
      switch(location.pathname) {
        case '/':
          return 'Home';
        case '/calculator':
          return 'Calculator';
        case '/quality-reader':
          return 'QualityReader';
        case '/spec-log':
          return 'SpecLog';
        default:
          return 'Unknown';
      }
    };
    
    logPageView(getPageName());
  }, [location]);
  
  return null;
}

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="App">
        <header className="App-header">
          <Link to="/" className="title-link">
            <h1>툴박스</h1>
          </Link>
        </header>
        <PageViewTracker />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/quality-reader" element={<QualityReader />} />
            <Route path="/spec-log" element={<SpecLog />} />
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
