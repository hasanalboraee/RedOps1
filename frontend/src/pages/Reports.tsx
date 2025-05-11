import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    Grid,
    Typography,
    MenuItem,
    TextField,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    Select,
    Chip,
} from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    ResponsiveContainer,
} from 'recharts';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchOperations } from '../store/slices/operationSlice';
import { fetchTasks } from '../store/slices/taskSlice';
import { fetchTools } from '../store/slices/toolSlice';
import { fetchUsers } from '../store/slices/userSlice';
import { OperationPhase, TaskStatus, ToolType } from '../types/models';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Reports: React.FC = () => {
    const dispatch = useAppDispatch();
    const { operations } = useAppSelector((state) => state.operations);
    const { tasks } = useAppSelector((state) => state.tasks);
    const { tools } = useAppSelector((state) => state.tools);
    const { users } = useAppSelector((state) => state.users);

    const [dateRange, setDateRange] = useState({
        start: '',
        end: '',
    });
    const [selectedOperation, setSelectedOperation] = useState('');
    const [openReportDialog, setOpenReportDialog] = useState(false);
    const [reportType, setReportType] = useState('');

    useEffect(() => {
        dispatch(fetchOperations());
        dispatch(fetchTasks());
        dispatch(fetchTools());
        dispatch(fetchUsers());
    }, [dispatch]);

    // Operation Phase Distribution
    const phaseData = operations.reduce((acc: any[], op) => {
        const existing = acc.find(item => item.name === op.currentPhase);
        if (existing) {
            existing.value++;
        } else {
            acc.push({ name: op.currentPhase, value: 1 });
        }
        return acc;
    }, []);

    // Task Status Distribution
    const taskStatusData = tasks.reduce((acc: any[], task) => {
        const existing = acc.find(item => item.name === task.status);
        if (existing) {
            existing.value++;
        } else {
            acc.push({ name: task.status, value: 1 });
        }
        return acc;
    }, []);

    // Tool Usage Over Time
    const toolUsageData = tools.map(tool => ({
        name: tool.name,
        usage: Math.floor(Math.random() * 100), // Replace with actual usage data
    }));

    // Team Performance Metrics
    const teamPerformanceData = users.map(user => ({
        name: user.username,
        tasksCompleted: tasks.filter(task => task.assignedTo === user.id && task.status === 'completed').length,
        tasksInProgress: tasks.filter(task => task.assignedTo === user.id && task.status === 'in_progress').length,
    }));

    const handleGenerateReport = () => {
        setOpenReportDialog(true);
    };

    const handleCloseReportDialog = () => {
        setOpenReportDialog(false);
    };

    const handleExportReport = () => {
        // Implement report export logic
        handleCloseReportDialog();
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Reports & Analytics</Typography>
                <Button variant="contained" onClick={handleGenerateReport}>
                    Generate Report
                </Button>
            </Box>

            <Grid container spacing={3}>
                {/* Operation Phase Distribution */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Operation Phase Distribution
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={phaseData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label
                                >
                                    {phaseData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Grid>

                {/* Task Status Distribution */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Task Status Distribution
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={taskStatusData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Grid>

                {/* Tool Usage Analytics */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Tool Usage Analytics
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={toolUsageData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="usage" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Grid>

                {/* Team Performance Metrics */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Team Performance Metrics
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={teamPerformanceData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="tasksCompleted" stroke="#8884d8" />
                                <Line type="monotone" dataKey="tasksInProgress" stroke="#82ca9d" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Grid>
            </Grid>

            {/* Report Generation Dialog */}
            <Dialog open={openReportDialog} onClose={handleCloseReportDialog} maxWidth="md" fullWidth>
                <DialogTitle>Generate Custom Report</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Start Date"
                                value={dateRange.start}
                                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="End Date"
                                value={dateRange.end}
                                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Operation</InputLabel>
                                <Select
                                    value={selectedOperation}
                                    onChange={(e) => setSelectedOperation(e.target.value)}
                                    label="Operation"
                                >
                                    <MenuItem value="">All Operations</MenuItem>
                                    {operations.map((op) => (
                                        <MenuItem key={op.id} value={op.id}>
                                            {op.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Report Type</InputLabel>
                                <Select
                                    value={reportType}
                                    onChange={(e) => setReportType(e.target.value)}
                                    label="Report Type"
                                >
                                    <MenuItem value="operation_summary">Operation Summary</MenuItem>
                                    <MenuItem value="task_progress">Task Progress</MenuItem>
                                    <MenuItem value="tool_usage">Tool Usage</MenuItem>
                                    <MenuItem value="team_performance">Team Performance</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseReportDialog}>Cancel</Button>
                    <Button onClick={handleExportReport} variant="contained">
                        Export Report
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Reports; 