import React from 'react';
import { SvgIcon } from '@material-ui/core';

export const ScanIcon = ({
  colour,
  classes,
}: {
  colour: string;
  classes?: string;
}) => (
  <SvgIcon
    className={classes}
    component="svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 3H21C22.1 3 23 3.9 23 5V19C23 20.1 22.1 21 21 21H3C1.9 21 1 20.1 1 19V5C1 3.9 1.9 3 3 3ZM2.99998 19.0092H21V4.98919H2.99998V19.0092Z"
      fill={colour}
    />
    <rect
      x="4.66663"
      y="6.66699"
      width="1.33333"
      height="10.6667"
      fill={colour}
    />
    <rect x="6.66663" y="6.66699" width="2" height="10.6667" fill={colour} />
    <rect
      x="9.33337"
      y="6.66699"
      width="0.666667"
      height="10.6667"
      fill={colour}
    />
    <rect
      x="15.3334"
      y="6.66699"
      width="1.33333"
      height="10.6667"
      fill={colour}
    />
    <rect
      x="11.3334"
      y="6.66699"
      width="0.666667"
      height="10.6667"
      fill={colour}
    />
    <rect x="14" y="6.66699" width="0.666667" height="10.6667" fill={colour} />
    <rect
      x="17.3334"
      y="6.66699"
      width="1.33333"
      height="10.6667"
      fill={colour}
    />
  </SvgIcon>
);
