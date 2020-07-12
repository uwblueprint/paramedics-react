import React, { useState } from "react";
import { Colours } from '../styles/Constants';
import { Typography } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { IconButton } from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import AddResourceButton from "../components/ResourceOverviewPage/AddResourceButton";



const TeamMemberOverviewPage: React.FC = () => {

    const pStyles = makeStyles({
        body2: {
            marginTop: 18,
            color: Colours.SecondaryGray,
        }
    });

    const tableStyles = makeStyles({
        root: {
            backgroundColor: Colours.White,
            marginTop: 24,
            border: "1px solid #CCCCCC",
        }
    })

    const cellStyles = makeStyles({
        alignLeft: {
            display: "flex",
        }
    });

    const headerRow = makeStyles({
        root: {
            color: "black",
            fontWeight: 600,
            fontSize: 14,
            paddingTop: 17,
            paddingBottom: 17,
            paddingLeft: 32,
            paddingRight: 32,
        }
    });

    const dataRow = makeStyles({
        root: {
            color: "black",
            fontWeight: 400,
            fontSize: 14,
            paddingTop: 16.5,
            paddingBottom: 16.5,
            paddingLeft: 32,
            paddingRight: 32,
        }
    })

    const options = makeStyles({
        root: {
            textAlign: "right",
        }
    })


    const classes = pStyles();
    const hRow = headerRow();
    const table = tableStyles();
    const dRow = dataRow();
    const optionBtn = options();

return (
    <div className="member-wrapper">
        <Typography variant="h5">
            Team Member Overview
        </Typography>
        <Typography variant="body2" classes={{body2: classes.body2}}>
            A list of all team members that can be added to an event.
        </Typography>

        <TableContainer>
            <Table classes={{root: table.root}}>
                <TableHead>
                    <TableRow>
                        <TableCell classes={{root: hRow.root}}>Name</TableCell>
                        <TableCell classes={{root: hRow.root}}>Email</TableCell>
                        <TableCell classes={{root: hRow.root}}>Role</TableCell>
                        <TableCell classes={{root: optionBtn.root}}></TableCell>
                    </TableRow>
                </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell classes={{root: dRow.root}}>Char Wang</TableCell>
                            <TableCell classes={{root: dRow.root}}>123@gmail.com</TableCell>
                            <TableCell classes={{root: dRow.root}}>Admin</TableCell>
                            <TableCell classes={{root: optionBtn.root}}>
                            <IconButton>
                                <MoreHorizIcon style={{color: Colours.Black}}/>
                            </IconButton>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell classes={{root: dRow.root}}>Grace Xia</TableCell>
                            <TableCell classes={{root: dRow.root}}>456@gmail.com</TableCell>
                            <TableCell classes={{root: dRow.root}}>CCP Supervisor</TableCell>
                            <TableCell classes={{root: optionBtn.root}}>
                            <IconButton>
                                <MoreHorizIcon style={{color: Colours.Black}}/>
                            </IconButton>
                            </TableCell>
                        </TableRow>
                        <TableRow >
                            <TableCell classes={{root: dRow.root}}>Rish Bahri</TableCell>
                            <TableCell classes={{root: dRow.root}}>789@gmail.com</TableCell>
                            <TableCell classes={{root: dRow.root}}>Dispatch Coordinator</TableCell>
                            <TableCell classes={{root: optionBtn.root}}>
                            <IconButton>
                                <MoreHorizIcon style={{color: Colours.Black}}/>
                            </IconButton>
                            </TableCell>
                        </TableRow>
                    </TableBody>
            </Table>
        </TableContainer>
        <div className="add-event-container">
          <AddResourceButton label="Add Team Member" />
        </div>
    </div>
)




}

export default TeamMemberOverviewPage;