import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SingleImage from './components/SingleImage';
import MultipleImage from './components/MultipleImage';
import Dashboard from './components/Dashboard';
import MultipleImageContent from './components/MultipleImageContent';

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} /> 
          <Route path="/SingleImage" element={<SingleImage />} />
          <Route path="/MultipleImage" element={<MultipleImage />} />
          <Route path="/MultipleImageContent" element={<MultipleImageContent />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
