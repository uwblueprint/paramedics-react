import { ApolloOfflineClient } from 'offix-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink, split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import gql from 'graphql-tag';
import {
  CONNECTING,
  CONNECTED,
  DISCONNECTED,
  RECONNECTING,
  RECONNECTED,
} from '../subscriptions/constants';

let webSocketUrl = 'ws://localhost:4000/graphql';
if (process.env.REACT_APP_BACKEND_WEBSOCKET_URL) {
  if (process.env.REACT_APP_BACKEND_WEBSOCKET_URL[0] === '/') {
    const url = new URL(
      process.env.REACT_APP_BACKEND_WEBSOCKET_URL,
      window.location.href
    );
    webSocketUrl = url.href.replace('http', 'ws');
  } else {
    webSocketUrl = process.env.REACT_APP_BACKEND_WEBSOCKET_URL;
  }
}

const myClient = new SubscriptionClient(
  webSocketUrl || 'ws://localhost:4000/graphql',
  {
    reconnect: true,
  }
);

const wsLink = new WebSocketLink(myClient);

const httpLink: ApolloLink = new HttpLink({
  uri: process.env.REACT_APP_BACKEND_HOST || 'http://localhost:4000/',
  credentials: 'same-origin',
});

const link: ApolloLink = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloOfflineClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          // eslint-disable-next-line no-console
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      if (networkError) {
        // eslint-disable-next-line no-console
        console.log(`[Network error]: ${networkError}`);
      }
    }),
    link,
  ]),
  cache: new InMemoryCache(),
});

export const GET_NETWORK_STATUS = gql`
  query updateNetworkStatus {
    networkStatus
  }
`;

myClient.onConnected(() => {
  client.writeQuery({
    query: GET_NETWORK_STATUS,
    data: {
      networkStatus: CONNECTED,
    },
  });
});
myClient.onConnecting(() => {
  client.writeQuery({
    query: GET_NETWORK_STATUS,
    data: {
      networkStatus: CONNECTING,
    },
  });
});
myClient.onDisconnected(() => {
  client.writeQuery({
    query: GET_NETWORK_STATUS,
    data: {
      networkStatus: DISCONNECTED,
    },
  });
});
myClient.onReconnected(() => {
  client.writeQuery({
    query: GET_NETWORK_STATUS,
    data: {
      networkStatus: RECONNECTED,
    },
  });
});

myClient.onReconnecting(() => {
  client.writeQuery({
    query: GET_NETWORK_STATUS,
    data: {
      networkStatus: RECONNECTING,
    },
  });
});

export default client;
