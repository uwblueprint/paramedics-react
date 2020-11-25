import { ApolloOfflineClient } from 'offix-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';

const config = {
  link: new HttpLink({
    uri: process.env.REACT_APP_BACKEND_HOST || 'http://localhost:4000/',
  }),
  cache: new InMemoryCache(),
};

// create the client
const client = new ApolloOfflineClient(config);

export default client;
