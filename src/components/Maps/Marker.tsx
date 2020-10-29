/* eslint-disable */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import RoomIcon from '@material-ui/icons/Room';
import { Colours } from '../../styles/Constants';

const useStyles = makeStyles({
  root: {
    color: Colours.Marker,
  },
  currentLocation: {
    color: Colours.TriageGreen,
  },
});

const Marker = ({
  lat,
  lng,
  isCurrentLocation,
  onClick,
}: {
  lat: number;
  lng: number;
  isCurrentLocation?: boolean;
  onClick?: () => void;
}) => {
  const styles = useStyles();
  return (
    <RoomIcon
      onClick={onClick}
      fontSize='large'
      className={
        isCurrentLocation ? styles.currentLocation : styles.root
      }
    />
  );
};

export default Marker;
