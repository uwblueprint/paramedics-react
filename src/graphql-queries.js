import gql from 'graphql-tag';

const GET_USERS = gql `
    {
        events {
            id
            user
            isActive
        }
    }
`;

const GET_USER = gql `
    event($id: ID!) {
        name
        isActive
    }
`

export { GET_USERS, GET_USER }