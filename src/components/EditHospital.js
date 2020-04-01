import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const UPDATE_HOSPITAL_MUTATION = gql`
    mutation PostMutation($id: ID!, $name: String!) {
        updateHospital(id: $id, name: $name){
            id
            name
            createdAt
            updatedAt
        }
    }
`;

class EditHospital extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.location.state.hospital.name || '',
        };
    }

    render() {
        const { id, createdAt, updatedAt } = this.props.location.state.hospital;
        const { name } = this.state;
        return (
            <div>
                <div>ID: {id}</div>
                <div>
                    <input
                        className="mb2"
                        value={name}
                        onChange={e => this.setState({ name: e.target.value })}
                        type="text"
                        placeholder="Hospital Name"
                    />
                </div>
                <div>Created At: {createdAt}</div>
                <div>Last Updated At: {updatedAt}</div>
                <Mutation
                    mutation={UPDATE_HOSPITAL_MUTATION}
                    variables={{ id, name }}
                    onCompleted={() => this.props.history.push('/viewHospitals')}
                >
                    {postMutation => <button onClick={postMutation}>Submit</button>}
                </Mutation>
            </div>
        )
    }
}

export default EditHospital;