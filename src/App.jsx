import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/pages/HomePage';
import GameDetail from './components/pages/GameDetail';
import GameForme from './components/pages/GameForme';
import Login from './components/pages/Login';
import CartPage from './components/pages/CardPage';
import Admin from './components/pages/Admin';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/game/new" element={<GameForme />} />
            <Route path="/game/edit/:id" element={<GameForme />} />
            <Route path="/game-detail/:id" element={<GameDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
