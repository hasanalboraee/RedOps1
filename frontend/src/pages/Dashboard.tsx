import React from 'react';
import {
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    CardHeader,
    Divider,
} from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const Dashboard: React.FC = () => {
    // Mock data for initial development
    const mockOperationStats = {
        total: 10,
        active: 4,
        completed: 3,
        pending: 3,
    };

    const mockTaskStats = {
        total: 25,
        completed: 12,
        inProgress: 8,
        pending: 3,
        blocked: 2,
    };

    const mockPhaseData = [
        { phase: 'Planning', count: 3 },
        { phase: 'Execution', count: 4 },
        { phase: 'Review', count: 2 },
        { phase: 'Completed', count: 1 },
    ];

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Grid container spacing={3}>
                {/* Operation Stats */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardHeader title="Operation Statistics" />
                        <Divider />
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            textAlign: 'center',
                                            bgcolor: 'background.paper',
                                        }}
                                    >
                                        <Typography variant="h6">
                                            {mockOperationStats.total}
                                        </Typography>
                                        <Typography color="textSecondary">
                                            Total Operations
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            textAlign: 'center',
                                            bgcolor: 'background.paper',
                                        }}
                                    >
                                        <Typography variant="h6">
                                            {mockOperationStats.active}
                                        </Typography>
                                        <Typography color="textSecondary">
                                            Active Operations
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Task Stats */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardHeader title="Task Statistics" />
                        <Divider />
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            textAlign: 'center',
                                            bgcolor: 'background.paper',
                                        }}
                                    >
                                        <Typography variant="h6">
                                            {mockTaskStats.total}
                                        </Typography>
                                        <Typography color="textSecondary">
                                            Total Tasks
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            textAlign: 'center',
                                            bgcolor: 'background.paper',
                                        }}
                                    >
                                        <Typography variant="h6">
                                            {mockTaskStats.completed}
                                        </Typography>
                                        <Typography color="textSecondary">
                                            Completed Tasks
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Phase Distribution Chart */}
                <Grid item xs={12}>
                    <Card>
                        <CardHeader title="Operations by Phase" />
                        <Divider />
                        <CardContent>
                            <Box sx={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={mockPhaseData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="phase" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar
                                            dataKey="count"
                                            fill="#f44336"
                                            name="Number of Operations"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard; 