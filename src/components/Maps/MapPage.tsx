import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery } from 'react-apollo';
import { useMutation } from '@apollo/react-hooks';
import GoogleMapReact from 'google-map-react';
import Geocode from 'react-geocode';
import { useSnackbar } from 'notistack';
import MenuAppBar from '../common/MenuAppBar';
import InfoWindow from './InfoWindow';
import Sidebar from './Sidebar';
import AddPinButton from './AddPinButton';
import Marker from './Marker';
import { LocationPin, GET_PINS_BY_EVENT_ID } from '../../graphql/queries/maps';
import { ADD_PIN } from '../../graphql/mutations/maps';
import {
  Event,
  GET_ALL_EVENTS,
  GET_EVENT_BY_ID,
} from '../../graphql/queries/events';
import { ADD_EVENT, EDIT_EVENT } from '../../graphql/mutations/events';
import {
  GET_CCP_BY_ID,
  GET_CCPS_BY_EVENT_ID,
  CCP,
} from '../../graphql/queries/ccps';
import { ADD_CCP, EDIT_CCP } from '../../graphql/mutations/ccps';

enum MapTypes {
  ROADMAP = 'roadmap',
  HYBRID = 'hybrid',
}

enum MapModes {
  Map = 'map',
  NewEvent = 'newEvent',
  NewCCP = 'newCCP',
  EditEvent = 'editEvent',
  EditCCP = 'editCCP',
}

