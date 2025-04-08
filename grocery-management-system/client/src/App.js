import React from 'react';
import './App.css';
import AppRoutes from './routes';
import Navbar from './components/Navbar';

function App() {
  return (
      <div className="App" dir="rtl">
        <Navbar />
        <div className="container">
          <AppRoutes />
        </div>
      </div>
  );
}

export default App;