import React from 'react';
import Link from '@material-ui/core/Link';
import { NavLink } from 'react-router-dom';

const BackLink = ({ to }: { to: string }) => (
  <Link color="secondary" variant="body2" component={NavLink} to={to}>
    &#60; Back
  </Link>
);

export const BackButton = ({ onClick }: { onClick: () => void }) => (
  // Disabling linter rule here because it should be valid since the component is set to "button"
  // eslint-disable-next-line jsx-a11y/anchor-is-valid
  <Link color="secondary" component="button" variant="body2" onClick={onClick}>
    &#60; Back
  </Link>
);

export default BackLink;
