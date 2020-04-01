import React, { Component } from 'react';
import Hospital from './Hospital';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

export const ALL_HOSPITALS_QUERY = gql`
    {
        hospitals {
            id
            name
            createdAt
            updatedAt
        }
    }
`;

class HospitalTable extends Component {
    render() {
        return (
            <table border="2px">
                <tbody>
                    <tr>
                        <th>ID</th>
                        <th>Hospital Name</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                    </tr>
                    <Query query={ALL_HOSPITALS_QUERY}>
                        {({ loading, error, data }) => {
                            if (loading) return <div>Fetching</div>;
                            if (error) return <div>Error</div>;

                            return data.hospitals.map(hospital => <Hospital key={hospital.id} hospital={hospital} />)
                        }}
                    </Query>
                </tbody>
            </table>
        )
    }
}

export default HospitalTable;