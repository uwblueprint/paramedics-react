import ApolloClient from 'apollo-boost';
import defaults from './defaults';

const client = new ApolloClient({
  uri: process.env.REACT_APP_BACKEND_HOST || 'http://localhost:4000/graphql',
  clientState: {
    defaults,
  },
});

export default client;
