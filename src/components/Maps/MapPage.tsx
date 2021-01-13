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
import {
  LocationPin,
  GET_PINS_BY_EVENT_ID,
  GET_ALL_PINS,
  PinType,
  MapTypes,
  MapModes,
} from '../../graphql/queries/maps';
import { ADD_PIN, EDIT_PIN, DELETE_PIN } from '../../graphql/mutations/maps';
import SidebarResults from './SidebarResults';
import ConfirmModal from '../common/ConfirmModal';
import LoadingState from '../common/LoadingState';

const MapPage = ({
  match: {
    params: { eventId, ccpId },
  },
  mode,
}: {
  match: { params: { eventId: string; ccpId?: string } };
  mode: string;
}) => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const pinResults = useQuery(GET_PINS_BY_EVENT_ID, {
    skip: mode === MapModes.NewEvent,
    variables: { eventId },
  });

  const pins: Array<LocationPin> =
    pinResults.data && !pinResults.loading ? pinResults.data.pinsForEvent : [];

  const eventResults = useQuery(
    (mode === MapModes.EditEvent || mode === MapModes.Map) && eventId
      ? GET_EVENT_BY_ID
      : GET_ALL_EVENTS,
    {
      variables: {
        eventId,
      },
    }
  );

  const eventsData: Array<Event> =
    eventResults.data && mode === MapModes.NewEvent
      ? eventResults.data.events
      : eventResults.data &&
        (mode === MapModes.EditEvent || mode === MapModes.Map)
      ? [eventResults.data.event]
      : [];

  const eventOfInterest = eventsData[0];

  const ccpResults = useQuery(
    mode === MapModes.EditCCP ? GET_CCP_BY_ID : GET_CCPS_BY_EVENT_ID,
    {
      skip: !(mode === MapModes.EditCCP || mode === MapModes.NewCCP),
      variables: { id: ccpId, eventId },
    }
  );

  const collectionPoint: CCP =
    ccpResults.data && !ccpResults.loading
      ? ccpResults.data.collectionPoint
      : null;
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
  const [interestPinAddress, setInterestPinAddress] = React.useState('');
  const [interestPinId, setInterestPinId] = React.useState('');
  const [interestPinType, setInterestPinType] = React.useState('');
  const [interestPinLocation, setInterestPinLocation] = React.useState({
    lat: 0,
    lng: 0,
  });
  const [mapTypeId, setMapTypeId] = React.useState(MapTypes.ROADMAP);
  const [openSidebar, setOpenSidebar] = React.useState(mode !== MapModes.Map);
  const [sidebarTitle, setSidebarTitle] = React.useState('');
  const [sidebarRender, setSidebarRender] = React.useState(false);
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
      setInterestPinAddress('');
      setInterestPinTitle('');
      setInterestPinLocation({ lat: 0, lng: 0 });
      setIsDeleteConfirmed(false);
    }
  }, [isDeleteConfirmed]);

  useEffect(() => {
    if (!pinResults.loading && !ccpResults.loading && !eventResults.loading) {
      if (mode !== MapModes.Map) {
        if (mode === MapModes.NewCCP) {
          setSidebarTitle('Add a new CCP');
        } else if (mode === MapModes.EditCCP) {
          const ccpPins = pins.filter(
            (pin) => pin.pinType === PinType.CCP && pin.ccpId
          );
          const pinOfInterest = ccpPins.filter(
            (pin) => pin.ccpId.id === ccpId
          )[0];
          setSidebarTitle('Edit a CCP');
          if (pinOfInterest) {
            setCenter({
              lat: pinOfInterest.latitude,
              lng: pinOfInterest.longitude,
            });
            setTempMarkerAddress(pinOfInterest.address);
            setTempMarkerLocation({
              lat: pinOfInterest.latitude,
              lng: pinOfInterest.longitude,
            });
            setInterestPinId(pinOfInterest.id);
          }
          setIsEdit(true);
        } else if (mode === MapModes.NewEvent) {
          setSidebarTitle('Add a new event');
        } else {
          const pinOfInterest = pins.filter(
            (pin) =>
              pin.eventId.id === eventOfInterest.id &&
              pin.pinType === PinType.EVENT
          )[0];
          setSidebarTitle('Edit an event');
          if (pinOfInterest) {
            setCenter({
              lat: pinOfInterest.latitude,
              lng: pinOfInterest.longitude,
            });
            setTempMarkerAddress(pinOfInterest.address);
            setTempMarkerLocation({
              lat: pinOfInterest.latitude,
              lng: pinOfInterest.longitude,
            });
            setInterestPinId(pinOfInterest.id);
          }
          setIsEdit(true);
        }
      } else {
        const pinOfInterest = pins.filter(
          (pin) =>
            pin.eventId.id === eventOfInterest.id &&
            pin.pinType === PinType.EVENT
        )[0];
        if (pinOfInterest) {
          setCenter({
            lat: pinOfInterest.latitude,
            lng: pinOfInterest.longitude,
          });
        }
        setSidebarTitle(isEdit ? 'Edit a location pin' : 'Add a location pin');
      }
    }
  }, [
    mode,
    isEdit,
    ccpResults.loading,
    ccpId,
    eventResults.loading,
    pinResults.loading,
    pins,
    eventOfInterest,
  ]);

  const [addPin] = useMutation(ADD_PIN, {
    update(cache, { data: { addLocationPin } }) {
      if (mode === MapModes.NewEvent) {
        cache.writeQuery({
          query: GET_PINS_BY_EVENT_ID,
          variables: { eventId: addLocationPin.eventId.id },
          data: { pinsForEvent: [addLocationPin] },
        });

        const { pins } = cache.readQuery<any>({
          query: GET_ALL_PINS,
        });

        cache.writeQuery({
          query: GET_ALL_PINS,
          data: { pins: [...pins, addLocationPin] },
        });
      } else {
        const { pinsForEvent } = cache.readQuery<any>({
          query: GET_PINS_BY_EVENT_ID,
          variables: { eventId },
        });

        cache.writeQuery({
          query: GET_PINS_BY_EVENT_ID,
          variables: { eventId },
          data: { pinsForEvent: [...pinsForEvent, addLocationPin] },
        });

        const { pins: allPins } = cache.readQuery<any>({
          query: GET_ALL_PINS,
        });

        cache.writeQuery({
          query: GET_ALL_PINS,
          data: { pins: [...allPins, addLocationPin] },
        });
      }
    },
    onCompleted(data) {
      if (mode === MapModes.NewCCP) {
        enqueueSnackbar('CCP added.');
        // TODO: Check for valid eventId
        history.replace(`/events/${eventId}`);
      } else if (mode === MapModes.NewEvent) {
        history.replace('/events', {
          addedEventId: data.addLocationPin.eventId.id,
        });
      }
    },
  });

  const [addEvent] = useMutation(ADD_EVENT, {
    update(cache, { data: { addEvent } }) {
      const { events } = cache.readQuery<any>({
        query: GET_ALL_EVENTS,
      });

      cache.writeQuery({
        query: GET_ALL_EVENTS,
        data: { events: [...events, addEvent] },
      });
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
  });

  const [editCCP] = useMutation(EDIT_CCP, {
    onCompleted() {
      if (mode === MapModes.EditCCP) {
        enqueueSnackbar('CCP edited.');
        // TODO: Check for valid eventId
        history.replace(`/events/${eventId}`);
      }
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

      // Update GET_ALL_PINS
      const { pins } = cache.readQuery<any>({
        query: GET_ALL_PINS,
      });

      const updatedAllPins = pins.filter((pin) => pin.id !== deleteLocationPin);

      cache.writeQuery({
        query: GET_ALL_PINS,
        data: { pins: updatedAllPins },
      });
    },
  });

  if (pinResults.loading || ccpResults.loading || eventResults.loading) {
    return <LoadingState />;
  }

  const onInfoWindowClose = () => {
    setInfoWindowOpen(false);
    setInterestPinAddress('');
    setInterestPinTitle('');
    setInterestPinId('');
    setInterestPinType('');
    setInterestPinLocation({ lat: 0, lng: 0 });
  };

  const onMarkerClick = (pin) => {
    if (!openSidebar) {
      setInfoWindowOpen(true);
      setInterestPinType(pin.pinType);
      setInterestPinAddress(pin.address);
      setInterestPinTitle(pin.label);
      setInterestPinId(pin.id);
      setCenter({ lat: pin.latitude, lng: pin.longitude });
      setInterestPinLocation({ lat: pin.latitude, lng: pin.longitude });
    }
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
    setSidebarRender(true);
  };

  const onSidebarClose = () => {
    if (mode === MapModes.EditCCP || mode === MapModes.NewCCP) {
      history.replace(`/events/${eventId}`);
    } else if (mode === MapModes.NewEvent || mode === MapModes.EditEvent) {
      history.replace('/events');
    } else {
      setOpenSidebar(false);
      setTempMarkerClick(false);
      setInfoWindowOpen(!!isEdit);
      setIsEdit(false);
    }
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
    setTempMarkerClick(false);
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
    setInterestPinAddress(address);
    setInterestPinLocation({ lat, lng });
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

  const onEventComplete = ({ name, eventDate, lat, lng, address }) => {
    if (mode === MapModes.NewEvent) {
      addEvent({
        variables: {
          name,
          eventDate,
          createdBy: 1, // TODO: change this to proper user
          isActive: true,
        },
      }).then((addEventData) => {
        addPin({
          variables: {
            label: name,
            eventId: addEventData.data.addEvent.id,
            latitude: lat,
            longitude: lng,
            address,
            pinType: PinType.EVENT,
          },
        });
      });
    } else if (mode === MapModes.EditEvent) {
      const eventPin = pins.filter(
        (pin) => pin.eventId.id === eventId && pin.pinType === PinType.EVENT
      );
      if (eventPin && eventPin.length > 0) {
        editPin({
          variables: {
            id: eventPin[0].id,
            label: name,
            eventId,
            latitude: lat,
            longitude: lng,
            address,
          },
        });
      } else {
        addPin({
          variables: {
            label: name,
            eventId,
            latitude: lat,
            longitude: lng,
            address,
            pinType: PinType.EVENT,
          },
        });
      }
      editEvent({
        variables: {
          id: eventId,
          name,
          eventDate,
          createdBy: 1,
          isActive: true,
        },
      });
    }
  };

  const onCCPComplete = ({ name, lat, lng, address }) => {
    if (mode === MapModes.NewCCP) {
      addCCP({
        variables: {
          name,
          eventId,
          createdBy: 1,
        },
      }).then((addCCPData) => {
        addPin({
          variables: {
            label: name,
            eventId,
            latitude: lat,
            longitude: lng,
            address,
            pinType: PinType.CCP,
            ccpId: addCCPData.data.addCollectionPoint.id,
          },
        });
      });
    } else if (mode === MapModes.EditCCP) {
      const allCCPPins = pins.filter(
        (pin) => pin.ccpId && pin.pinType === PinType.CCP
      );
      const ccpPin = allCCPPins.filter((pin) => pin.ccpId.id === ccpId);
      if (ccpPin && ccpPin.length > 0) {
        editPin({
          variables: {
            id: ccpPin[0].id,
            label: name,
            eventId,
            latitude: lat,
            longitude: lng,
            address,
          },
        });
      } else {
        addPin({
          variables: {
            label: name,
            eventId,
            latitude: lat,
            longitude: lng,
            address,
            pinType: PinType.CCP,
            ccpId,
          },
        });
      }
      editCCP({
        variables: {
          id: ccpId,
          name,
          eventId,
        },
      });
    }
  };

  return (
    <>
      {mode === MapModes.Map && (
        <MenuAppBar pageTitle="Map" eventId={eventId} selectedMaps />
      )}
      <InfoWindow
        title={interestPinTitle}
        address={interestPinAddress}
        open={infoWindowOpen}
        type={interestPinType}
        handleEditClick={onEditClicked}
        handleClose={onInfoWindowClose}
        handleDeleteClicked={onDeleteClick}
      />
      {sidebarRender && (
        <Sidebar
          open={openSidebar}
          onClose={onSidebarClose}
          mode={mode}
          title={sidebarTitle}
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
          editLabel={
            interestPinTitle && isEdit
              ? interestPinTitle
              : mode !== MapModes.Map
              ? SidebarResults({
                  mode,
                  pins,
                  ccp: collectionPoint,
                  event: eventsData,
                }).label
              : ''
          }
          editAddress={
            interestPinAddress && isEdit
              ? interestPinAddress
              : mode !== MapModes.Map
              ? SidebarResults({
                  mode,
                  pins,
                  ccp: collectionPoint,
                  event: eventsData,
                }).address
              : ''
          }
          editLocation={
            interestPinAddress && isEdit
              ? interestPinLocation
              : mode !== MapModes.Map
              ? SidebarResults({
                  mode,
                  pins,
                  ccp: collectionPoint,
                  event: eventsData,
                }).location
              : undefined
          }
          editDate={
            mode === MapModes.EditEvent ? eventsData[0].eventDate : undefined
          }
          onEventComplete={onEventComplete}
          onCCPComplete={onCCPComplete}
        />
      )}
      <div
        style={{
          height: mode === MapModes.Map ? '92vh' : '100vh',
          width: '100%',
          overflow: 'hidden',
        }}
      >
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
          {pins.map(
            (pin) =>
              (!tempMarkerClick || interestPinId !== pin.id || !isEdit) && (
                <Marker
                  key={pin.id}
                  lat={pin.latitude}
                  lng={pin.longitude}
                  isClicked={interestPinTitle === pin.label}
                  type={pin.pinType}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkerClick(pin);
                  }}
                />
              )
          )}
          <Marker
            lat={currentLocationPin.lat}
            lng={currentLocationPin.lng}
            isCurrentLocation
          />
          {tempMarkerClick && (
            <Marker
              lat={tempMarkerLocation.lat}
              lng={tempMarkerLocation.lng}
              isClicked
            />
          )}
        </GoogleMapReact>
      </div>
      {!openSidebar && (
        <AddPinButton
          handleClick={() => {
            setInfoWindowOpen(false);
            setOpenSidebar(true);
          }}
        />
      )}
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
