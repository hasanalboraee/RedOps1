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
    useTheme,
    alpha,
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    AccountCircle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/userSlice';
import logo from '../../assets/images/logo.png'; // Adjust filename if needed

const Navbar: React.FC = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const currentUser = useAppSelector((state) => state.users.currentUser);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const theme = useTheme();

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
                background: `linear-gradient(90deg, ${alpha(theme.palette.background.paper, 0.98)} 60%, ${alpha(theme.palette.background.default, 0.92)} 100%)`,
                backdropFilter: 'blur(8px)',
                boxShadow: '0 2px 16px 0 rgba(0,0,0,0.18)',
                borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                transition: 'all 0.3s',
            }}
        >
            <Toolbar sx={{ minHeight: 64, px: { xs: 2, md: 4 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                    <img src={logo} alt="Logo" style={{ height: 48, width: 'auto', display: 'block' }} />
                </Box>
                <Typography
                    variant="h5"
                    noWrap
                    component="div"
                    sx={{
                        flexGrow: 1,
                        color: '#fff',
                        fontWeight: 900,
                        letterSpacing: 2,
                        fontSize: { xs: 22, sm: 26, md: 30 },
                        textShadow: `0 2px 12px ${alpha(theme.palette.primary.main, 0.18)}`,
                        userSelect: 'none',
                        transition: 'color 0.2s',
                        ml: 0.5,
                    }}
                >
                    RedTrack
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton
                        color="inherit"
                        size="large"
                        sx={{
                            mx: 1,
                            color: theme.palette.text.secondary,
                            transition: 'color 0.2s, box-shadow 0.2s, transform 0.2s',
                            '&:hover': {
                                color: theme.palette.primary.main,
                                boxShadow: `0 0 8px 0 ${alpha(theme.palette.primary.main, 0.25)}`,
                                transform: 'scale(1.12)',
                                background: alpha(theme.palette.primary.main, 0.08),
                            },
                        }}
                    >
                        <NotificationsIcon />
                    </IconButton>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                        sx={{
                            mx: 1,
                            color: theme.palette.text.secondary,
                            transition: 'color 0.2s, box-shadow 0.2s, transform 0.2s',
                            '&:hover': {
                                color: theme.palette.primary.main,
                                boxShadow: `0 0 8px 0 ${alpha(theme.palette.primary.main, 0.25)}`,
                                transform: 'scale(1.12)',
                                background: alpha(theme.palette.primary.main, 0.08),
                            },
                        }}
                    >
                        {currentUser ? (
                            <Avatar
                                sx={{ width: 36, height: 36, fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.85), color: '#fff', fontSize: 20 }}
                                alt={currentUser.username || currentUser.email}
                            >
                                {(currentUser.username || currentUser.email)[0].toUpperCase()}
                            </Avatar>
                        ) : (
                            <AccountCircle sx={{ fontSize: 32 }} />
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