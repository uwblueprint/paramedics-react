import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import CardOptions from './CardOptions';

interface EventCardProps {
  date: Date;
  eventId: string;
  eventTitle: string;
  address: string;
  handleClick: () => void;
  handleArchiveEvent: () => void;
  handleUnarchiveEvent: () => void;
  handleDeleteEvent: () => void;
  isActive: boolean;
}

type EventCard = ({ date, eventTitle, address }: EventCardProps) => JSX.Element;

const useEventCardStyles = makeStyles({
  root: {
    display: 'inline-block',
    boxShadow: 'none',
    width: '20rem',
    height: '10rem',
    cursor: 'pointer',
  },
  cardContent: {
    padding: '2em 2em',
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
    <Card className={classes.root} onClick={handleClick}>
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
          color="textPrimary"
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
