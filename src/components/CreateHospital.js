import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { ALL_HOSPITALS_QUERY } from './HospitalTable';

const ADD_HOSPITAL_MUTATION = gql`
    mutation PostMutation($name: String!) {
        addHospital(name: $name){
            id
            name
            createdAt
            updatedAt
        }
    }
`;

class CreateHospital extends Component {
    state = {
        name: '',
    };

    render() {
        const { name } = this.state;
        return (
            <div>
                <div>
                    <input
                        className="mb2"
                        value={name}
                        onChange={e => this.setState({ name: e.target.value })}
                        type="text"
                        placeholder="Hospital Name"
                    />
                </div>
                <Mutation
                    mutation={ADD_HOSPITAL_MUTATION}
                    variables={{ name }}
                    onCompleted={() => this.props.history.push('/viewHospitals')}
                    update={(store, { data: { addHospital }}) => {
                        const data = store.readQuery({ query: ALL_HOSPITALS_QUERY });
                        data.hospitals.push(addHospital);
                        store.writeQuery({
                            query: ALL_HOSPITALS_QUERY,
                            data
                        })
                    }}
                >
                    {postMutation => <button onClick={postMutation}>Submit</button>}
                </Mutation>
            </div>
        )
    }
}

export default CreateHospital;