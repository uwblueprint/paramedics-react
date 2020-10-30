/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { useQuery } from 'react-apollo';
import GoogleMapReact from 'google-map-react';

import MenuAppBar from '../common/MenuAppBar';
import InfoWindow from './InfoWindow';
import Marker from './Marker';
import { LocationPin, GET_PINS_BY_EVENT_ID } from '../../graphql/queries/maps';

enum MapTypes {
  ROADMAP = 'roadmap',
  HYBRID = 'hybrid',
}

const MapPage = ({
  match: {
    params: { eventId },
  },
}: {
  match: { params: { eventId: string } };
}) => {
  const { data, loading } = useQuery(GET_PINS_BY_EVENT_ID, {
    variables: { eventId },
  });
  const pins: Array<LocationPin> = data && !loading ? data.pinsForEvent : [];
  const [currentLocationPin, setCurrentLocationPin] = React.useState({
    lat: 0,
    lng: 0,
  });
  const [infoWindowOpen, setInfoWindowOpen] = React.useState(false);
  const [interestPinTitle, setInterestPinTitle] = React.useState('');
  const [interestPinLocation, setInterestPinLocation] = React.useState('');
  const [mapTypeId, setMapTypeId] = React.useState(MapTypes.ROADMAP);
  const defaultMap = {
    zoom: 11,
    center: {
      lat: 43.470846, 
      lng: -80.538473,
    },
  };

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
      mapTypeId:
        mapTypeId === MapTypes.ROADMAP
          ? maps.MapTypeId.ROADMAP
          : maps.MapTypeId.HYBRID,
      mapTypeControlOptions: {
        style: maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: maps.ControlPosition.BOTTOM_CENTER,
        mapTypeIds: [maps.MapTypeId.ROADMAP, maps.MapTypeId.HYBRID],
      },

      zoomControl: true,
      clickableIcons: false,
    };
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: Position) => {
        setCurrentLocationPin({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  });

  const onMarkerClick = (pin) => {
    setInfoWindowOpen(true);
    setInterestPinLocation(pin.address);
    setInterestPinTitle(pin.label);
  };

  const onInfoWindowClose = () => {
    setInfoWindowOpen(false);
    setInterestPinLocation('');
    setInterestPinTitle('');
  };

  const mapTypeIdListener = (mapObject) => {
    mapObject.map.addListener('maptypeid_changed', () => {
      setMapTypeId(mapObject.map.getMapTypeId());
    });
  };

  return (
    <>
      <MenuAppBar pageTitle="Map" eventId={eventId} selectedMaps />
      <InfoWindow
        title={interestPinTitle}
        address={interestPinLocation}
        open={infoWindowOpen}
        handleClose={onInfoWindowClose}
      />
      <div style={{ height: '92vh', width: '100%', overflow: 'hidden' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_GMAPS }}
          center={[defaultMap.center.lat, defaultMap.center.lng]}
          zoom={defaultMap.zoom}
          options={getMapOptions}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={(mapObject) => mapTypeIdListener(mapObject)}
        >
          {pins.map((pin) => (
            <Marker
              key={pin.id}
              lat={pin.latitude}
              lng={pin.longitude}
              isClicked={pin.address === interestPinLocation}
              onClick={() => {
                onMarkerClick(pin);
              }}
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
