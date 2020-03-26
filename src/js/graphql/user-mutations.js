import gql from 'graphql-tag';

const ADD_USER = gql `
{
    mutation {
        addUser($firstName: String!, $lastName: String!, email: String!, password: String!){
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

const UPDATE_USER = gql `
{
    mutation {
        addUser($id: ID!, $accessLevel: accessLevel, $firstName: String, $lastName: String, email: String, emergencyContact: String){
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

const DELETE_USER = gql `
{
    mutation {
        deleteUser($id: ID!)
    }
}
`;

export { ADD_USER, UPDATE_USER, DELETE_USER }