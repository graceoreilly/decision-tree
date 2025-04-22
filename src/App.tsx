import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
// import DecisionMap from './Unused/DecisionMap/DecisionMap';
import Home from './Home/Home';
import './App.css';
 
export default function App() {

  return (
    <BrowserRouter>
    <nav>
      <Link to="/">Home</Link>
      {/* <Link to="/decisionmap">Decision Map</Link> */}
    </nav>
    
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/decisionmap" element={<DecisionMap />} /> */}
    </Routes>
  </BrowserRouter>
  );
}