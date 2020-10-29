import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';

const Sidebar = ({open, onClose}: {open:boolean, onClose: () => void}) => {
    return (
        <Drawer open={open} onClose={onClose}> 

        </Drawer>
    );
}

export default Sidebar;