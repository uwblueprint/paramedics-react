import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import { Colours } from '../../styles/Constants';

import { PinType } from '../../graphql/queries/maps';
import ccpPin from '../../assets/ccpPin.svg';
import selectedPin from '../../assets/currentSelectPin.svg';
import eventPin from '../../assets/eventPin.svg';
import otherPin from '../../assets/otherPin.svg';

const useStyles = makeStyles({
  currentLocation: {
    color: Colours.CurrentLocationMarker,
  },
});

const Marker = ({
  /* eslint-disable */
  lat,
  lng,
  /* eslint-enable */
  isCurrentLocation,
  type,
  isClicked,
  onClick,
}: {
  lat: number;
  lng: number;
  isCurrentLocation?: boolean;
  type?: PinType;
  isClicked?: boolean;
  onClick?: () => void;
}) => {
  const styles = useStyles();
  const pinSrc =
    type === PinType.EVENT
      ? eventPin
      : type === PinType.CCP
      ? ccpPin
      : otherPin;
  if (isCurrentLocation) {
    return <RadioButtonCheckedIcon className={styles.currentLocation} />;
  }
  return (
    <Icon onClick={onClick} fontSize="large">
      <img alt="pin" src={isClicked ? selectedPin : pinSrc} />
    </Icon>
  );
};

export default Marker;
