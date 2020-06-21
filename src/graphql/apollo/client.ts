import ApolloClient from "apollo-boost";
import defaults from "./defaults";

const client = new ApolloClient({
  uri: process.env.REACT_APP_BACKEND_HOST || "http://localhost:4000/",
  clientState: {
    defaults,
    // resolvers,
  },
});

export default client;
