import ApolloClient from "apollo-boost";
import defaults from "./defaults";
// import resolvers from "../resolvers";

const client = new ApolloClient({
  uri: "http://localhost:4000/",
  clientState: {
    defaults,
    // resolvers,
  },
});

export default client;
