import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import RefreshIcon from '@material-ui/icons/Refresh';
import { IconButton } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import { Colours } from '../../styles/Constants';
import ResourceMenuTabs from './ResourceMenuTabs';
import HospitalOverviewPage from './HospitalOverviewPage';
import AmbulanceOverviewPage from './AmbulanceOverviewPage';
import UserOverviewPage from './UserOverviewPage';

const BackButton = withStyles({
  root: {
    marginRight: 33.5,
    padding: 0,
  },
})(IconButton);

const RefreshButton = withStyles({
  root: {
    position: 'absolute',
    right: '16px',
    padding: 0,
  },
})(IconButton);

const useLayout = makeStyles({
  resourceWrapper: {
    backgroundColor: '#f0f0f0',
    minHeight: '100vh',
  },
  fixedBars: {
    position: 'fixed',
    width: '100%',
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
    padding: '8px 0px 0px 64px',
    backgroundColor: Colours.White,
    borderBottom: `1px solid ${Colours.BorderLightGray}`,
    color: Colours.Black,
  },
});

const ResourceOverviewPage = ({
  match: {
    params: { resource },
  },
}: {
  match: { params: { resource: string } };
}) => {
  const history = useHistory();
  const tabLabels = ['Team Members', 'Hospitals', 'Ambulances'];

  let index = 0;
  switch (resource) {
    case 'members':
      index = 0;
      break;
    case 'hospitals':
      index = 1;
      break;
    case 'ambulances':
      index = 2;
      break;
    default:
      index = 0;
      history.push('/manage/members');
      break;
  }

  const [selectedTab, setTab] = useState(index);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue);
    let path = '';
    switch (newValue) {
      case 0:
        path = '/manage/members';
        break;
      case 1:
        path = '/manage/hospitals';
        break;
      case 2:
        path = '/manage/ambulances';
        break;
      default:
        break;
    }
    history.push(path);
  };

  const classes = useLayout();

  let overview;
  if (resource === 'members') {
    overview = <UserOverviewPage />;
  } else if (resource === 'hospitals') {
    overview = <HospitalOverviewPage />;
  } else if (resource === 'ambulances') {
    overview = <AmbulanceOverviewPage />;
  }

  return (
    <div className={classes.resourceWrapper}>
      <div className={classes.fixedBars}>
        <span className={classes.titleBar}>
          <BackButton onClick={() => history.push('/')}>
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
      </div>
      {overview}
    </div>
  );
};

export default ResourceOverviewPage;
