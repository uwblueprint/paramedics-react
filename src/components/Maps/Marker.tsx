/* eslint-disable */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import RoomIcon from '@material-ui/icons/Room';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import { Colours } from '../../styles/Constants';

const useStyles = makeStyles({
  root: {
    color: Colours.Marker,
  },
  currentLocation: {
    color: Colours.CurrentLocationMarker,
  },
  clicked: {
    color: Colours.TriageGreen,
  },
});

const Marker = ({
  lat,
  lng,
  isCurrentLocation,
  isClicked,
  onClick,
}: {
  lat: number;
  lng: number;
  isCurrentLocation?: boolean;
  isClicked?: boolean;
  onClick?: () => void;
}) => {
  const styles = useStyles();
  if (isCurrentLocation) {
    return <RadioButtonCheckedIcon className={styles.currentLocation} />;
  }
  return (
    <RoomIcon
      onClick={onClick}
      fontSize="large"
      className={isClicked ? styles.clicked : styles.root}
    />
  );
};

export default Marker;
