import { MapModes, PinType } from '../../graphql/queries/maps';

const SidebarResults = ({ mode, pins, ccp, event }) => {
  if (mode === MapModes.EditEvent) {
    const pinOfInterest = pins.filter(
      (pin) => pin.eventId.id === event[0].id && pin.pinType === PinType.EVENT
    )[0];
    if (pinOfInterest) {
      return {
        label: event[0].name,
        address: pinOfInterest.address,
        location: {
          lat: pinOfInterest.lat,
          lng: pinOfInterest.lng,
        },
      };
    }

    return {
      label: event[0].name,
      address: '',
      location: {
        lat: 43.470846,
        lng: -80.538473,
      },
    };
  }

  if (mode === MapModes.EditCCP) {
    const pinOfInterest = pins.filter(
      (pin) =>
        pin.pinType === PinType.CCP && pin.ccpId && pin.ccpId.id === ccp.id
    )[0];

    if (pinOfInterest) {
      return {
        label: ccp.name,
        address: pinOfInterest.address,
        location: {
          lat: pinOfInterest.lat,
          lng: pinOfInterest.lng,
        },
      };
    }

    return {
      label: ccp.name,
      address: '',
      location: {
        lat: 43.470846,
        lng: -80.538473,
      },
    };
  }

  return {
    label: '',
    address: '',
    location: {
      lat: 0,
      lng: 0,
    },
  };
};

export default SidebarResults;
