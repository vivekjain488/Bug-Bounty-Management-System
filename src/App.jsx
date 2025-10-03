import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Companies from './pages/Companies';
import CompanyDetail from './pages/CompanyDetail';
import MyReports from './pages/MyReports';
import Settings from './pages/Settings';

// Company routes
import CompanyLogin from './pages/CompanyLogin';
import CompanySignup from './pages/CompanySignup';
import CompanyDashboard from './pages/CompanyDashboard';
import CreateProgram from './pages/CreateProgram';
import CompanyReports from './pages/CompanyReports';
import CompanyPayments from './pages/CompanyPayments';

// Triage routes
import TriageLogin from './pages/TriageLogin';
import TriageDashboard from './pages/TriageDashboard';
import TriageReview from './pages/TriageReview';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        
        {/* User authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Company authentication */}
        <Route path="/company-login" element={<CompanyLogin />} />
        <Route path="/company-signup" element={<CompanySignup />} />
        
        {/* Triage authentication */}
        <Route path="/triage-login" element={<TriageLogin />} />
        
        {/* User dashboard routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/company/:id" element={<CompanyDetail />} />
        <Route path="/my-reports" element={<MyReports />} />
        <Route path="/settings" element={<Settings />} />
        
        {/* Company dashboard routes */}
        <Route path="/company-dashboard" element={<CompanyDashboard />} />
        <Route path="/create-program" element={<CreateProgram />} />
        <Route path="/company-reports" element={<CompanyReports />} />
        <Route path="/company-payments" element={<CompanyPayments />} />
        
        {/* Triage dashboard routes */}
        <Route path="/triage-dashboard" element={<TriageDashboard />} />
        <Route path="/triage-review/:id" element={<TriageReview />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
