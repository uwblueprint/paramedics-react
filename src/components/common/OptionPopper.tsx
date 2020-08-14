import React from 'react';
import { Typography } from '@material-ui/core';
import Popper from '@material-ui/core/Popper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
import { Colours } from '../../styles/Constants';


const options = makeStyles({
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
  })


const OptionPopper = ({
    id,
    open,
    anchorEl,
    onEditClick,
    onDeleteClick,

}: {
    id: string | undefined;
    open: boolean;
    anchorEl: HTMLButtonElement | null;
    onEditClick: () => void;
    onDeleteClick: () => void;
}) => {

    const optionBtn = options();
    const classes = useLayout();

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
              <TableRow
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
              </TableRow>
            </TableBody>
          </Table>
        </div>
    </Popper>
    )

};

export default OptionPopper;

