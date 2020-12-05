import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import RoomIcon from '@material-ui/icons/Room';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import { Colours } from '../../styles/Constants';

const useStyles = makeStyles({
  root: {
    color: Colours.Marker,
    textAlign: 'center',
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
  },
  currentLocation: {
    color: Colours.CurrentLocationMarker,
  },
  notClicked: {
    color: Colours.MarkerNotClicked,
  },
});

const Marker = ({
  /* eslint-disable */
  lat,
  lng,
  /* eslint-enable */
  isCurrentLocation,
  otherClicked,
  render,
  onClick,
}: {
  lat: number;
  lng: number;
  isCurrentLocation?: boolean;
  otherClicked?: boolean;
  render: boolean;
  onClick?: () => void;
}) => {
  const styles = useStyles();
  if (isCurrentLocation) {
    return <RadioButtonCheckedIcon className={styles.currentLocation} />;
  }
  if(render) {
    return (
      <RoomIcon
        onClick={onClick}
        fontSize="large"
        className={otherClicked ? styles.notClicked : styles.root}
      />
    );
  }
  return null;
};

export default Marker;
