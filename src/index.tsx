import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ApolloOfflineProvider } from 'react-offix-hooks';
import { ApolloProvider } from '@apollo/react-hooks';
import { ThemeProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import './styles/index.css';
import * as Sentry from '@sentry/browser';
import { Theme } from './styles/Theme';
import App from './App';
import * as serviceWorker from './serviceWorker';

import client from './graphql/apollo/client';
import LoadingState from './components/common/LoadingState';

const WrappedApp = () => {
  const [initialized, setInitialized] = useState(false);

  // initialize the offix client and set the apollo client
  useEffect(() => {
    client.init().then(() => setInitialized(true));
  }, []);

  if (initialized) {
    return (
      <ApolloOfflineProvider client={client}>
        <ApolloProvider client={client}>
          <ThemeProvider theme={Theme}>
            <SnackbarProvider
              anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
            >
              <App />
            </SnackbarProvider>
          </ThemeProvider>
        </ApolloProvider>
      </ApolloOfflineProvider>
    );
  }
  return (
    <ThemeProvider theme={Theme}>
      <SnackbarProvider
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      >
        <LoadingState />
      </SnackbarProvider>
    </ThemeProvider>
  );
};

render(
  <BrowserRouter>
    <WrappedApp />
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

Sentry.init({
  dsn: process.env.REACT_APP_DSN,
  maxBreadcrumbs: 50,
  debug: true,
});
