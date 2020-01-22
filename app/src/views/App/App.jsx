import React from 'react';
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from '@material-ui/core/styles';

import teal from '@material-ui/core/colors/teal';

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

const theme = createMuiTheme({
  palette: {
    primary: teal,
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  );
}
