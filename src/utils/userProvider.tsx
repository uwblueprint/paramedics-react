import React from 'react';
import { Redirect } from 'react-router-dom';
import { GET_LOGGED_IN_USER } from '../graphql/queries/users';
import { useQuery } from '@apollo/react-hooks';

interface UserType {
  name: String;
  id: String;
  email: String;
  roleId: String;
}

export const UserContext = React.createContext({} as UserType);

const UserProvider = ({ children }) => {
  const { data, loading } = useQuery(GET_LOGGED_IN_USER);
  console.log(window.location.pathname);
  console.log(data);

  // If the user isn't logged in, redirect them to login page
  if (
    !loading &&
    !data &&
    window.location.pathname !== '/login' &&
    window.location.pathname !== '/unauth'
  ) {
    //window.location.href = '/login';
  }

  return (
    <UserContext.Provider value={!data ? {} : data.loggedInUser}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
