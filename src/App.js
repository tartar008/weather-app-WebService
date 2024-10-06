import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SearchPage from './Pages/SearchPage';
import WeatherPage from './Pages/WeatherPage'; // นำเข้า WeatherPage ใหม่

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchPage />} />  {/* หน้าเลือกเมือง */}
        <Route path="/weather/:city" element={<WeatherPage />} />  {/* หน้าแสดงสภาพอากาศ */}
      </Routes>
    </Router>
  );
};

export default App;
