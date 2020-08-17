import React from 'react';
import { Typography } from '@material-ui/core';
import Popper from '@material-ui/core/Popper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
import { Colours } from '../../styles/Constants';

const useOptions = makeStyles({
  root: {
    textAlign: 'right',
  },
  menuCell: {
    borderBottom: 0,
  },
  menuHover: {
    borderRadius: '4px 4px 4px 4px',
  },
  menuDelete: {
    color: Colours.DangerHover,
  },
});

const useLayout = makeStyles({
  tablePopper: {
    minWidth: '159px',
    height: '112px',
    backgroundColor: Colours.White,
    borderRadius: '4px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
  },
});

export interface Option {
  styles: any;
  onClick: () => void;
  name: string;

}

const OptionPopper = ({
  id,
  open,
  anchorEl,
  options
}: {
  id: string | undefined;
  open: boolean;
  anchorEl: HTMLButtonElement | null;
  options: [Option];
}) => {
  const classes = useLayout();
  const optionStyle = useOptions();
  const optionBtn = useOptions();

  return (
    <Popper
      id={id}
      open={open}
      popperOptions={{
        modifiers: { offset: { enabled: true, offset: '-69.5,0' } },
      }}
      anchorEl={anchorEl}
    >
      <div>
        <Table className={classes.tablePopper}>
          <TableBody>
            {/* {options.map((option) => {
              return (<TableRow
                hover
                classes={{ hover: optionStyle.menuHover }}
                onClick={option.onClick}>
                <TableCell classes={{ root: option.styles }}>
                  <Typography variant="body2">{option.name}</Typography>
                </TableCell>
              </TableRow>);
            })} */}
            {/* <TableRow
              hover
              classes={{ hover: optionBtn.menuHover }}
              onClick={onEditClick}
            >
              <TableCell classes={{ root: optionBtn.menuCell }}>
                <Typography variant="body2">Edit</Typography>
              </TableCell>
            </TableRow>
            <TableRow hover onClick={onDeleteClick}>
              <TableCell classes={{ root: optionBtn.menuDelete }}>
                <Typography variant="body2">Delete</Typography>
              </TableCell>
            </TableRow> */}
          </TableBody>
        </Table>
      </div>

    </Popper>
  );
};


export default OptionPopper;
