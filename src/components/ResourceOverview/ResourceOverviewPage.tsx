import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import RefreshIcon from '@material-ui/icons/Refresh';
import { IconButton } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import { Colours } from '../../styles/Constants';
import ResourceMenuTabs from './ResourceMenuTabs';
import HospitalOverviewPage from '../HospitalOverview/HospitalOverviewPage';
import AmbulanceOverviewPage from '../AmbulanceOverview/AmbulanceOverviewPage';
import UserOverviewPage from '../UserOverview/UserOverviewPage';

const BackButton = withStyles({
  root: {
    marginRight: 33.5,
    padding: 0,
  },
})(IconButton);

const RefreshButton = withStyles({
  root: {
    marginLeft: '70%',
    padding: 0,
  },
})(IconButton);

const useLayout = makeStyles({
  resourceWrapper: {
    backgroundColor: '#f0f0f0',
    minHeight: '100vh',
  },
  titleBar: {
    display: 'flex',
    alignItems: 'center',
    height: '24px',
    background: Colours.SecondaryHover,
    color: Colours.White,
    paddingLeft: '16px',
    paddingTop: '16px',
    paddingBottom: '16px',
  },
  resourceTopBar: {
    display: 'flex',
    paddingBottom: '16px',
  },
  resourceTopSection: {
    padding: '0em 3em 0em 3em',
    backgroundColor: Colours.White,
    borderBottom: '1px solid #C4C4C4',
    color: Colours.Black,
  },
});

const ResourceOverviewPage: React.FC = () => {
  const [selectedTab, setTab] = useState(0);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue);
  };

  const classes = useLayout();

  const tabLabels = ['Team Members', 'Hospitals', 'Ambulances'];

  let overview;
  if (tabLabels[selectedTab] === 'Team Members') {
    overview = <UserOverviewPage />;
  } else if (tabLabels[selectedTab] === 'Hospitals') {
    overview = <HospitalOverviewPage />;
  } else if (tabLabels[selectedTab] === 'Ambulances') {
    overview = <AmbulanceOverviewPage />;
  }

  return (
    <div className={classes.resourceWrapper}>
      <span className={classes.titleBar}>
        <BackButton>
          <ArrowBackIcon style={{ color: Colours.White }} />
        </BackButton>
        <Typography variant="h6">Resource Management</Typography>

        <RefreshButton
          onClick={() => {
            window.location.reload();
          }}
        >
          <RefreshIcon style={{ color: Colours.White }} />
        </RefreshButton>
      </span>
      <div className={classes.resourceTopSection}>
        <div className={classes.resourceTopBar} />
        <ResourceMenuTabs
          handleChange={handleChange}
          currentTab={selectedTab}
          tabLabels={tabLabels}
        />
      </div>
      {overview}
    </div>
  );
};

export default ResourceOverviewPage;
