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
  tempRender,
  onClick,
}: {
  lat: number;
  lng: number;
  isCurrentLocation?: boolean;
  otherClicked?: boolean;
  tempRender: boolean;
  onClick?: () => void;
}) => {
  const styles = useStyles();
  if (isCurrentLocation) {
    return <RadioButtonCheckedIcon className={styles.currentLocation} />;
  }
  if(tempRender) {
    return (
      <RoomIcon
        onClick={onClick}
        fontSize="large"
        className={otherClicked ? styles.notClicked : styles.root}
      />
    );
  } else {
    return null;
  }
};

export default Marker;
