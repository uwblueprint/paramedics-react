import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Colours } from '../../styles/Constants';

const useStyles = makeStyles({
    root: {
        maxWidth: '345px',
    },
})

const InfoWindow = ({ title, address, } : { title: string;  address: string; }) => {
 const classes = useStyles();

 return(
    <Card className = {classes.root}> 
        <CardActionArea> 
            <CardContent> 
                <Typography variant='body1' color = 'textSecondary'>
                    Name:
                    <Typography display='inline' color = 'textPrimary'> {title} </Typography>
                </Typography>
                <Typography variant='body1' color = 'textSecondary'> 
                    Location:
                    <Typography display='inline' color = 'textPrimary'> {address} </Typography>
                </Typography>
            </CardContent>
        </CardActionArea>
        <CardActions> 
            <Button size = 'small' color = {Colours.Danger}> 
                Delete
            </Button>
            <Button size = 'small' color={Colours.Primary}>
                Edit
            </Button>
        </CardActions>
    </Card>
 )
};

export default InfoWindow;