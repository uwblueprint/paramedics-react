import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import CardOptions from "./CardOptions";

interface EventCardProps {
  date: Date;
  eventTitle: string;
  address: string;
}

const EventCard = ({ date, eventTitle, address }: EventCardProps) => {
  const classes = useEventCardStyles();
  return (
    <Card className={classes.root}>
      <CardContent className={classes.cardContent}>
        <Box display="flex">
          <Typography color="textSecondary">{date}</Typography>

          <Box ml="auto">
            <CardOptions />
          </Box>
        </Box>

        <Typography color="textPrimary" variant="h4">
          {eventTitle}
        </Typography>
        <Typography color="textSecondary" variant="body1" component="p">
          {address}
        </Typography>
      </CardContent>
    </Card>
  );
};

const useEventCardStyles = makeStyles({
  root: {
    display: "inline-block",
    boxShadow: "none",
    width: "20rem",
    margin: "4rem 3rem",
  },
  cardContent: {
    padding: "1em 2em",
  },
});

export default EventCard;