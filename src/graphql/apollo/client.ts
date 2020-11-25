import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink, split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import gql from 'graphql-tag';
import { GET_ALL_PATIENTS } from '../queries/patients';

const myClient = new SubscriptionClient('ws://localhost:4000/graphql', {
  reconnect: true,
});

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

const client = new ApolloClient({
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
      networkStatus: 'connected',
    },
  });
});
myClient.onConnecting(() => {
  client.writeQuery({
    query: GET_NETWORK_STATUS,
    data: {
      networkStatus: 'connecting...',
    },
  });
});
myClient.onDisconnected(() => {
  client.writeQuery({
    query: GET_NETWORK_STATUS,
    data: {
      networkStatus: 'disconnected',
    },
  });
});
myClient.onReconnected(() => {
  client.writeQuery({
    query: GET_NETWORK_STATUS,
    data: {
      networkStatus: 'connected',
    },
  });

  // const data = client.readQuery({ query: GET_ALL_PATIENTS });

  // client.writeQuery({
  //   query: GET_ALL_PATIENTS,
  //   data: {
  //     patients: data.patients,
  //   },
  // });
  window.location.reload();
});

myClient.onReconnecting(() => {
  client.writeQuery({
    query: GET_NETWORK_STATUS,
    data: {
      networkStatus: 'reconnecting...',
    },
  });
});

export default client;
