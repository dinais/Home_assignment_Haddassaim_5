import { React, useState, useEffect } from 'react';
import { Link, Outlet, useParams } from 'react-router-dom';

const OwnerDashboard = () => {
  const { id } = useParams();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const repName = localStorage.getItem('loggedUser') || '';
    const hour = new Date().getHours();
    let greet = 'שלום';
    if (hour >= 5 && hour < 12) greet = 'בוקר טוב';
    else if (hour >= 12 && hour < 18) greet = 'צהריים טובים';
    else if (hour >= 18 && hour < 22) greet = 'ערב טוב';
    else greet = 'לילה טוב';
    setGreeting(`${greet}, ${repName}`);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('loggedUser');
    window.location.href = '/';
  };
  return (
    <div>
      <nav className="top-bar">
        <ul style={{ listStyle: 'none', display: 'flex', gap: '20px' }}>
          <h3>{greeting}</h3>
          <li><Link className="nav-button" to={`/owner/${id}/order-goods`}>הזמנת סחורה</Link></li>
          <li><Link className="nav-button" to={`/owner/${id}/current-orders`}>צפייה בהזמנות קיימות (בסטטוס 'בתהליך')</Link></li>
          <li><Link className="nav-button" to={`/owner/${id}/all-orders`}>צפייה בכל ההזמנות</Link></li>
          <li><Link className="nav-button" to={`/owner/${id}/manage-pos`}> לניהול הקופה </Link></li>
          <button className="logout-button" onClick={handleLogout}>🚪 התנתק</button>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};

export default OwnerDashboard;
