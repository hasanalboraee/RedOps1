import React, { useState } from 'react';
import {
    Box,
    Card,
    Grid,
    Typography,
    TextField,
    Button,
    Switch,
    FormControlLabel,
    Divider,
    Alert,
    Snackbar,
    Tabs,
    Tab,
    Paper,
} from '@mui/material';
import {
    Save as SaveIcon,
    Security as SecurityIcon,
    Notifications as NotificationsIcon,
    IntegrationInstructions as IntegrationIcon,
    Storage as StorageIcon,
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
            id={`settings-tabpanel-${index}`}
            aria-labelledby={`settings-tab-${index}`}
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

const Settings: React.FC = () => {
    const dispatch = useAppDispatch();
    const [activeTab, setActiveTab] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    // System Settings
    const [systemSettings, setSystemSettings] = useState({
        maxConcurrentOperations: 5,
        maxTeamSize: 10,
        dataRetentionDays: 90,
        enableAuditLog: true,
        enableBackup: true,
    });

    // Notification Settings
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        slackNotifications: false,
        operationUpdates: true,
        taskAssignments: true,
        toolExecutions: false,
        dailyDigest: true,
        weeklyReport: true,
    });

    // Integration Settings
    const [integrationSettings, setIntegrationSettings] = useState({
        slackWebhook: '',
        emailServer: '',
        emailPort: '',
        emailUsername: '',
        emailPassword: '',
        jiraIntegration: false,
        jiraUrl: '',
        jiraApiToken: '',
    });

    // Security Settings
    const [securitySettings, setSecuritySettings] = useState({
        sessionTimeout: 30,
        requireMFA: false,
        passwordExpiry: 90,
        failedLoginAttempts: 5,
        ipWhitelist: '',
    });

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleSaveSettings = async () => {
        try {
            // TODO: Implement settings save logic
            setShowSuccess(true);
        } catch (error) {
            setShowError(true);
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Settings
            </Typography>

            <Paper sx={{ width: '100%', mb: 3 }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    aria-label="settings tabs"
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab icon={<StorageIcon />} label="System" />
                    <Tab icon={<NotificationsIcon />} label="Notifications" />
                    <Tab icon={<IntegrationIcon />} label="Integrations" />
                    <Tab icon={<SecurityIcon />} label="Security" />
                </Tabs>

                <TabPanel value={activeTab} index={0}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Max Concurrent Operations"
                                value={systemSettings.maxConcurrentOperations}
                                onChange={(e) => setSystemSettings({
                                    ...systemSettings,
                                    maxConcurrentOperations: parseInt(e.target.value),
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Max Team Size"
                                value={systemSettings.maxTeamSize}
                                onChange={(e) => setSystemSettings({
                                    ...systemSettings,
                                    maxTeamSize: parseInt(e.target.value),
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Data Retention (Days)"
                                value={systemSettings.dataRetentionDays}
                                onChange={(e) => setSystemSettings({
                                    ...systemSettings,
                                    dataRetentionDays: parseInt(e.target.value),
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={systemSettings.enableAuditLog}
                                        onChange={(e) => setSystemSettings({
                                            ...systemSettings,
                                            enableAuditLog: e.target.checked,
                                        })}
                                    />
                                }
                                label="Enable Audit Log"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={systemSettings.enableBackup}
                                        onChange={(e) => setSystemSettings({
                                            ...systemSettings,
                                            enableBackup: e.target.checked,
                                        })}
                                    />
                                }
                                label="Enable Automatic Backup"
                            />
                        </Grid>
                    </Grid>
                </TabPanel>

                <TabPanel value={activeTab} index={1}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notificationSettings.emailNotifications}
                                        onChange={(e) => setNotificationSettings({
                                            ...notificationSettings,
                                            emailNotifications: e.target.checked,
                                        })}
                                    />
                                }
                                label="Email Notifications"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notificationSettings.slackNotifications}
                                        onChange={(e) => setNotificationSettings({
                                            ...notificationSettings,
                                            slackNotifications: e.target.checked,
                                        })}
                                    />
                                }
                                label="Slack Notifications"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                                Notification Types
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={notificationSettings.operationUpdates}
                                                onChange={(e) => setNotificationSettings({
                                                    ...notificationSettings,
                                                    operationUpdates: e.target.checked,
                                                })}
                                            />
                                        }
                                        label="Operation Updates"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={notificationSettings.taskAssignments}
                                                onChange={(e) => setNotificationSettings({
                                                    ...notificationSettings,
                                                    taskAssignments: e.target.checked,
                                                })}
                                            />
                                        }
                                        label="Task Assignments"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={notificationSettings.toolExecutions}
                                                onChange={(e) => setNotificationSettings({
                                                    ...notificationSettings,
                                                    toolExecutions: e.target.checked,
                                                })}
                                            />
                                        }
                                        label="Tool Executions"
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </TabPanel>

                <TabPanel value={activeTab} index={2}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                                Slack Integration
                            </Typography>
                            <TextField
                                fullWidth
                                label="Slack Webhook URL"
                                value={integrationSettings.slackWebhook}
                                onChange={(e) => setIntegrationSettings({
                                    ...integrationSettings,
                                    slackWebhook: e.target.value,
                                })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                                Email Server Configuration
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="SMTP Server"
                                        value={integrationSettings.emailServer}
                                        onChange={(e) => setIntegrationSettings({
                                            ...integrationSettings,
                                            emailServer: e.target.value,
                                        })}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="SMTP Port"
                                        value={integrationSettings.emailPort}
                                        onChange={(e) => setIntegrationSettings({
                                            ...integrationSettings,
                                            emailPort: e.target.value,
                                        })}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Username"
                                        value={integrationSettings.emailUsername}
                                        onChange={(e) => setIntegrationSettings({
                                            ...integrationSettings,
                                            emailUsername: e.target.value,
                                        })}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        type="password"
                                        label="Password"
                                        value={integrationSettings.emailPassword}
                                        onChange={(e) => setIntegrationSettings({
                                            ...integrationSettings,
                                            emailPassword: e.target.value,
                                        })}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </TabPanel>

                <TabPanel value={activeTab} index={3}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Session Timeout (minutes)"
                                value={securitySettings.sessionTimeout}
                                onChange={(e) => setSecuritySettings({
                                    ...securitySettings,
                                    sessionTimeout: parseInt(e.target.value),
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={securitySettings.requireMFA}
                                        onChange={(e) => setSecuritySettings({
                                            ...securitySettings,
                                            requireMFA: e.target.checked,
                                        })}
                                    />
                                }
                                label="Require Multi-Factor Authentication"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Password Expiry (days)"
                                value={securitySettings.passwordExpiry}
                                onChange={(e) => setSecuritySettings({
                                    ...securitySettings,
                                    passwordExpiry: parseInt(e.target.value),
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Failed Login Attempts"
                                value={securitySettings.failedLoginAttempts}
                                onChange={(e) => setSecuritySettings({
                                    ...securitySettings,
                                    failedLoginAttempts: parseInt(e.target.value),
                                })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="IP Whitelist (one per line)"
                                value={securitySettings.ipWhitelist}
                                onChange={(e) => setSecuritySettings({
                                    ...securitySettings,
                                    ipWhitelist: e.target.value,
                                })}
                            />
                        </Grid>
                    </Grid>
                </TabPanel>
            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveSettings}
                >
                    Save Settings
                </Button>
            </Box>

            <Snackbar
                open={showSuccess}
                autoHideDuration={6000}
                onClose={() => setShowSuccess(false)}
            >
                <Alert severity="success" onClose={() => setShowSuccess(false)}>
                    Settings saved successfully
                </Alert>
            </Snackbar>

            <Snackbar
                open={showError}
                autoHideDuration={6000}
                onClose={() => setShowError(false)}
            >
                <Alert severity="error" onClose={() => setShowError(false)}>
                    Error saving settings
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Settings; 