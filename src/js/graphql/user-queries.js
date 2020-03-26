import gql from 'graphql-tag';

const GET_USERS = gql `
{
    query {
        users {
            id
            accessLevel
            firstName
            lastName
            email
            emergencyContact
            createdAt
            updatedAt
        }
    }
}
`;

const GET_USER = gql `
{
    query {
        user($id: ID!) {
            id
            accessLevel
            firstName
            lastName
            email
            emergencyContact
            createdAt
            updatedAt
        }
    }
}
`

export { GET_USERS, GET_USER }