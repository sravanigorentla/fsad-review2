import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Assessment from './pages/Assessment';
import Results from './pages/Results';
import Login from './pages/Login';
import Dashboard from './pages/Admin/Dashboard';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/results" element={<Results />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
export default App;
