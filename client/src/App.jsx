import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NewRequest from './pages/NewRequest'
import DadLogin from "./pages/DadLogin"
import DadDashboard from './pages/DadDashboard'
import ProtectedRoute from './pages/ProtectedRoute'

function App() {
  return (


    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/request" />} />
        <Route path="/request" element={<NewRequest />} />
        <Route path="/dad-login" element={<DadLogin />} />
        <Route path="/dad-dashboard" element={
          <ProtectedRoute>
            <DadDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
  
}

export default App

