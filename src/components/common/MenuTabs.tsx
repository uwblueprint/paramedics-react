import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const useTabStyles = makeStyles({
  root: {
    textTransform: 'none',
    width: '30rem',
  },
  tabSize: {
    textTransform: 'none',
    width: '15rem',
    maxWidth: '15rem',
  },
  indicator: {
    height: '0.3rem',
  },
  tabTextColor: {
    opacity: 0.4,
  },
});

const MenuTabs: React.FC<{
  handleChange: (event: React.ChangeEvent<unknown>, newValue: number) => void;
  currentTab: number;
  tabLabels: Array<string>;
}> = ({
  handleChange,
  currentTab,
  tabLabels,
}: {
  handleChange: (event: React.ChangeEvent<unknown>, newValue: number) => void;
  currentTab: number;
  tabLabels: Array<string>;
}) => {
  const classes = useTabStyles();
  return (
    <Tabs
      value={currentTab}
      indicatorColor="secondary"
      textColor="secondary"
      onChange={handleChange}
      classes={{ root: classes.root, indicator: classes.indicator }}
    >
      {tabLabels.map((label: string) => (
        <Tab
          key={label}
          label={
            <Typography component="span" variant="body1">
              <Box fontWeight="fontWeightBold">{label}</Box>
            </Typography>
          }
          classes={{
            root: classes.tabSize,
            textColorInherit: classes.tabTextColor,
          }}
        />
      ))}
    </Tabs>
  );
};

export default MenuTabs;
