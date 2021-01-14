import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import Typography from '@material-ui/core/Typography';
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
    overflow: 'visible',
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
  /* eslint-enable */
  label,
  zoom,
  isCurrentLocation,
  type,
  isClicked,
  onClick,
}: {
  lat: number;
  lng: number;
  label?: string;
  zoom?: number;
  isCurrentLocation?: boolean;
  type?: PinType;
  isClicked?: boolean;
  onClick?: (e: any) => void;
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
    <>
      {zoom && zoom > 15 && (
        <div style={{ width: '200px', transform: 'translate(-20%, -50%)' }}>
          <Typography>{label}</Typography>
        </div>
      )}
      <Icon
        onClick={onClick}
        fontSize="large"
        className={styles.root}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <img alt="pin" src={isClicked ? selectedPin : pinSrc} />
      </Icon>
    </>
  );
};

export default Marker;
