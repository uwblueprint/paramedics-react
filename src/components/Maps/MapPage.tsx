import React from 'react';
import { useQuery } from 'react-apollo';
import GoogleMapReact from 'google-map-react';

import MenuAppBar from '../common/MenuAppBar';
import Pin from './Pin';
import { LocationPin, GET_PINS_BY_EVENT_ID } from '../../graphql/queries/maps';

const MapPage = ({
  match: {
    params: { eventId },
  },
}: {
  match: { params: { eventId: string } };
}) => {
  // Default coordinates and zoom centred at the Univerity of Waterloo
  const defaultProps = {
    center: { lat: 43.470846, lng: -80.538473 },
    zoom: 11,
  };

  // Getting existing pins
  const { data, loading } = useQuery(GET_PINS_BY_EVENT_ID, {
    variables: { eventId },
  });
  const pins: Array<LocationPin> = data && !loading ? data.pinsForEvent : [];
  return (
    <div style={{height: '100vh', width: '100%'}}>
      <MenuAppBar pageTitle="Map" eventId={eventId} />
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GMAPS }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        yesIWantToUseGoogleMapApiInternals
      >
        {pins.map((locationPin) => (
          <Pin
            lat={locationPin.latitude}
            lng={locationPin.longitude}
            label={locationPin.label}
          />
        ))}
      </GoogleMapReact>
    </div>
  );
};

export default MapPage;
