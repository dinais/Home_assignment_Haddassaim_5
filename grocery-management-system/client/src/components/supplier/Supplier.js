import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import '../../AuthPages.css';

const Supplier = () => {
  const location = useLocation();
  const showLinks = location.pathname === '/supplier';

  return (
    <div className="auth-page">
      <h1 className="auth-title">ספקים</h1>
      {showLinks && (
        <ul className="auth-links">
          <li>
            <Link to="/supplier/register">אתה עוד לא מחובר? לחץ כאן להרשמה!</Link>
          </li>
          <li>
            <Link to="/supplier/login">לחץ כאן להתחברות</Link>
          </li>
        </ul>
      )}
      <Outlet />
    </div>
  );
};

export default Supplier;
