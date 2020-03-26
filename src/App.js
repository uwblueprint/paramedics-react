import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useQuery } from '@apollo/react-hooks';

import { GET_USERS, GET_USER } from './js/graphql/user-queries';

function App({ onSelectedUser }) {
  const { loading, error, data } =  useQuery(GET_USERS);

  if (loading) return 'Loading!';
  if (error) return 'Error!';

  return (
    <select name="user" onChange = {onSelectedUser}>
      {
        data.events.map( event => (
          <option key = {event.id} value = {event.user}>
            {event.user}
          </option>
        ))}
    </select>
  )
}

export default App;
