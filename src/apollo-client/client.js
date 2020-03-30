import ApolloClient from "apollo-boost";

import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: "http://localhost:4000/"
});

export const client = new ApolloClient({
  uri: "http://localhost:4000/"
});
