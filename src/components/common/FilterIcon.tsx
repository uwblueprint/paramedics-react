import React from "react";
import { SvgIcon } from "@material-ui/core";

export const FilterIcon = ({
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
    <rect x="4" y="2" width="2" height="20" fill={colour} />
    <rect x="11" y="2" width="2" height="20" fill={colour} />
    <rect x="18" y="2" width="2" height="20" fill={colour} />
    <circle cx="5" cy="17" r="3" fill={colour} />
    <circle cx="12" cy="7" r="3" fill={colour} />
    <circle cx="19" cy="12" r="3" fill={colour} />
  </SvgIcon>
);
