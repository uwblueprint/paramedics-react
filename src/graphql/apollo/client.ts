import ApolloClient from "apollo-boost";
import defaults from "./defaults";


const client = new ApolloClient({
  uri: process.env.REACT_APP_BACKEND_HOST || process.env.REACT_APP_BACKEND_TUNNEL || "http://localhost:4000/",
  clientState: {
    defaults,
  },
});

export default client;
