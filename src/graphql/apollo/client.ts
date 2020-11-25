import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink, split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

const wsLink: ApolloLink = new WebSocketLink({
  uri:
    process.env.REACT_APP_BACKEND_WEBSOCKET_URL ||
    'ws://localhost:4000/graphql',
  options: {
    reconnect: true,
  },
});

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
      // eslint-disable-next-line no-console
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    link,
  ]),
  cache: new InMemoryCache(),
});

export default client;
