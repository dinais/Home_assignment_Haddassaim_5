import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import '../../AuthPages.css';

const Owner = () => {
  const location = useLocation();
  const showLinks = location.pathname === '/owner';

  return (
    <div className="auth-page">
      <h1 className="auth-title">בעל מכולת</h1>
      {showLinks && (
        <ul className="auth-links">
          <li>
            <Link to="/owner/login">לחץ כאן להתחברות</Link>
          </li>
          <li>
          <Link to="/owner/register">לחץ כאן להרשמה</Link>
          </li>
        </ul>
      )}
      <Outlet />
    </div>
  );
};

export default Owner;
