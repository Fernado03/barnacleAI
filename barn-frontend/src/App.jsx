import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, Login, SignUp, Statistics, Model, About, Profile, NotFound } from './pages'
import Pricing from './pages/Pricing';
import Demo from './pages/Demo';
import NavBar from './components/shared/NavBar';
import Footer from './components/shared/Footer';
import ErrorBoundary from './components/shared/ErrorBoundary';
import Help from './components/shared/Help';
import ScrollToTop from './components/shared/ScrollToTop';
import { useKeyboardShortcuts, SkipLinks } from './hooks/useKeyboardShortcuts.jsx';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute, { PublicRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  )
}

// Separate component to use hooks that require Router context
function AppContent() {
  // Initialize keyboard shortcuts for power users
  useKeyboardShortcuts();

  return (
    <>
      {/* Skip links for accessibility */}
      <SkipLinks />
      
      {/* Automatic scroll to top on navigation */}
      <ScrollToTop />
      
      <NavBar id="navigation" />
      
      <main id="main-content" role="main">
        <Routes>
          {/* Public routes */}
          <Route path='/' element={<Home />} />
          <Route 
            path='/login' 
            element={
              <PublicRoute restricted={true}>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path='/signup' 
            element={
              <PublicRoute restricted={true}>
                <SignUp />
              </PublicRoute>
            } 
          />
          <Route path='/demo' element={<Demo />} />
          <Route path='/pricing' element={<Pricing />} />
          <Route path='/model' element={<Model />} />
          <Route path='/about' element={<About />} />
          
          {/* Protected routes - require authentication */}
          <Route 
            path='/statistics' 
            element={
              <ProtectedRoute>
                <Statistics />
              </ProtectedRoute>
            } 
          />
          
          {/* Add the Profile route here - also protected since it's a user's profile */}
          <Route 
            path='/profile' 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch-all route for non-existent pages */}
          <Route path='*' element={<NotFound />} />
        </Routes>
      </main>
      
      {/* Global Help System */}
      <Help />
      
      {/* Footer */}
      <Footer />
    </>
  );
}

export default App