const MapPage = ({
  match: {
    params: { eventId, ccpId },
  },
  mode,
}: {
  match: { params: { eventId: string, ccpId?: string }; };
  mode: string;
}) => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const pinResults = useQuery(GET_PINS_BY_EVENT_ID, {
    skip: mode !== MapModes.Map,
    variables: { eventId },
  });
  const pins: Array<LocationPin> = pinResults.data && !pinResults.loading ? pinResults.data.pinsForEvent : [];

  const eventResults = useQuery(
    mode === MapModes.EditEvent && eventId ? GET_EVENT_BY_ID : GET_ALL_EVENTS,
    {
      skip: !(mode === MapModes.EditEvent || mode === MapModes.NewEvent),
      variables: {
        eventId,
      },
    }
  );
  const events: Array<Event> = eventResults.data ? eventResults.data.events : [];

  const ccpResults = useQuery(
    mode === MapModes.EditCCP ? GET_CCP_BY_ID : GET_CCPS_BY_EVENT_ID,
    {
      skip: !(mode === MapModes.EditCCP || mode === MapModes.NewCCP),
      variables: { id: ccpId, eventId },
    }
  );
  const collectionPoint: CCP = ccpResults.data ? ccpResults.data.collectionPoint : null;

  const [currentLocationPin, setCurrentLocationPin] = React.useState({
    lat: 0,
    lng: 0,
  });
  const [center, setCenter] = React.useState({
    lat: 43.470846,
    lng: -80.538473,
  });
  const [tempMarkerClick, setTempMarkerClick] = React.useState(false);
  const [tempMarkerLocation, setTempMarkerLocation] = React.useState({
    lat: 0,
    lng: 0,
  });
  const [tempMarkerAddress, setTempMarkerAddress] = React.useState('');
  const [zoom, setZoom] = React.useState(11);
  const [infoWindowOpen, setInfoWindowOpen] = React.useState(false);
  const [interestPinTitle, setInterestPinTitle] = React.useState('');
  const [interestPinLocation, setInterestPinLocation] = React.useState('');
  const [mapTypeId, setMapTypeId] = React.useState(MapTypes.ROADMAP);
  const [openSidebar, setOpenSidebar] = React.useState(false);
  const defaultMap = {
    zoom,
    center,
  };
  const geolocationErrorCallback = undefined;

  Geocode.setApiKey(process.env.REACT_APP_GMAPS);
  Geocode.setLanguage('en');
  Geocode.setRegion('ca');

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
      navigator.geolocation.getCurrentPosition(
        (position: Position) => {
          setCurrentLocationPin({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        geolocationErrorCallback,
        { enableHighAccuracy: true }
      );
    }
  });

  const [addPin] = useMutation(ADD_PIN, {
    update(cache, { data: { addLocationPin } }) {
      const { pinsForEvent } = cache.readQuery<any>({
        query: GET_PINS_BY_EVENT_ID,
        variables: { eventId },
      });

      cache.writeQuery({
        query: GET_PINS_BY_EVENT_ID,
        variables: { eventId },
        data: { pinsForEvent: [...pinsForEvent, addLocationPin] },
      });
    },
  });

  const [addEvent] = useMutation(ADD_EVENT, {
    update(cache, { data: { addEvent } }) {
      cache.writeQuery({
        query: GET_ALL_EVENTS,
        data: { events: events.concat([addEvent]) },
      });
    },
    onCompleted({ addEvent }) {
      history.replace('/events', { addedEventId: addEvent.id });
    },
    onError() {
      history.replace('/events');
    },
  });

  const [editEvent] = useMutation(EDIT_EVENT, {
    onCompleted() {
      history.replace('/events');
    },
  });

  const [addCCP] = useMutation(ADD_CCP, {
    update(cache, { data: { addCollectionPoint } }) {
      // Update GET_CCPS_BY_EVENT_ID
      const { collectionPointsByEvent } = cache.readQuery<any>({
        query: GET_CCPS_BY_EVENT_ID,
        variables: { eventId },
      });

      cache.writeQuery({
        query: GET_CCPS_BY_EVENT_ID,
        variables: { eventId },
        data: {
          collectionPointsByEvent: collectionPointsByEvent.concat([
            addCollectionPoint,
          ]),
        },
      });
    },
    onCompleted() {
      enqueueSnackbar('CCP added.');
      // TODO: Check for valid eventId
      history.replace(`/events/${eventId}`);
    },
  });

  const [editCCP] = useMutation(EDIT_CCP, {
    onCompleted() {
      enqueueSnackbar('CCP edited.');
      // TODO: Check for valid eventId
      history.replace(`/events/${eventId}`);
    },
  });

  const onMarkerClick = (pin) => {
    setInfoWindowOpen(true);
    setInterestPinLocation(pin.address);
    setInterestPinTitle(pin.label);
    setCenter({ lat: pin.latitude, lng: pin.longitude });
  };

  const onInfoWindowClose = () => {
    setInfoWindowOpen(false);
    setInterestPinLocation('');
    setInterestPinTitle('');
  };

  const onMapClick = (obj: { lat: number; lng: number }) => {
    const { lat, lng } = obj;
    setInfoWindowOpen(false);
    setCenter({ lat, lng });
    setZoom(16);
    setTempMarkerClick(true);
    setTempMarkerLocation({ lat, lng });
    setOpenSidebar(true);
    Geocode.fromLatLng(lat, lng).then((res) => {
      setTempMarkerAddress(res.results[0].formatted_address);
    });
  };

  const onSuggestionTempMarkerSet = ({ lat, lng, address }) => {
    setCenter({ lat, lng });
    setZoom(16);
    setTempMarkerClick(true);
    setTempMarkerLocation({ lat, lng });
    setTempMarkerAddress(address);
  };

  const mapTypeIdListener = (mapObject) => {
    mapObject.map.addListener('maptypeid_changed', () => {
      setMapTypeId(mapObject.map.getMapTypeId());
    });
  };

  const onSidebarClose = () => {
    setOpenSidebar(false);
    setTempMarkerClick(false);
  };

  const onAddPinComplete = ({ label, lat, lng, address }) => {
    addPin({
      variables: {
        label,
        eventId,
        latitude: lat,
        longitude: lng,
        address,
      },
    });
    setCenter({ lat, lng });
    setZoom(16);
    setOpenSidebar(false);
    setTempMarkerClick(false);
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
      <Sidebar
        open={openSidebar}
        onClose={onSidebarClose}
        title="Add a location pin"
        clickedAddress={tempMarkerClick ? tempMarkerAddress : undefined}
        clickedLocation={tempMarkerClick ? tempMarkerLocation : undefined}
        onSuggestionTempMarkerSet={onSuggestionTempMarkerSet}
        setTempMarkerClick={() => {
          setTempMarkerClick(false);
        }}
        onComplete={({ label, latitude, longitude, address }) =>
          onAddPinComplete({
            label,
            lat: latitude,
            lng: longitude,
            address,
          })
        }
      />
      <div style={{ height: '92vh', width: '100%', overflow: 'hidden' }}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: process.env.REACT_APP_GMAPS,
            libraries: ['places'],
          }}
          center={[center.lat, center.lng]}
          zoom={defaultMap.zoom}
          options={getMapOptions}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={(mapObject) => mapTypeIdListener(mapObject)}
          onClick={(obj) => onMapClick(obj)}
        >
          {pins.map((pin) => (
            <Marker
              key={pin.id}
              lat={pin.latitude}
              lng={pin.longitude}
              otherClicked={
                interestPinTitle !== '' && interestPinTitle !== pin.label
              }
              onClick={() => {
                onMarkerClick(pin);
              }}
              render
            />
          ))}
          <Marker
            lat={currentLocationPin.lat}
            lng={currentLocationPin.lng}
            isCurrentLocation
            render
          />
          <Marker
            lat={tempMarkerLocation.lat}
            lng={tempMarkerLocation.lng}
            render={tempMarkerClick}
          />
        </GoogleMapReact>
      </div>
      <AddPinButton handleClick={() => setOpenSidebar(true)} />
    </>
  );
};

export default MapPage;
