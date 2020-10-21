import React from 'react';
import { useQuery } from 'react-apollo';
import GoogleMapReact from 'google-map-react';

import MenuAppBar from '../common/MenuAppBar';
import InfoWindow from './InfoWindow';
import { LocationPin, GET_PINS_BY_EVENT_ID } from '../../graphql/queries/maps';

const MapPage = ({
  match: {
    params: { eventId },
  },
}: {
  match: { params: { eventId: string } };
}) => {
  const defaultMap = {
    center: { lat: 43.470846, lng: -80.538473 },
    zoom: 11,
  };

  const { data, loading } = useQuery(GET_PINS_BY_EVENT_ID, {
    variables: { eventId },
  });

  const pins: Array<LocationPin> = data && !loading ? data.pinsForEvent : [];
  const [infoWindowOpen, setInfoWindowOpen] = React.useState(false);
  const [interestPinTitle, setInterestPinTitle] = React.useState('');
  const [interestPinLocation, setInterestPinLocation] = React.useState('');

  const renderMarkers = (map, maps) => {
    pins.map((pin) => {
      const marker = new maps.Marker({
        position: { lat: pin.latitude, lng: pin.longitude },
        map,
        title: pin.label,
      });

      map.addListener('click', () => {
        setInfoWindowOpen(false);
        setInterestPinLocation('');
        setInterestPinTitle('');
      });

      marker.addListener('click', () => {
        setInfoWindowOpen(true);
        setInterestPinLocation(pin.address);
        setInterestPinTitle(pin.label);
      });

      return marker;
    });
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MenuAppBar pageTitle="Map" eventId={eventId} />
      <InfoWindow
        title={interestPinTitle}
        address={interestPinLocation}
        open={infoWindowOpen}
        handleClose={() => setInfoWindowOpen(false)}
      />
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GMAPS }}
        defaultCenter={defaultMap.center}
        defaultZoom={defaultMap.zoom}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => renderMarkers(map, maps)}
      >
        {}
      </GoogleMapReact>
    </div>
  );
};

export default MapPage;
