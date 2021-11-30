import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card';

import mapImage from '../../map.png';

const useMapStyles = makeStyles({
  root: {
    borderRadius: '10px',
  },
  media: {
    width: '100%',
    border: '0px',
    height: '40vh',
  },
});

const Map: React.FC = () => {
  const classes = useMapStyles();
  return (
    <Card className={classes.root}>
      <CardMedia image={mapImage} className={classes.media} />
    </Card>
  );
};

export default Map;