// src/routes/AppRoutes.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import LoginPage from '../features/auth/LoginPage';
// import RegisterPage from '../features/auth/RegisterPage';
// import HomePage from '../pages/HomePage';
// import Dashboard from '../pages/DashBoard';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
