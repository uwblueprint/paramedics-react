import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import { Colours } from '../../styles/Constants';

import { PinType } from '../../graphql/queries/maps';
import ccpPin from '../../assets/ccpPin.svg';
import currentSelectPin from '../../assets/currentSelectPin.svg';
import eventPin from '../../assets/eventPin.svg';
import otherPin from '../../assets/otherPin.svg';

const useStyles = makeStyles({
  root: {
    backgroundImage: `url(${otherPin})`,
  },
  currentLocation: {
    color: Colours.CurrentLocationMarker,
  },
  clicked: {
    backgroundImage: `url(${currentSelectPin})`,
  },
  eventPin: {
    backgroundImage: `url(${eventPin})`,
  },
  ccpPin: {
    backgroundImage: `url(${ccpPin})`,
  },
});

const Marker = ({
  /* eslint-disable */
  lat,
  lng,
  /* eslint-enable */
  isCurrentLocation,
  type,
  clicked,
  onClick,
}: {
  lat: number;
  lng: number;
  isCurrentLocation?: boolean;
  type?: PinType;
  clicked?: boolean;
  onClick?: () => void;
}) => {
  const styles = useStyles();
  if (isCurrentLocation) {
    return <RadioButtonCheckedIcon className={styles.currentLocation} />;
  }
  return (
    <Icon onClick={onClick} fontSize="large">
      <img
        alt="pin"
        src={
          clicked
            ? currentSelectPin
            : type === PinType.EVENT
            ? eventPin
            : type === PinType.CCP
            ? ccpPin
            : otherPin
        }
      />
    </Icon>
  );
};

export default Marker;
