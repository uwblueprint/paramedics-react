import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery } from 'react-apollo';

import MapTopBar from './MapTopBar';
import { Pin, GET_PINS_BY_EVENT_ID } from '../../graphql/queries/maps';

const MapPage = ({ eventId } : {eventId: string}) => {
    const {data, loading, error} = useQuery(GET_PINS_BY_EVENT_ID(eventId));
    const pins: Array<Pin> = data ? data.locationPins : [];
    return (
        <MapTopBar />
    );
};

export default MapPage;