import React from "react";
import Link from "@material-ui/core/Link";
import { NavLink } from "react-router-dom";

const BackLink = ({
    to,
}: {
    to: string;
}) => {
    return (
        <Link
            color="secondary"
            variant="body2"
            component={NavLink}
            to={to}
        >
            &#60; Back
        </Link>
    );
};

export default BackLink;
