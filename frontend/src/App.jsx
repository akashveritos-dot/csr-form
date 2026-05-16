import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FormEngine from './FormEngine';
import AdminDashboard from './AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormEngine />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
