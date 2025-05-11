import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Card,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    MenuItem,
    TextField,
    Typography,
    Chip,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    fetchTasksByOperation,
} from '../store/slices/taskSlice';
import { fetchOperations } from '../store/slices/operationSlice';
import { Task, TaskStatus, OperationPhase } from '../types/models';

const Tasks: React.FC = () => {
    const dispatch = useAppDispatch();
    const { tasks, loading } = useAppSelector((state) => state.tasks);
    const { operations } = useAppSelector((state) => state.operations);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [selectedOperation, setSelectedOperation] = useState<string>('');
    const [formData, setFormData] = useState<Partial<Task>>({
        title: '',
        description: '',
        operationId: '',
        assignedTo: '',
        status: 'pending',
        phase: 'reconnaissance',
        mitreId: '',
        owaspId: '',
        results: '',
        tools: [],
    });

    useEffect(() => {
        dispatch(fetchTasks());
        dispatch(fetchOperations());
    }, [dispatch]);

    useEffect(() => {
        if (selectedOperation) {
            dispatch(fetchTasksByOperation(selectedOperation));
        } else {
            dispatch(fetchTasks());
        }
    }, [dispatch, selectedOperation]);

    const handleOpenDialog = (task?: Task) => {
        if (task) {
            setSelectedTask(task);
            setFormData(task);
        } else {
            setSelectedTask(null);
            setFormData({
                title: '',
                description: '',
                operationId: selectedOperation || '',
                assignedTo: '',
                status: 'pending',
                phase: 'reconnaissance',
                mitreId: '',
                owaspId: '',
                results: '',
                tools: [],
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedTask(null);
    };

    const handleSubmit = async () => {
        try {
            if (selectedTask) {
                await dispatch(updateTask({
                    id: selectedTask.id,
                    task: formData,
                }));
            } else {
                await dispatch(createTask(formData as Omit<Task, 'id' | 'createdAt' | 'updatedAt'>));
            }
            handleCloseDialog();
        } catch (error) {
            console.error('Error saving task:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await dispatch(deleteTask(id));
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };

    const getStatusColor = (status: TaskStatus) => {
        switch (status) {
            case 'completed':
                return 'success';
            case 'in_progress':
                return 'primary';
            case 'blocked':
                return 'error';
            default:
                return 'default';
        }
    };

    const columns: GridColDef[] = [
        { field: 'title', headerName: 'Title', flex: 1 },
        {
            field: 'operationId',
            headerName: 'Operation',
            flex: 1,
            valueGetter: (params) => {
                const operation = operations.find(op => op.id === params.row.operationId);
                return operation ? operation.name : '';
            },
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={getStatusColor(params.value as TaskStatus)}
                    size="small"
                />
            ),
        },
        { field: 'phase', headerName: 'Phase', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            renderCell: (params) => (
                <Box>
                    <IconButton
                        onClick={() => handleOpenDialog(params.row)}
                        size="small"
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => handleDelete(params.row.id)}
                        size="small"
                        color="error"
                    >
                        <DeleteIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => {/* TODO: Implement view details */}}
                        size="small"
                    >
                        <ViewIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Tasks</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    New Task
                </Button>
            </Box>

            <Card sx={{ mb: 3, p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            select
                            label="Filter by Operation"
                            value={selectedOperation}
                            onChange={(e) => setSelectedOperation(e.target.value)}
                        >
                            <MenuItem value="">All Operations</MenuItem>
                            {operations.map((operation) => (
                                <MenuItem key={operation.id} value={operation.id}>
                                    {operation.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>
            </Card>

            <Card>
                <DataGrid
                    rows={tasks}
                    columns={columns}
                    loading={loading}
                    autoHeight
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    disableSelectionOnClick
                />
            </Card>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    {selectedTask ? 'Edit Task' : 'New Task'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                select
                                label="Operation"
                                value={formData.operationId}
                                onChange={(e) => setFormData({ ...formData, operationId: e.target.value })}
                            >
                                {operations.map((operation) => (
                                    <MenuItem key={operation.id} value={operation.id}>
                                        {operation.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                select
                                label="Status"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                            >
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="in_progress">In Progress</MenuItem>
                                <MenuItem value="completed">Completed</MenuItem>
                                <MenuItem value="blocked">Blocked</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                select
                                label="Phase"
                                value={formData.phase}
                                onChange={(e) => setFormData({ ...formData, phase: e.target.value as OperationPhase })}
                            >
                                <MenuItem value="reconnaissance">Reconnaissance</MenuItem>
                                <MenuItem value="initial_access">Initial Access</MenuItem>
                                <MenuItem value="execution">Execution</MenuItem>
                                <MenuItem value="persistence">Persistence</MenuItem>
                                <MenuItem value="privilege_escalation">Privilege Escalation</MenuItem>
                                <MenuItem value="defense_evasion">Defense Evasion</MenuItem>
                                <MenuItem value="credential_access">Credential Access</MenuItem>
                                <MenuItem value="discovery">Discovery</MenuItem>
                                <MenuItem value="lateral_movement">Lateral Movement</MenuItem>
                                <MenuItem value="collection">Collection</MenuItem>
                                <MenuItem value="command_and_control">Command and Control</MenuItem>
                                <MenuItem value="exfiltration">Exfiltration</MenuItem>
                                <MenuItem value="impact">Impact</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="MITRE ID"
                                value={formData.mitreId}
                                onChange={(e) => setFormData({ ...formData, mitreId: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="OWASP ID"
                                value={formData.owaspId}
                                onChange={(e) => setFormData({ ...formData, owaspId: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Results"
                                value={formData.results}
                                onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {selectedTask ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Tasks; 