import React, { useEffect } from 'react';
import { useQuery } from 'react-apollo';
import { useMutation } from '@apollo/react-hooks';
import GoogleMapReact from 'google-map-react';
import Geocode from 'react-geocode';
import MenuAppBar from '../common/MenuAppBar';
import InfoWindow from './InfoWindow';
import Sidebar from './Sidebar';
import AddPinButton from './AddPinButton';
import Marker from './Marker';
import {
  LocationPin,
  GET_PINS_BY_EVENT_ID,
  PinType,
} from '../../graphql/queries/maps';
import { ADD_PIN, EDIT_PIN, DELETE_PIN } from '../../graphql/mutations/maps';
import ConfirmModal from '../common/ConfirmModal';

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
  const [interestPinId, setInterestPinId] = React.useState('');
  const [mapTypeId, setMapTypeId] = React.useState(MapTypes.ROADMAP);
  const [openSidebar, setOpenSidebar] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [isDeleteClicked, setIsDeleteClicked] = React.useState(false);
  const [isDeleteConfirmed, setIsDeleteConfirmed] = React.useState(false);
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

  useEffect(() => {
    if (isDeleteConfirmed) {
      setInfoWindowOpen(false);
      setIsDeleteClicked(false);
      setInterestPinId('');
      setInterestPinLocation('');
      setInterestPinTitle('');
      setIsDeleteConfirmed(false);
    }
  }, [isDeleteConfirmed]);

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

  const [editPin] = useMutation(EDIT_PIN);

  const [deletePin] = useMutation(DELETE_PIN, {
    update(cache, { data: { deleteLocationPin } }) {
      if (!deleteLocationPin) {
        return;
      }

      // Update GET_PINS_BY_EVENT_ID
      const { pinsForEvent } = cache.readQuery<any>({
        query: GET_PINS_BY_EVENT_ID,
        variables: { eventId },
      });

      const updatedPinsList = pinsForEvent.filter(
        (pin) => pin.id !== deleteLocationPin
      );

      cache.writeQuery({
        query: GET_PINS_BY_EVENT_ID,
        variables: { eventId },
        data: { pinsForEvent: updatedPinsList },
      });
    },
  });

  const onInfoWindowClose = () => {
    setInfoWindowOpen(false);
    setInterestPinLocation('');
    setInterestPinTitle('');
    setInterestPinId('');
  };

  const onMarkerClick = (pin) => {
    setInfoWindowOpen(true);
    setInterestPinLocation(pin.address);
    setInterestPinTitle(pin.label);
    setInterestPinId(pin.id);
    setCenter({ lat: pin.latitude, lng: pin.longitude });
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
    setInfoWindowOpen(!!isEdit);
    setIsEdit(false);
  };

  const onAddPinComplete = ({ label, lat, lng, address }) => {
    addPin({
      variables: {
        label,
        eventId,
        latitude: lat,
        longitude: lng,
        address,
        pinType: PinType.OTHER,
      },
    });
    setOpenSidebar(false);
  };

  const onEditClicked = () => {
    setIsEdit(true);
    setInfoWindowOpen(false);
    setOpenSidebar(true);
  };

  const onEditPinComplete = ({ label, lat, lng, address }) => {
    editPin({
      variables: {
        id: interestPinId,
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
    setIsEdit(false);
    setInterestPinTitle(label);
    setInterestPinLocation(address);
    setInfoWindowOpen(true);
  };

  const onDeleteClick = () => {
    setIsDeleteClicked(true);
  };

  const onDeletePinCancel = () => {
    setIsDeleteClicked(false);
    setInfoWindowOpen(true);
    setIsDeleteConfirmed(false);
  };

  const onDeletePinConfirm = () => {
    setIsDeleteConfirmed(true);
    deletePin({
      variables: {
        id: interestPinId,
      },
    });
  };

  return (
    <>
      <MenuAppBar pageTitle="Map" eventId={eventId} selectedMaps />
      <InfoWindow
        title={interestPinTitle}
        address={interestPinLocation}
        open={infoWindowOpen}
        handleEditClick={onEditClicked}
        handleClose={onInfoWindowClose}
        handleDeleteClicked={onDeleteClick}
      />
      <Sidebar
        open={openSidebar}
        onClose={onSidebarClose}
        title={isEdit ? 'Edit a location pin' : 'Add a location pin'}
        clickedAddress={tempMarkerClick ? tempMarkerAddress : undefined}
        clickedLocation={tempMarkerClick ? tempMarkerLocation : undefined}
        onSuggestionTempMarkerSet={onSuggestionTempMarkerSet}
        setTempMarkerClick={() => {
          setTempMarkerClick(false);
        }}
        onComplete={
          isEdit
            ? ({ label, latitude, longitude, address }) =>
                onEditPinComplete({
                  label,
                  lat: latitude,
                  lng: longitude,
                  address,
                })
            : ({ label, latitude, longitude, address }) =>
                onAddPinComplete({
                  label,
                  lat: latitude,
                  lng: longitude,
                  address,
                })
        }
        editLabel={interestPinTitle && isEdit ? interestPinTitle : ''}
        editAddress={interestPinLocation && isEdit ? interestPinLocation : ''}
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
            (!tempMarkerClick || interestPinId !== pin.id || !isEdit) && (
              <Marker
              key={pin.id}
              lat={pin.latitude}
              lng={pin.longitude}
              isClicked={interestPinTitle === pin.label}
              type={pin.pinType}
              onClick={() => {
                onMarkerClick(pin);
              }}
            />
            )
          ))}
          <Marker
            lat={currentLocationPin.lat}
            lng={currentLocationPin.lng}
            isCurrentLocation
          />
          {tempMarkerClick && (
            <Marker
              lat={tempMarkerLocation.lat}
              lng={tempMarkerLocation.lng}
            />
          )}
        </GoogleMapReact>
      </div>
      <AddPinButton
        handleClick={() => {
          setInfoWindowOpen(false);
          setOpenSidebar(true);
        }}
      />
      <ConfirmModal
        open={isDeleteClicked}
        handleClickCancel={onDeletePinCancel}
        handleClickAction={onDeletePinConfirm}
        title="You are about to delete a location pin."
        body="Deleted location pins will no longer be accessible to other team members. Are you sure you want to delete this pin?"
        actionLabel="Delete"
        isActionDelete
      />
    </>
  );
};

export default MapPage;
