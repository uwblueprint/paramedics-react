import React from 'react';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import CardOptions from './CardOptions';
import { Colours } from '../../styles/Constants';

interface EventCardProps {
  date: Date;
  eventId: string;
  eventTitle: string;
  isNew: boolean;
  address: string;
  handleClick: () => void;
  handleArchiveEvent: () => void;
  handleUnarchiveEvent: () => void;
  handleDeleteEvent: () => void;
  isActive: boolean;
}

type EventCard = ({
  date,
  eventTitle,
  isNew,
  address,
}: EventCardProps) => JSX.Element;

const useEventCardStyles = makeStyles({
  root: {
    display: 'inline-block',
    boxShadow: 'none',
    width: '300px',
    height: '161px',
    cursor: 'pointer',
    border: `1px solid ${Colours.BorderLightGray}`,
  },
  highlighted: {
    backgroundColor: Colours.Blue,
  },
  cardContent: {
    padding: '24px 32px',
  },
  eventTitle: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});

const EventCard: EventCard = ({
  date,
  eventTitle,
  isNew,
  address,
  handleClick,
  eventId,
  handleArchiveEvent,
  handleUnarchiveEvent,
  handleDeleteEvent,
  isActive,
}: EventCardProps) => {
  const classes = useEventCardStyles();
  return (
    <Card
      className={clsx({
        [classes.root]: true,
        [classes.highlighted]: isNew,
      })}
      onClick={handleClick}
    >
      <CardContent className={classes.cardContent}>
        <Box display="flex">
          <Typography color="textSecondary">{date}</Typography>
          <Box ml="auto">
            <CardOptions
              eventId={eventId}
              eventTitle={eventTitle}
              handleArchiveEvent={handleArchiveEvent}
              handleUnarchiveEvent={handleUnarchiveEvent}
              handleDeleteEvent={handleDeleteEvent}
              isActive={isActive}
            />
          </Box>
        </Box>
        <Typography
          color={isActive ? 'textPrimary' : 'textSecondary'}
          variant="h4"
          className={classes.eventTitle}
        >
          {eventTitle}
        </Typography>
        <Typography color="textSecondary" variant="body1" component="p">
          {address}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default EventCard;
