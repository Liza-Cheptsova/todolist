import React from 'react'
import {AppBar, Button, IconButton, Toolbar} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";


export const Header = () => {
    return (
        <>
            <AppBar position="static">
                <Toolbar className={'header'}>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <MenuIcon/>
                    </IconButton>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
        </>
    )
}