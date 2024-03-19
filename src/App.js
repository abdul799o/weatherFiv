import Weather from "./Weather"
import Activities from "./Activities"
import './App.css';
import { BrowserRouter, Route, Routes } from  'react-router-dom';

function App() {
  return (
    <div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Weather />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/activities" element={<Activities />} />
      </Routes>
    </BrowserRouter>
    </div>
    
  );
}

export default App;
