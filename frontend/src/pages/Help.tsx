import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Tabs,
    Tab,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Link,
    Card,
    CardContent,
    Grid,
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Book as BookIcon,
    Code as CodeIcon,
    Help as HelpIcon,
    BugReport as BugReportIcon,
    Security as SecurityIcon,
    Assignment as AssignmentIcon,
    Build as BuildIcon,
    People as PeopleIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material';

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
            id={`help-tabpanel-${index}`}
            aria-labelledby={`help-tab-${index}`}
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

const Help: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Help & Documentation
            </Typography>

            <Paper sx={{ width: '100%', mb: 3 }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    aria-label="help tabs"
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab icon={<BookIcon />} label="Getting Started" />
                    <Tab icon={<CodeIcon />} label="API Reference" />
                    <Tab icon={<HelpIcon />} label="FAQ" />
                    <Tab icon={<BugReportIcon />} label="Troubleshooting" />
                </Tabs>

                <TabPanel value={activeTab} index={0}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        <SecurityIcon sx={{ mr: 1 }} />
                                        RedOps Overview
                                    </Typography>
                                    <Typography paragraph>
                                        RedOps is a comprehensive framework for managing red team operations, 
                                        penetration testing, and vulnerability assessments. It provides a 
                                        structured approach to security testing with features for:
                                    </Typography>
                                    <List>
                                        <ListItem>
                                            <ListItemIcon><AssignmentIcon /></ListItemIcon>
                                            <ListItemText primary="Operation Management" />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon><BuildIcon /></ListItemIcon>
                                            <ListItemText primary="Tool Integration" />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon><PeopleIcon /></ListItemIcon>
                                            <ListItemText primary="Team Collaboration" />
                                        </ListItem>
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        <SettingsIcon sx={{ mr: 1 }} />
                                        Quick Start Guide
                                    </Typography>
                                    <List>
                                        <ListItem>
                                            <ListItemText 
                                                primary="1. Create an Operation"
                                                secondary="Start by creating a new operation with defined scope and objectives"
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText 
                                                primary="2. Assign Team Members"
                                                secondary="Add team members and assign roles based on expertise"
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText 
                                                primary="3. Create Tasks"
                                                secondary="Break down the operation into manageable tasks"
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText 
                                                primary="4. Execute Tools"
                                                secondary="Use integrated tools to perform security testing"
                                            />
                                        </ListItem>
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12}>
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h6">
                                        Operation Phases
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <List>
                                        <ListItem>
                                            <ListItemText 
                                                primary="Reconnaissance"
                                                secondary="Gathering information about the target"
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText 
                                                primary="Initial Access"
                                                secondary="Establishing a foothold in the target environment"
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText 
                                                primary="Execution"
                                                secondary="Running tools and commands"
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText 
                                                primary="Persistence"
                                                secondary="Maintaining access to the target"
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText 
                                                primary="Privilege Escalation"
                                                secondary="Gaining higher-level access"
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText 
                                                primary="Defense Evasion"
                                                secondary="Avoiding detection"
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText 
                                                primary="Credential Access"
                                                secondary="Obtaining credentials"
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText 
                                                primary="Discovery"
                                                secondary="Exploring the target environment"
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText 
                                                primary="Lateral Movement"
                                                secondary="Moving through the network"
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText 
                                                primary="Collection"
                                                secondary="Gathering sensitive data"
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText 
                                                primary="Command and Control"
                                                secondary="Maintaining communication with compromised systems"
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText 
                                                primary="Exfiltration"
                                                secondary="Removing data from the target"
                                            />
                                        </ListItem>
                                    </List>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                    </Grid>
                </TabPanel>

                <TabPanel value={activeTab} index={1}>
                    <Typography variant="h5" gutterBottom>
                        API Reference
                    </Typography>
                    <Typography paragraph>
                        The RedOps API provides endpoints for managing operations, tasks, tools, and team members.
                        All API endpoints are prefixed with <code>/api/v1</code>.
                    </Typography>

                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Authentication</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography paragraph>
                                All API requests require authentication using JWT tokens. Include the token in the 
                                Authorization header:
                            </Typography>
                            <pre>
                                Authorization: Bearer your-jwt-token
                            </pre>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Operations API</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List>
                                <ListItem>
                                    <ListItemText 
                                        primary="GET /operations"
                                        secondary="List all operations"
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText 
                                        primary="POST /operations"
                                        secondary="Create a new operation"
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText 
                                        primary="GET /operations/:id"
                                        secondary="Get operation details"
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText 
                                        primary="PUT /operations/:id"
                                        secondary="Update an operation"
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText 
                                        primary="DELETE /operations/:id"
                                        secondary="Delete an operation"
                                    />
                                </ListItem>
                            </List>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Tasks API</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List>
                                <ListItem>
                                    <ListItemText 
                                        primary="GET /tasks"
                                        secondary="List all tasks"
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText 
                                        primary="POST /tasks"
                                        secondary="Create a new task"
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText 
                                        primary="GET /tasks/:id"
                                        secondary="Get task details"
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText 
                                        primary="PUT /tasks/:id"
                                        secondary="Update a task"
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText 
                                        primary="DELETE /tasks/:id"
                                        secondary="Delete a task"
                                    />
                                </ListItem>
                            </List>
                        </AccordionDetails>
                    </Accordion>
                </TabPanel>

                <TabPanel value={activeTab} index={2}>
                    <Typography variant="h5" gutterBottom>
                        Frequently Asked Questions
                    </Typography>

                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>General Questions</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List>
                                <ListItem>
                                    <ListItemText 
                                        primary="What is RedOps?"
                                        secondary="RedOps is a framework for managing red team operations, penetration testing, and vulnerability assessments. It provides tools and features for planning, executing, and reporting security tests."
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText 
                                        primary="Who can use RedOps?"
                                        secondary="RedOps is designed for security professionals, red team members, penetration testers, and security teams who need to conduct and manage security assessments."
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText 
                                        primary="Is RedOps open source?"
                                        secondary="Yes, RedOps is an open-source project. You can find the source code on our GitHub repository."
                                    />
                                </ListItem>
                            </List>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Technical Questions</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List>
                                <ListItem>
                                    <ListItemText 
                                        primary="How do I add custom tools?"
                                        secondary="You can add custom tools through the Tools page. Click 'New Tool' and provide the necessary details including command, arguments, and output format."
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText 
                                        primary="Can I integrate with other security tools?"
                                        secondary="Yes, RedOps provides API endpoints for integration with other security tools and platforms. Check the API documentation for details."
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText 
                                        primary="How is data stored and secured?"
                                        secondary="RedOps uses MongoDB for data storage with encryption at rest. All communications are secured using TLS, and access is controlled through role-based access control."
                                    />
                                </ListItem>
                            </List>
                        </AccordionDetails>
                    </Accordion>
                </TabPanel>

                <TabPanel value={activeTab} index={3}>
                    <Typography variant="h5" gutterBottom>
                        Troubleshooting Guide
                    </Typography>

                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Common Issues</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List>
                                <ListItem>
                                    <ListItemText 
                                        primary="Tool Execution Fails"
                                        secondary="Check if the tool is properly configured with correct command and arguments. Verify that the tool is installed and accessible in the system path."
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText 
                                        primary="Authentication Issues"
                                        secondary="Ensure your JWT token is valid and not expired. Check if you have the correct permissions for the requested operation."
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText 
                                        primary="Database Connection Errors"
                                        secondary="Verify MongoDB connection settings in the configuration file. Check if the MongoDB service is running and accessible."
                                    />
                                </ListItem>
                            </List>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Getting Help</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography paragraph>
                                If you're still experiencing issues, you can:
                            </Typography>
                            <List>
                                <ListItem>
                                    <ListItemText 
                                        primary="Check the GitHub Issues"
                                        secondary={
                                            <Link href="https://github.com/your-repo/issues" target="_blank">
                                                View existing issues or create a new one
                                            </Link>
                                        }
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText 
                                        primary="Join our Discord Community"
                                        secondary={
                                            <Link href="https://discord.gg/your-server" target="_blank">
                                                Get help from the community
                                            </Link>
                                        }
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText 
                                        primary="Contact Support"
                                        secondary="Email support@redops.com for direct assistance"
                                    />
                                </ListItem>
                            </List>
                        </AccordionDetails>
                    </Accordion>
                </TabPanel>
            </Paper>
        </Box>
    );
};

export default Help; 