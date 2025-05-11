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
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Group as GroupIcon,
    Assignment as AssignmentIcon,
    Build as BuildIcon,
    Security as SecurityIcon,
    Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

const drawerWidth = 240;

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
                    backgroundColor: 'background.paper',
                    borderRight: '1px solid rgba(255, 255, 255, 0.12)',
                },
            }}
        >
            <Box sx={{ mt: 8 }}>
                <List>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton
                                selected={location.pathname === item.path}
                                onClick={() => handleNavigation(item.path)}
                                sx={{
                                    '&.Mui-selected': {
                                        backgroundColor: 'primary.main',
                                        '&:hover': {
                                            backgroundColor: 'primary.dark',
                                        },
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: location.pathname === item.path ? 'white' : 'inherit',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    sx={{
                                        color: location.pathname === item.path ? 'white' : 'inherit',
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider sx={{ my: 2 }} />
                {currentUser && (
                    <List>
                        <ListItem>
                            <ListItemText
                                primary={currentUser.username}
                                secondary={currentUser.role}
                                primaryTypographyProps={{
                                    variant: 'subtitle2',
                                }}
                                secondaryTypographyProps={{
                                    variant: 'caption',
                                }}
                            />
                        </ListItem>
                    </List>
                )}
            </Box>
        </Drawer>
    );
};

export default Sidebar; 