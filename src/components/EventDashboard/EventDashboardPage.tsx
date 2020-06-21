import React from 'react';
import Box from '@material-ui/core/Box';
import MenuAppBar from '../common/MenuAppBar';
import { Colors } from '../../styles/Constants';
import { Typography, Container, Tabs, Tab } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import { GET_EVENT_INFO } from '../../graphql/queries/templates/events';
import { RouteComponentProps } from 'react-router';
import CCPTabPanel from './CCPTabPanel';

type TParams = { eventId: string };

enum TabOptions {
    CCP = 0,
    Hospital = 1,
    Ambulance = 2
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: TabOptions;
}  

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        {...other}
      >
        {children}
      </div>
    );
}

const EventDashboardPage = ({match}: RouteComponentProps<TParams>) => {
    var eventId = match.params.eventId
    // TO DO: error handling when eventId does not exist in database
    const { loading, error, data: eventInfo } = useQuery(GET_EVENT_INFO, {
        variables: { eventId },
    });

    const [tab, setTab] = React.useState(TabOptions.CCP);

    if (loading) return null;

    const { event } = eventInfo;

    const handleChange = (event: React.ChangeEvent<{}>, newValue: TabOptions) => {
        setTab(newValue);
    };

    return ( 
        <Box minHeight="100vh" display="flex" flexDirection="column">
            <MenuAppBar pageTitle="Directory" />
            <Container color={Colors.White}>
                <Typography variant="h3">{event.name}</Typography>
            </Container>
            <Tabs value={tab} onChange={handleChange}>
                <Tab label="CCP" id={`tab-${TabOptions.CCP}`} />
                <Tab label="Hospital" id={`tab-${TabOptions.Hospital}`} />
                <Tab label="Ambulance" id={`tab-${TabOptions.Ambulance}`} />
            </Tabs>
            <TabPanel value={tab} index={TabOptions.CCP}>
                <CCPTabPanel eventId={eventId}/>
            </TabPanel>
        </Box>
    )
};

export default EventDashboardPage;