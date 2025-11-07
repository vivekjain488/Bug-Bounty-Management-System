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

// Additional public pages
import Programs from './pages/Programs';
import ProgramDetail from './pages/ProgramDetail';
import Leaderboard from './pages/Leaderboard';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import Pricing from './pages/Pricing';
import SubmitReport from './pages/SubmitReport';
import Notifications from './pages/Notifications';

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
import TriageAnalytics from './pages/TriageAnalytics';
import TriageSettings from './pages/TriageSettings';

// Company analytics/settings
import CompanyAnalytics from './pages/CompanyAnalytics';
import CompanySettings from './pages/CompanySettings';

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
  <Route path="/programs" element={<Programs />} />
  <Route path="/program/:id" element={<ProgramDetail />} />
  <Route path="/leaderboard" element={<Leaderboard />} />
  <Route path="/about" element={<About />} />
  <Route path="/how-it-works" element={<HowItWorks />} />
  <Route path="/pricing" element={<Pricing />} />
  <Route path="/submit-report" element={<SubmitReport />} />
  <Route path="/notifications" element={<Notifications />} />
        
        {/* Company dashboard routes */}
        <Route path="/company-dashboard" element={<CompanyDashboard />} />
        <Route path="/create-program" element={<CreateProgram />} />
        <Route path="/company-reports" element={<CompanyReports />} />
        <Route path="/company-payments" element={<CompanyPayments />} />
  <Route path="/company-analytics" element={<CompanyAnalytics />} />
  <Route path="/company-settings" element={<CompanySettings />} />
        
        {/* Triage dashboard routes */}
        <Route path="/triage-dashboard" element={<TriageDashboard />} />
  <Route path="/triage-analytics" element={<TriageAnalytics />} />
  <Route path="/triage-settings" element={<TriageSettings />} />
        <Route path="/triage-review/:id" element={<TriageReview />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
