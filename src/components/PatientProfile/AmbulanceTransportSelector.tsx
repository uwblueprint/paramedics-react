import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Typography,
  makeStyles,
  Radio,
  RadioGroup,
  FormControlLabel,
  Container,
  IconButton,
} from '@material-ui/core';
import { Ambulance } from '../../graphql/queries/ambulances';
import { Colours } from '../../styles/Constants';
import AddIcon from '@material-ui/icons/Add';

const useRadioStyles = makeStyles({
  root: {
    display: 'block',
    padding: '20px',
    border: '1px solid #E8E8E8',
    boxSizing: 'border-box',
    borderRadius: '10px',
    backgroundColor: '#FFFFFF',
    marginBottom: '20px',
    width: '100%',
    maxWidth: '100%',
    '& .MuiInput-formControl': {
      marginTop: 'auto',
    },

    '& label.Mui-focused': {
      color: '#2E5584',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#2E5584',
    },
  },
  label: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: '18px',
    display: 'inline-block',
    transform: 'scale(0.75)',
    transformOrigin: 'top left'
  },
  addLabel: {
    color: Colours.Secondary,
    display: 'inline',
    fontSize: '18px',
    fontWeight: 500,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  addRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  nameTitle: {
    display: 'flex',
    verticalAlign: 'middle',
    alignContent: 'center',
    alignItems: 'initial',
  },
  controlLabel: {
    marginLeft: 0,
  },
});

const AmbulanceTransportSelector = ({
  options,
  currentValue,
  handleChange,
}: {
  options: Array<Ambulance>;
  currentValue: string;
  handleChange: (e: React.ChangeEvent<HTMLElement>) => void;
}) => {
  const classes = useRadioStyles();
  const history = useHistory();

  return (
    <Container className={classes.root}>
      <span className={classes.nameTitle}>
        <Typography variant="body1" className={classes.label}>
          *Ambulance Name:
        </Typography>
      </span>
      <RadioGroup
        value={currentValue}
        onChange={handleChange}
      >
        {options.map((ambulance) => (
          <FormControlLabel
            className={classes.controlLabel}
            value={ambulance.id}
            control={<Radio />}
            label={`#${ambulance.vehicleNumber}`}
            key={ambulance.id}
          />
        ))}
        <div className={classes.addRow}>
          <IconButton style={{ padding: '0px 3.5px'}}>
            <AddIcon
              fontSize="large"
              style={{ color: Colours.Secondary }}
              onClick={() => {
                history.replace(`/manage/ambulances/new`);
              }}
            />
          </IconButton>
          <Typography className={classes.addLabel}>
            Select Other Ambulances to Assign
          </Typography>
        </div>
      </RadioGroup>
    </Container>
  );
};

export default AmbulanceTransportSelector;
