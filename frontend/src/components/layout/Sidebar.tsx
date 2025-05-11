import React from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Divider,
    Box,
    useTheme,
    alpha,
    Tooltip,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Group as GroupIcon,
    Assignment as AssignmentIcon,
    Build as BuildIcon,
    Security as SecurityIcon,
    Assessment as AssessmentIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

const drawerWidth = 80;

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Operations', icon: <SecurityIcon />, path: '/operations' },
    { text: 'Tools', icon: <BuildIcon />, path: '/tools' },
    { text: 'Team', icon: <GroupIcon />, path: '/team' },
    { text: 'Reports', icon: <AssessmentIcon />, path: '/reports' },
];

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const currentUser = useAppSelector((state) => state.users.currentUser);

    const handleNavigation = (path: string) => {
        navigate(path);
        onClose();
    };

    return (
        <Drawer
            variant="persistent"
            anchor="left"
            open={open}
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.98)}, ${alpha(theme.palette.background.default, 0.92)})`,
                    borderRight: `2px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                    borderTopRightRadius: 18,
                    borderBottomRightRadius: 18,
                    boxShadow: '4px 0 24px 0 rgba(0,0,0,0.12)',
                    backdropFilter: 'blur(6px)',
                    transition: 'all 0.3s',
                    overflowX: 'hidden',
                },
            }}
        >
            <Box sx={{ mt: 8 }}>
                <List sx={{ px: 0 }}>
                    {menuItems.map((item) => {
                        const selected = location.pathname === item.path;
                        return (
                            <Tooltip title={item.text} placement="right" arrow key={item.text}>
                                <ListItem disablePadding sx={{ mb: 1.5, justifyContent: 'center' }}>
                                    <Box sx={{
                                        width: '100%',
                                        borderRadius: 2,
                                        boxShadow: selected ? `0 2px 12px 0 ${alpha(theme.palette.primary.main, 0.18)}` : 'none',
                                        background: selected ? alpha(theme.palette.primary.main, 0.12) : 'transparent',
                                        position: 'relative',
                                        transition: 'background 0.3s, box-shadow 0.3s',
                                        mx: 'auto',
                                        '&:before': selected ? {
                                            content: '""',
                                            position: 'absolute',
                                            left: 0,
                                            top: 8,
                                            bottom: 8,
                                            width: 5,
                                            borderRadius: 3,
                                            background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                        } : {},
                                    }}>
                                        <ListItemButton
                                            selected={selected}
                                            onClick={() => handleNavigation(item.path)}
                                            sx={{
                                                pl: 0,
                                                pr: 0,
                                                py: 1.5,
                                                borderRadius: 2,
                                                minHeight: 56,
                                                minWidth: drawerWidth,
                                                maxWidth: drawerWidth,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                zIndex: 1,
                                                color: selected ? theme.palette.primary.main : theme.palette.text.primary,
                                                fontWeight: selected ? 700 : 500,
                                                boxShadow: 'none',
                                                background: 'none',
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    background: alpha(theme.palette.primary.main, 0.08),
                                                    color: theme.palette.primary.main,
                                                    transform: 'translateY(-2px) scale(1.08)',
                                                },
                                            }}
                                        >
                                            <ListItemIcon
                                                sx={{
                                                    minWidth: 0,
                                                    color: selected ? theme.palette.primary.main : theme.palette.text.secondary,
                                                    fontSize: 30,
                                                    transition: 'color 0.2s, filter 0.2s',
                                                    filter: selected ? `drop-shadow(0 0 6px ${alpha(theme.palette.primary.main, 0.5)})` : 'none',
                                                    mb: 0.5,
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                {item.icon}
                                            </ListItemIcon>
                                            {/* Hide text label for compact sidebar */}
                                        </ListItemButton>
                                    </Box>
                                </ListItem>
                            </Tooltip>
                        );
                    })}
                </List>
                <Divider sx={{ my: 2, mx: 2, opacity: 0.12 }} />
                {currentUser && (
                    <Tooltip title={currentUser.username} placement="right" arrow>
                        <Box sx={{
                            mx: 1,
                            mb: 2,
                            p: 1.5,
                            borderRadius: 2,
                            background: alpha(theme.palette.primary.main, 0.07),
                            boxShadow: `0 1px 6px 0 ${alpha(theme.palette.primary.main, 0.08)}`,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}>
                            <PersonIcon sx={{ color: 'primary.main', fontSize: 28, mb: 0.5 }} />
                        </Box>
                    </Tooltip>
                )}
            </Box>
        </Drawer>
    );
};

export default Sidebar; 