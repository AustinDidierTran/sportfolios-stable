import React from 'react';
import { Link } from 'react-router-dom';

import './Tabs.css';

export default function Tabs() {
  return (
    <div className="tabs">
      <Link to={'/'} className="nav-link">
        Home
      </Link>
      <Link to={'/login'} className="nav-link">
        Login
      </Link>
    </div>
  );
}
