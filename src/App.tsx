import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Homepage from './pages/Homepage';
import LoginForm from './Components/LoginForm';
import Booksform from './Components/Booksform';
import Savedbooks from './Components/Savedbooks';
import { getUserRoles } from './utils/AuthUtils';
import SigninForm from './Components/SigninForm';

// Simple auth simulation using token presence in localStorage
function RequireAuth({ children , roles=[]}: { children: JSX.Element, roles?: string[] }) {
  const token = localStorage.getItem('access_token');
  const userRoles=getUserRoles();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Wrapper to use location hook inside Router
function AppWrapper() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== '/login' && location.pathname !== '/signinform' && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/homepage"
          element={
            <RequireAuth>
              <Homepage />
            </RequireAuth>
          }
        />
        <Route
          path="/signinform"
          element={
              <SigninForm />
          }
        />
        <Route
          path="/savedbooks"
          element={
            <RequireAuth>
              <Savedbooks />
            </RequireAuth>
          }
        />
        <Route
          path="/booksform"
          element={
            <RequireAuth roles={['ADMIN','MANAGER']}>
              <Booksform />
            </RequireAuth>
          }
        />
        <Route
          path="/savedbooks/booksform/:id"
          element={
            <RequireAuth>
              <Booksform />
            </RequireAuth>
          }
        />
        
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
