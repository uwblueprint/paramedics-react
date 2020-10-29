import React from 'react';
import { useQuery } from 'react-apollo';
import GoogleMapReact from 'google-map-react';

import MenuAppBar from '../common/MenuAppBar';
import InfoWindow from './InfoWindow';
import Sidebar from './Sidebar';
import AddPinButton from './AddPinButton';
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
  const [infoWindowOpen, setInfoWindowOpen] = React.useState(false);
  const [interestPinTitle, setInterestPinTitle] = React.useState('');
  const [interestPinLocation, setInterestPinLocation] = React.useState('');
  const [openSidebar, setOpenSidebar] = React.useState(false);

  const initMaps = (map, maps) => {
    if (!loading) {
      map.addListener('click', () => {
        setInfoWindowOpen(false);
        setInterestPinLocation('');
        setInterestPinTitle('');
      });
      pins.map((pin) => {
        const marker = new maps.Marker({
          position: { lat: pin.latitude, lng: pin.longitude },
          map,
          title: pin.label,
        });

        marker.addListener('click', () => {
          map.setCenter(marker.getPosition());
          setInfoWindowOpen(true);
          setInterestPinLocation(pin.address);
          setInterestPinTitle(pin.label);
        });

        return marker;
      });

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position: Position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          const marker = new maps.Marker({
            position: pos,
            map,
            title: 'Current position',
          });

          marker.setIcon(
            'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
          );
        });
      }
    }
  };

  const onSidebarClose = () => {
    setOpenSidebar(false);
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
      <Sidebar open={openSidebar} />
      <div style={{ height: '92vh', width: '100%', overflow: 'hidden' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_GMAPS }}
          defaultCenter={defaultMap.center}
          defaultZoom={defaultMap.zoom}
          options={getMapOptions}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => initMaps(map, maps)}
        >
          {}
        </GoogleMapReact>
      </div>
      <AddPinButton handleClick={() => setOpenSidebar(true)}/>
    </>
  );
};

export default MapPage;
