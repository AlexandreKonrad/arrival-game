import { Routes, Route } from 'react-router-dom';
import { SignIn } from '../pages/SignIn';
import { Dashboard } from '../pages/Dashboard';

export function Router() {
  return (
    <Routes>
      {/* Rota Raiz (Login) */}
      <Route path="/" element={<SignIn />} />
      
      {/* Rota Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}