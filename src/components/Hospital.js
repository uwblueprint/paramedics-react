import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Hospital extends Component {
    render() {
        const { id, name, createdAt, updatedAt } = this.props.hospital;
        return (
            <tr>
                <td><Link to={{ pathname: "/editHospital", state: {hospital: this.props.hospital}}}>{id}</Link></td>
                <td>{name}</td>
                <td>{createdAt}</td>
                <td>{updatedAt}</td>
            </tr>
        )
    }
}

export default Hospital;