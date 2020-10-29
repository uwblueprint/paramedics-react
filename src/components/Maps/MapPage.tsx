import React, { useEffect } from 'react';
import { useQuery } from 'react-apollo';
import GoogleMapReact from 'google-map-react';

import MenuAppBar from '../common/MenuAppBar';
import InfoWindow from './InfoWindow';
import Marker from './Marker';
import { LocationPin, GET_PINS_BY_EVENT_ID } from '../../graphql/queries/maps';

interface Marker {
  lat: number;
  lng: number;
}

const MapPage = ({
  match: {
    params: { eventId },
  },
}: {
  match: { params: { eventId: string } };
}) => {
  const getMapOptions = (maps) => {
    return {
      streetViewControl: false,
      scaleControl: true,
      fullscreenControl: false,
      styles: [
        {
          featureType: 'poi.business',
          elementType: 'labels',
          stylers: [
            {
              visibility: 'off',
            },
          ],
        },
      ],
      gestureHandling: 'greedy',
      disableDoubleClickZoom: true,

      mapTypeControl: true,
      mapTypeId: maps.MapTypeId.ROADMAP,
      mapTypeControlOptions: {
        style: maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: maps.ControlPosition.BOTTOM_CENTER,
        mapTypeIds: [
          maps.MapTypeId.ROADMAP,
          maps.MapTypeId.SATELLITE,
          maps.MapTypeId.HYBRID,
        ],
      },

      zoomControl: true,
      clickableIcons: false,
    };
  };

  const { data, loading } = useQuery(GET_PINS_BY_EVENT_ID, {
    variables: { eventId },
  });

  const pins: Array<LocationPin> = data && !loading ? data.pinsForEvent : [];
  const [currentLocationPin, setCurrentLocationPin] = React.useState({ lat: 0, lng: 0});
  const [infoWindowOpen, setInfoWindowOpen] = React.useState(false);
  const [interestPinTitle, setInterestPinTitle] = React.useState('');
  const [interestPinLocation, setInterestPinLocation] = React.useState('');
  const [center, setCenter] = React.useState([43.470846, -80.538473]);
  const zoom = 11;

  useEffect(() => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position: Position) => {
          setCurrentLocationPin({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        });
      }
  })

  const onMarkerClick = (pin) => {
    setInfoWindowOpen(true);
    setInterestPinLocation(pin.address);
    setInterestPinTitle(pin.label);
  };

  const onMapChildClick = (key, childProps) => {
    setCenter([childProps.lat, childProps.lng]);
  };

  return (
    <>
      <MenuAppBar pageTitle="Map" eventId={eventId} selectedMaps />
      <InfoWindow
        title={interestPinTitle}
        address={interestPinLocation}
        open={infoWindowOpen}
        handleClose={() => setInfoWindowOpen(false)}
      />
      <div style={{ height: '92vh', width: '100%', overflow: 'hidden' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_GMAPS }}
          center={center}
          zoom={zoom}
          options={getMapOptions}
          yesIWantToUseGoogleMapApiInternals
          onChildClick={onMapChildClick}
        >
          {pins.map((pin) => (
            <Marker
              key={pin.id}
              lat={pin.latitude} 
              lng={pin.longitude}
              onClick={() => { onMarkerClick(pin) }}
            />
          ))}
          <Marker
            lat={currentLocationPin.lat}
            lng={currentLocationPin.lng}
            isCurrentLocation
          />
        </GoogleMapReact>
      </div>
    </>
  );
};

export default MapPage;
