import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Menu,
    MenuItem,
    Avatar,
    IconButton,
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    AccountCircle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/userSlice';

const Navbar: React.FC = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const currentUser = useAppSelector((state) => state.users.currentUser);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        handleClose();
    };

    const handleProfile = () => {
        navigate('/profile');
        handleClose();
    };

    const handleSettings = () => {
        navigate('/settings');
        handleClose();
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                backgroundColor: 'background.paper',
            }}
        >
            <Toolbar>
                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ flexGrow: 1, color: 'primary.main' }}
                >
                    RedOps Framework
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton color="inherit" size="large">
                        <NotificationsIcon />
                    </IconButton>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        {currentUser ? (
                            <Avatar
                                sx={{ width: 32, height: 32 }}
                                alt={currentUser.username || currentUser.email}
                            >
                                {(currentUser.username || currentUser.email)[0].toUpperCase()}
                            </Avatar>
                        ) : (
                            <AccountCircle />
                        )}
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
                        <MenuItem onClick={handleProfile}>Profile</MenuItem>
                        <MenuItem onClick={handleSettings}>Settings</MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar; 