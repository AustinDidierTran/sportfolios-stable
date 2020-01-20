import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import Header from '../Header/Header';
import Main from '../Main/Main';
import Login from '../Login/Login';
import Tabs from '../Tabs/Tabs';

import './App.css';

export default function App() {
  return (
    <Router>
      <div className="app">
        <div className="header">
          <Header />
        </div>
        <div className="tabs">
          <Tabs />
        </div>
        <div className="main">
          <Switch>
            <Route exact path="/" component={Main} />
            <Route exact path="/login" component={Login} />
          </Switch>
        </div>
        <div className="footer"></div>
      </div>
    </Router>
  );
}
