import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Avatar,
    Menu,
    MenuItem,
    Divider,
} from '@mui/material';
import {
    Menu as MenuIcon,
    AccountCircle,
    Settings as SettingsIcon,
    Help as HelpIcon,
    Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Search from './Search';
import Notifications from './Notifications';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleProfile = () => {
        navigate('/profile');
        handleClose();
    };

    const handleSettings = () => {
        navigate('/settings');
        handleClose();
    };

    const handleHelp = () => {
        navigate('/help');
        handleClose();
    };

    const handleLogout = () => {
        // TODO: Implement logout logic
        handleClose();
    };

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>

                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ flexGrow: 0, mr: 4 }}
                >
                    RedOps
                </Typography>

                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                    <Search />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Notifications />
                    
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <Avatar sx={{ width: 32, height: 32 }}>
                            <AccountCircle />
                        </Avatar>
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleProfile}>
                            <AccountCircle sx={{ mr: 1 }} />
                            Profile
                        </MenuItem>
                        <MenuItem onClick={handleSettings}>
                            <SettingsIcon sx={{ mr: 1 }} />
                            Settings
                        </MenuItem>
                        <MenuItem onClick={handleHelp}>
                            <HelpIcon sx={{ mr: 1 }} />
                            Help
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleLogout}>
                            <LogoutIcon sx={{ mr: 1 }} />
                            Logout
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar; 