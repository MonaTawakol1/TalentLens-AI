import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load all pages for better performance (Code Splitting)
const Landing = lazy(() => import('./pages/Landing'));
const ResumeAnalysis = lazy(() => import('./pages/ResumeAnalysis'));
const Results = lazy(() => import('./pages/Results'));
const Profile = lazy(() => import('./pages/Profile'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Compare = lazy(() => import('./pages/Compare'));

// Loading Spinner Component
const PageLoader = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    flexDirection: 'column',
    gap: '1rem'
  }}>
    <div style={{
      width: '48px',
      height: '48px',
      border: '4px solid #e2e8f0',
      borderTop: '4px solid var(--primary)',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading...</p>
    <style>{`
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Layout>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/analyze" element={
                <ProtectedRoute>
                  <ResumeAnalysis />
                </ProtectedRoute>
              } />
              <Route path="/results" element={
                <ProtectedRoute>
                  <Results />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/compare" element={
                <ProtectedRoute>
                  <Compare />
                </ProtectedRoute>
              } />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
