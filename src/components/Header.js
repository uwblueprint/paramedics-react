import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

class Header extends Component {
    render() {
        return (
            <div className="flex pa1 justify-between nowrap orange">
                <div className="flex flex-fixed black">
                    <div className="fw7 mr1">Paramedics React</div>
                    <Link to="/viewHospitals" className="ml1 no-underline black">
                        View Hospitals
                    </Link>
                    <div className="ml1">|</div>
                    <Link to="/createHospital" className="ml1 no-underline black">
                        Create Hospital
                    </Link>
                </div>
            </div>
        )
    }
}

export default withRouter(Header);