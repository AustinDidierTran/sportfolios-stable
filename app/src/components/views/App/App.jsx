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

import styles from './App.module.css';

export default function App() {
  return (
    <Router>
      <div className={styles.app}>
        <div className={styles.header}>
          <Header />
        </div>
        <div className={styles.tabs}>
          <Tabs />
        </div>
        <div className={styles.main}>
          <Switch>
            <Route exact path="/" component={Main} />
            <Route exact path="/login" component={Login} />
          </Switch>
        </div>
        <div className={styles.footer}></div>
      </div>
    </Router>
  );
}
