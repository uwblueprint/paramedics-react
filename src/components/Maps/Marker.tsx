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
  root: {
    textAlign: 'center',
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
  },
  currentLocation: {
    color: Colours.CurrentLocationMarker,
    textAlign: 'center',
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
  },
});

const Marker = ({
  /* eslint-disable */
  lat,
  lng,
  isCurrentLocation,
  otherClicked,
  render,
  type,
  isClicked,
  onClick,
}: /* eslint-enable */
{
  lat: number;
  lng: number;
  isCurrentLocation?: boolean;
  otherClicked?: boolean;
  render: boolean;
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
  if (render) {
    return (
      <Icon onClick={onClick} fontSize="large" classes={styles.root}>
        <img alt="pin" src={isClicked ? selectedPin : pinSrc} />
      </Icon>
    );
  }
  return null;
};

export default Marker;
