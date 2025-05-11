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
import type { OperationPhase, TaskStatus, ToolType } from '../types/models';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Reports: React.FC = () => {
    const dispatch = useAppDispatch();
    const { operations = [] } = useAppSelector((state) => state.operations);
    const { tasks = [] } = useAppSelector((state) => state.tasks);
    const { tools = [] } = useAppSelector((state) => state.tools);
    const { users = [] } = useAppSelector((state) => state.users);

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
        <Box sx={{
            minHeight: '100vh',
            width: '100%',
            fontFamily: 'Graphik Arabic, Roboto, Helvetica, Arial, sans-serif',
            background: (theme) => `
                linear-gradient(120deg, ${theme.palette.background.default} 60%, ${theme.palette.primary.main}11 100%),
                radial-gradient(ellipse at 60% 0%, ${theme.palette.primary.main}22 0%, transparent 70%)
            `,
            py: { xs: 2, md: 6 },
        }}>
            <Box sx={{
                maxWidth: 1400,
                mx: 'auto',
                px: { xs: 2, md: 4 },
            }}>
                {/* Header Card */}
                <Card sx={{
                    mb: 4,
                    px: { xs: 2, md: 5 },
                    py: { xs: 2, md: 4 },
                    borderRadius: 4,
                    boxShadow: '0 4px 32px 0 rgba(0,0,0,0.18)',
                    background: (theme) => `rgba(30,30,30,0.85)`,
                    backdropFilter: 'blur(10px)',
                    border: (theme) => `1.5px solid ${theme.palette.primary.main}22`,
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'flex-start', md: 'center' },
                    justifyContent: 'space-between',
                    gap: 2,
                }}>
                    <Box>
                        <Typography
                            variant="h4"
                            component="h1"
                            sx={{
                                fontWeight: 900,
                                color: 'primary.main',
                                letterSpacing: 1.5,
                                fontSize: { xs: 26, md: 34 },
                                mb: 0.5,
                            }}
                        >
                            Reports & Analytics
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            sx={{ color: 'text.secondary', fontWeight: 500, mb: 1 }}
                        >
                            Visualize, analyze, and export your security data with powerful reports and charts.
                        </Typography>
                        <Box sx={{ height: 4, width: 48, background: 'primary.main', borderRadius: 2, mb: 1 }} />
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleGenerateReport}
                        sx={{
                            minWidth: 180,
                            fontWeight: 700,
                            fontSize: 18,
                            borderRadius: 2,
                            boxShadow: 4,
                            px: 3,
                            py: 1.2,
                            letterSpacing: 1,
                            textTransform: 'none',
                            transition: 'all 0.2s',
                            background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.main} 80%, ${theme.palette.secondary.main} 100%)`,
                            '&:hover': {
                                background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.dark} 80%, ${theme.palette.secondary.dark} 100%)`,
                                boxShadow: 8,
                                transform: 'translateY(-2px) scale(1.04)',
                            },
                        }}
                    >
                        Generate Report
                    </Button>
                </Card>

                <Grid container spacing={4}>
                    {/* Operation Phase Distribution */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{
                            p: { xs: 2, md: 4 },
                            borderRadius: 4,
                            boxShadow: '0 4px 32px 0 rgba(0,0,0,0.18)',
                            background: (theme) => `rgba(30,30,30,0.82)`,
                            backdropFilter: 'blur(10px)',
                            border: (theme) => `1.5px solid ${theme.palette.primary.main}22`,
                            mb: 2,
                            transition: 'box-shadow 0.3s, background 0.3s',
                        }}>
                            <Typography variant="h6" fontWeight={800} color="primary.main" gutterBottom>
                                Operation Phase Distribution
                            </Typography>
                            <Box sx={{ height: 4, width: 36, background: 'primary.main', borderRadius: 2, mb: 2 }} />
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
                        <Card sx={{
                            p: { xs: 2, md: 4 },
                            borderRadius: 4,
                            boxShadow: '0 4px 32px 0 rgba(0,0,0,0.18)',
                            background: (theme) => `rgba(30,30,30,0.82)`,
                            backdropFilter: 'blur(10px)',
                            border: (theme) => `1.5px solid ${theme.palette.primary.main}22`,
                            mb: 2,
                            transition: 'box-shadow 0.3s, background 0.3s',
                        }}>
                            <Typography variant="h6" fontWeight={800} color="primary.main" gutterBottom>
                                Task Status Distribution
                            </Typography>
                            <Box sx={{ height: 4, width: 36, background: 'primary.main', borderRadius: 2, mb: 2 }} />
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
                        <Card sx={{
                            p: { xs: 2, md: 4 },
                            borderRadius: 4,
                            boxShadow: '0 4px 32px 0 rgba(0,0,0,0.18)',
                            background: (theme) => `rgba(30,30,30,0.82)`,
                            backdropFilter: 'blur(10px)',
                            border: (theme) => `1.5px solid ${theme.palette.primary.main}22`,
                            mb: 2,
                            transition: 'box-shadow 0.3s, background 0.3s',
                        }}>
                            <Typography variant="h6" fontWeight={800} color="primary.main" gutterBottom>
                                Tool Usage Analytics
                            </Typography>
                            <Box sx={{ height: 4, width: 36, background: 'primary.main', borderRadius: 2, mb: 2 }} />
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
                        <Card sx={{
                            p: { xs: 2, md: 4 },
                            borderRadius: 4,
                            boxShadow: '0 4px 32px 0 rgba(0,0,0,0.18)',
                            background: (theme) => `rgba(30,30,30,0.82)`,
                            backdropFilter: 'blur(10px)',
                            border: (theme) => `1.5px solid ${theme.palette.primary.main}22`,
                            mb: 2,
                            transition: 'box-shadow 0.3s, background 0.3s',
                        }}>
                            <Typography variant="h6" fontWeight={800} color="primary.main" gutterBottom>
                                Team Performance Metrics
                            </Typography>
                            <Box sx={{ height: 4, width: 36, background: 'primary.main', borderRadius: 2, mb: 2 }} />
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={teamPerformanceData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="tasksCompleted" stroke="#8884d8" strokeWidth={3} />
                                    <Line type="monotone" dataKey="tasksInProgress" stroke="#82ca9d" strokeWidth={3} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Card>
                    </Grid>
                </Grid>

                {/* Report Dialog */}
                <Dialog open={openReportDialog} onClose={handleCloseReportDialog} maxWidth="sm" fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 4,
                            background: (theme) => `rgba(30,30,30,0.96)`,
                            boxShadow: '0 8px 48px 0 rgba(0,0,0,0.28)',
                            backdropFilter: 'blur(16px)',
                            p: { xs: 1, md: 3 },
                        }
                    }}
                >
                    <DialogTitle sx={{ pb: 0 }}>
                        <Typography variant="h5" fontWeight={900} color="primary.main">
                            Generate Report
                        </Typography>
                    </DialogTitle>
                    <DialogContent dividers sx={{ pt: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
                            <TextField
                                fullWidth
                                select
                                label="Report Type"
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                                required
                                helperText="Select the type of report to generate."
                            >
                                <MenuItem value="operations">Operations</MenuItem>
                                <MenuItem value="tasks">Tasks</MenuItem>
                                <MenuItem value="tools">Tools</MenuItem>
                                <MenuItem value="team">Team Performance</MenuItem>
                            </TextField>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Start Date"
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    fullWidth
                                    label="End Date"
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Box>
                            <TextField
                                fullWidth
                                select
                                label="Operation"
                                value={selectedOperation}
                                onChange={(e) => setSelectedOperation(e.target.value)}
                                helperText="(Optional) Filter by operation."
                            >
                                <MenuItem value="">All Operations</MenuItem>
                                {operations.map((op) => (
                                    <MenuItem key={op.id} value={op.id}>{op.name}</MenuItem>
                                ))}
                            </TextField>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 2, gap: 1 }}>
                        <Button onClick={handleCloseReportDialog} variant="outlined">
                            Cancel
                        </Button>
                        <Button onClick={handleExportReport} variant="contained">
                            Export
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
};

export default Reports; 