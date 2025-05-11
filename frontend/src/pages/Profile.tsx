import React, { useState } from 'react';
import {
    Box,
    Card,
    Grid,
    Typography,
    TextField,
    Button,
    Avatar,
    Divider,
    Alert,
    Snackbar,
    Tabs,
    Tab,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Chip,
} from '@mui/material';
import {
    Save as SaveIcon,
    Security as SecurityIcon,
    Notifications as NotificationsIcon,
    History as HistoryIcon,
    Person as PersonIcon,
    Lock as LockIcon,
    Email as EmailIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/hooks';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`profile-tabpanel-${index}`}
            aria-labelledby={`profile-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
};

const Profile: React.FC = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const [activeTab, setActiveTab] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    // Profile Information
    const [profileData, setProfileData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        fullName: '',
        title: '',
        department: '',
        bio: '',
    });

    // Security Settings
    const [securityData, setSecurityData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFactorEnabled: false,
    });

    // Notification Preferences
    const [notificationPreferences, setNotificationPreferences] = useState({
        emailNotifications: true,
        operationUpdates: true,
        taskAssignments: true,
        toolExecutions: false,
        dailyDigest: true,
        weeklyReport: true,
    });

    // Activity History
    const activityHistory = [
        { id: 1, action: 'Logged in', timestamp: '2024-03-15 10:30:00', ip: '192.168.1.1' },
        { id: 2, action: 'Updated profile', timestamp: '2024-03-14 15:45:00', ip: '192.168.1.1' },
        { id: 3, action: 'Created new operation', timestamp: '2024-03-13 09:15:00', ip: '192.168.1.1' },
    ];

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleSaveProfile = async () => {
        try {
            // TODO: Implement profile save logic
            setShowSuccess(true);
        } catch (error) {
            setShowError(true);
        }
    };

    const handleChangePassword = async () => {
        try {
            // TODO: Implement password change logic
            setShowSuccess(true);
        } catch (error) {
            setShowError(true);
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                    sx={{ width: 100, height: 100, mr: 3 }}
                    src={user?.avatar}
                >
                    {user?.username?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                    <Typography variant="h4">
                        {user?.username}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        {user?.role}
                    </Typography>
                </Box>
            </Box>

            <Paper sx={{ width: '100%', mb: 3 }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    aria-label="profile tabs"
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab icon={<PersonIcon />} label="Profile" />
                    <Tab icon={<SecurityIcon />} label="Security" />
                    <Tab icon={<NotificationsIcon />} label="Notifications" />
                    <Tab icon={<HistoryIcon />} label="Activity" />
                </Tabs>

                <TabPanel value={activeTab} index={0}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Username"
                                value={profileData.username}
                                onChange={(e) => setProfileData({
                                    ...profileData,
                                    username: e.target.value,
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={profileData.email}
                                onChange={(e) => setProfileData({
                                    ...profileData,
                                    email: e.target.value,
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                value={profileData.fullName}
                                onChange={(e) => setProfileData({
                                    ...profileData,
                                    fullName: e.target.value,
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Title"
                                value={profileData.title}
                                onChange={(e) => setProfileData({
                                    ...profileData,
                                    title: e.target.value,
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Department"
                                value={profileData.department}
                                onChange={(e) => setProfileData({
                                    ...profileData,
                                    department: e.target.value,
                                })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Bio"
                                value={profileData.bio}
                                onChange={(e) => setProfileData({
                                    ...profileData,
                                    bio: e.target.value,
                                })}
                            />
                        </Grid>
                    </Grid>
                </TabPanel>

                <TabPanel value={activeTab} index={1}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="password"
                                label="Current Password"
                                value={securityData.currentPassword}
                                onChange={(e) => setSecurityData({
                                    ...securityData,
                                    currentPassword: e.target.value,
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="password"
                                label="New Password"
                                value={securityData.newPassword}
                                onChange={(e) => setSecurityData({
                                    ...securityData,
                                    newPassword: e.target.value,
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="password"
                                label="Confirm New Password"
                                value={securityData.confirmPassword}
                                onChange={(e) => setSecurityData({
                                    ...securityData,
                                    confirmPassword: e.target.value,
                                })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                startIcon={<LockIcon />}
                                onClick={handleChangePassword}
                            >
                                Change Password
                            </Button>
                        </Grid>
                    </Grid>
                </TabPanel>

                <TabPanel value={activeTab} index={2}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                                Email Notifications
                            </Typography>
                            <List>
                                <ListItem>
                                    <ListItemIcon>
                                        <EmailIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Operation Updates"
                                        secondary="Receive notifications about operation status changes"
                                    />
                                    <Switch
                                        checked={notificationPreferences.operationUpdates}
                                        onChange={(e) => setNotificationPreferences({
                                            ...notificationPreferences,
                                            operationUpdates: e.target.checked,
                                        })}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <EmailIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Task Assignments"
                                        secondary="Get notified when tasks are assigned to you"
                                    />
                                    <Switch
                                        checked={notificationPreferences.taskAssignments}
                                        onChange={(e) => setNotificationPreferences({
                                            ...notificationPreferences,
                                            taskAssignments: e.target.checked,
                                        })}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <EmailIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Tool Executions"
                                        secondary="Receive notifications about tool execution results"
                                    />
                                    <Switch
                                        checked={notificationPreferences.toolExecutions}
                                        onChange={(e) => setNotificationPreferences({
                                            ...notificationPreferences,
                                            toolExecutions: e.target.checked,
                                        })}
                                    />
                                </ListItem>
                            </List>
                        </Grid>
                    </Grid>
                </TabPanel>

                <TabPanel value={activeTab} index={3}>
                    <List>
                        {activityHistory.map((activity) => (
                            <ListItem key={activity.id}>
                                <ListItemIcon>
                                    <HistoryIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={activity.action}
                                    secondary={`${activity.timestamp} - IP: ${activity.ip}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                </TabPanel>
            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveProfile}
                >
                    Save Changes
                </Button>
            </Box>

            <Snackbar
                open={showSuccess}
                autoHideDuration={6000}
                onClose={() => setShowSuccess(false)}
            >
                <Alert severity="success" onClose={() => setShowSuccess(false)}>
                    Changes saved successfully
                </Alert>
            </Snackbar>

            <Snackbar
                open={showError}
                autoHideDuration={6000}
                onClose={() => setShowError(false)}
            >
                <Alert severity="error" onClose={() => setShowError(false)}>
                    Error saving changes
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Profile; 