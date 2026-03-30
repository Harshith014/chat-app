import React, { useContext } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation, useNavigate } from 'react-router-dom';
import Allusers from './components/Allusers';
import ChatLayout from './components/ChatLayout';
import Login from './components/Login';
import Register from './components/Register';
import UserProfile from './components/UserProfile';
import { ColorModeContext, ThemeContextProvider } from './context/ThemeContext';


const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const colorMode = useContext(ColorModeContext);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleAppClick = () => {
    navigate('/chat');
  };

  // Hide header on login and register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <header className={`flex items-center justify-between px-6 py-4 border-b ${
      colorMode.mode === 'dark' 
        ? 'bg-slate-900 border-slate-800 text-white' 
        : 'bg-white border-slate-200 text-slate-900'
    }`}>
      <h1 
        className="text-2xl font-bold cursor-pointer hover:opacity-80 transition-opacity"
        onClick={handleAppClick}
      >
        Chat App
      </h1>
      <div className="flex items-center gap-4">
        <button
          onClick={colorMode.toggleColorMode}
          className={`p-2 rounded-lg transition-colors ${
            colorMode.mode === 'dark'
              ? 'hover:bg-slate-800'
              : 'hover:bg-slate-100'
          }`}
          title="Toggle light/dark theme"
        >
          {colorMode.mode === 'dark' ? '☀️' : '🌙'}
        </button>
        <button
          onClick={handleProfileClick}
          className={`p-2 rounded-lg transition-colors ${
            colorMode.mode === 'dark'
              ? 'hover:bg-slate-800'
              : 'hover:bg-slate-100'
          }`}
          title="Profile"
        >
          👤
        </button>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

const App = () => {
  return (
    <ThemeContextProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/chat" element={<ChatLayout />} />
          <Route path="/allusers" element={<Allusers />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </Router>
    </ThemeContextProvider>
  );
};

export default App;
