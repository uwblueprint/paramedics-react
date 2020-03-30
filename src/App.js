import React, { useEffect } from "react";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";

const App = () => {
  const [addEvent, { eventData }] = useMutation(gql`
    mutation {
      addEvent(
        name: "COVID19"
        isActive: true
        eventDate: "2020-03-05"
        createdBy: 1
      ) {
        name
      }
    }
  `);

  const { loading, error, data } = useQuery(
    gql`
      {
        events {
          name
          eventDate
        }
      }
    `
  );
  console.log(loading, error, data);
  if (loading) return <h1>Loading</h1>;
  if (error) return <h1>Error</h1>;
  return (
    <>
      <h1>Events</h1>
      {data.events.map(event => (
        <h1>{event.name}</h1>
      ))}
      <button onClick={addEvent}>Add event!</button>
    </>
  );
};

export default App;
