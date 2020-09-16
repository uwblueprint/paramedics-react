import React from 'react';
import clsx from 'clsx';
import { Typography, ClickAwayListener } from '@material-ui/core';
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
    cursor: 'pointer',
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
  styles?: any;
  onClick: () => void;
  name: string;
}

const OptionPopper = ({
  id,
  open,
  anchorEl,
  onClickAway,
  options,
}: {
  id: string;
  open: boolean;
  anchorEl: HTMLButtonElement | null;
  onClickAway: () => void;
  options: Array<Option>;
}) => {
  const classes = useLayout();
  const optionStyles = useOptions();

  return (
    <Popper
      open={open}
      popperOptions={{
        modifiers: { offset: { enabled: true, offset: '-69.5,0' } },
      }}
      anchorEl={anchorEl}
    >
      <ClickAwayListener
        onClickAway={(event) => {
          event.stopPropagation();
          onClickAway();
        }}
      >
        <div>
          <Table className={classes.tablePopper}>
            <TableBody>
              {options.map((option: Option, index: number) => (
                <TableRow
                  hover
                  key={id + String(index)}
                  classes={{ hover: optionStyles.menuHover }}
                  onClick={(event) => {
                    event.stopPropagation();
                    option.onClick();
                  }}
                >
                  <TableCell
                    classes={{
                      root: clsx({
                        [optionStyles.menuCell]: true,
                        [option.styles]: true,
                      }),
                    }}
                  >
                    <Typography variant="body2">{option.name}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ClickAwayListener>
    </Popper>
  );
};

export default OptionPopper;
