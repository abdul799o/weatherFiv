import Weather from "./Weather"
import Activities from "./Activities"
import './App.css';
import { BrowserRouter, Route, Routes, Link, Navigate } from  'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/weather" element={<Weather />} />
        <Route path="/activities" element={<Activities />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
