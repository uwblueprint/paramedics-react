import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import Typography from '@material-ui/core/Typography';
import { AccessLevel } from '../../graphql/queries/users';

const useAccessLevelStyles = makeStyles({
  root: {
    border: '1px solid #E8E8E8',
    boxSizing: 'border-box',
    borderRadius: '10px',
    backgroundColor: '#FFFFFF',
    padding: '0',
    marginTop: '0px',
    marginBottom: '24px',
    maxHeight: '15vh',
    width: '100%',
    maxWidth: '100%',
    '& .MuiInput-formControl': {
      marginTop: 'auto',
    },
  },
  label: {
    fontWeight: 'bold',
    margin: '20px',
    color: 'black',
    fontSize: '18px',
    display: 'inline-block',
    transform: 'translate(0, 1.5px) scale(0.75)',
  },
  statusPill: {
    color: '#2E5584',
    border: '#2E5584 solid 1px',
    marginRight: '20px',
    borderRadius: '4px',
  },
  selectedPill: {
    backgroundColor: '#C6D7EB !important',
    color: '#2E5584 !important',
    fontWeight: 'bold',
  },
  buttonGroup: {
    '&:not(:first-child)': {
      border: '#3f51b5 solid 1px',
      borderRadius: '4px',
    },
    '&:not(:last-child)': {
      borderRadius: '4px',
    },
  },
});

const AccessLevelSelector = ({
  currentValue,
  handleChange,
}: {
  currentValue: number;
  handleChange: (
    e: React.MouseEvent<HTMLElement>,
    newRole: AccessLevel
  ) => void;
}) => {
  const classes = useAccessLevelStyles();
  const accessLevels = [
    { label: 'Commander', roleId: 1 },
    { label: 'Supervisor', roleId: 2 },
    { label: 'Dispatch', roleId: 3 },
  ];
  return (
    <Container className={classes.root}>
      <Typography className={classes.label}>*Role:</Typography>
      <ToggleButtonGroup
        value={currentValue}
        exclusive
        onChange={handleChange}
        classes={{
          groupedHorizontal: classes.buttonGroup,
        }}
      >
        {accessLevels.map((accessLevel) => (
          <ToggleButton
            value={String(accessLevel.roleId)}
            classes={{
              root: classes.statusPill,
              selected: classes.selectedPill,
            }}
            key={accessLevel.roleId}
          >
            <Typography variant="body2">{accessLevel.label}</Typography>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Container>
  );
};

export default AccessLevelSelector;
