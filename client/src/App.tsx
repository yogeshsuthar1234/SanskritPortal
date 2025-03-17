import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginSignupForm from './login/LoginSignupForm';
import Dashboard from './Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignupForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
export default App;