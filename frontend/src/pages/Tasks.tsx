import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
    Autocomplete,
    Alert,
    Paper,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    fetchTasksByOperation,
} from '../store/slices/taskSlice';
import { fetchOperations } from '../store/slices/operationSlice';
import { fetchUsers } from '../store/slices/userSlice';
import type { Task, TaskStatus, OperationPhase, User } from '../types/models';
import axios from 'axios';

const mitreOptions = [
    'T1001', 'T1002', 'T1003', 'T1004', 'T1005', // ... add more as needed
];
const owaspOptions = [
    'A01:2021', 'A02:2021', 'A03:2021', 'A04:2021', // ... add more as needed
];

const Tasks: React.FC = () => {
    const dispatch = useAppDispatch();
    const { tasks, loading, error } = useAppSelector((state) => state.tasks);
    const { operations } = useAppSelector((state) => state.operations);
    const { users: allUsers, loading: usersLoading } = useAppSelector((state) => state.users);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [selectedOperation, setSelectedOperation] = useState<string>('');
    const [formData, setFormData] = useState<Partial<Task>>({
        title: '',
        description: '',
        operationId: '',
        assignedTo: null as unknown as User,
        status: 'pending',
        phase: 'reconnaissance',
        mitreId: '',
        owaspId: '',
        results: '',
        tools: [],
        startDate: new Date().toISOString(),
        endDate: '',
    });
    const [tools, setTools] = useState<any[]>([]);
    const [formError, setFormError] = useState<string | null>(null);
    const { id: operationId, taskId } = useParams<{ id: string; taskId: string }>();

    useEffect(() => {
        dispatch(fetchTasks());
        dispatch(fetchOperations());
        dispatch(fetchUsers());
        // Fetch tools for the tool selection dropdown
        axios.get('http://localhost:8080/api/tools').then(res => setTools(res.data));
    }, [dispatch]);

    useEffect(() => {
        if (selectedOperation) {
            dispatch(fetchTasksByOperation(selectedOperation));
        } else {
            dispatch(fetchTasks());
        }
    }, [dispatch, selectedOperation]);

    useEffect(() => {
        if (operationId && taskId) {
            // Fetch specific task details
            const fetchTaskDetails = async () => {
                try {
                    const response = await axios.get(`${API_URL}/tasks/${taskId}`);
                    setSelectedTask(response.data);
                    setFormData(response.data);
                } catch (error) {
                    console.error('Error fetching task details:', error);
                }
            };
            fetchTaskDetails();
        }
    }, [operationId, taskId]);

    const handleOpenDialog = (task?: Task) => {
        setFormError(null);
        if (task) {
            setSelectedTask(task);
            setFormData(task);
        } else {
            setSelectedTask(null);
            setFormData({
                title: '',
                description: '',
                operationId: selectedOperation || '',
                assignedTo: null as unknown as User,
                status: 'pending',
                phase: 'reconnaissance',
                mitreId: '',
                owaspId: '',
                results: '',
                tools: [],
                startDate: new Date().toISOString(),
                endDate: '',
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedTask(null);
        setFormError(null);
    };

    const handleSubmit = async () => {
        try {
            setFormError(null);
            
            // Validate required fields
            if (!formData.title || !formData.description || !formData.operationId) {
                setFormError('Please fill in all required fields');
                return;
            }

            if (Array.isArray(formData.assignedTo)) {
                formData.assignedTo = formData.assignedTo[0] || '';
            }

            if (selectedTask) {
                await dispatch(updateTask({
                    id: selectedTask.id,
                    task: formData,
                })).unwrap();
            } else {
                await dispatch(createTask(formData as Omit<Task, 'id' | 'createdAt' | 'updatedAt'>)).unwrap();
            }
            handleCloseDialog();
        } catch (error) {
            console.error('Error saving task:', error);
            setFormError(error instanceof Error ? error.message : 'Failed to save task');
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
                const operation = operations.find((op: { id: string }) => op.id === params.row.operationId);
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
            {selectedTask ? (
                // Task Details View
                <Card sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h4">{selectedTask.title}</Typography>
                        <Box>
                            <Button
                                variant="outlined"
                                startIcon={<EditIcon />}
                                onClick={() => handleOpenDialog(selectedTask)}
                                sx={{ mr: 1 }}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={() => handleDelete(selectedTask.id)}
                            >
                                Delete
                            </Button>
                        </Box>
                    </Box>
                    
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" gutterBottom>Description</Typography>
                            <Typography paragraph>{selectedTask.description}</Typography>
                            
                            <Typography variant="subtitle1" gutterBottom>Status</Typography>
                            <Chip
                                label={selectedTask.status}
                                color={getStatusColor(selectedTask.status)}
                                sx={{ mb: 2 }}
                            />
                            
                            <Typography variant="subtitle1" gutterBottom>Phase</Typography>
                            <Typography paragraph>{selectedTask.phase}</Typography>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" gutterBottom>Assigned To</Typography>
                            <Typography paragraph>
                                {selectedTask.assignedTo ? selectedTask.assignedTo.username : 'Unassigned'}
                            </Typography>
                            
                            <Typography variant="subtitle1" gutterBottom>Tools</Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {selectedTask.tools?.map((tool: string) => (
                                    <Chip key={tool} label={tool} size="small" />
                                ))}
                            </Box>
                            
                            {selectedTask.mitreId && (
                                <>
                                    <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                                        MITRE ID
                                    </Typography>
                                    <Typography paragraph>{selectedTask.mitreId}</Typography>
                                </>
                            )}
                            
                            {selectedTask.owaspId && (
                                <>
                                    <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                                        OWASP ID
                                    </Typography>
                                    <Typography paragraph>{selectedTask.owaspId}</Typography>
                                </>
                            )}
                        </Grid>
                        
                        {selectedTask.results && (
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" gutterBottom>Results</Typography>
                                <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                                    <Typography component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                                        {selectedTask.results}
                                    </Typography>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>
                </Card>
            ) : (
                // Original Tasks List View
                <>
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
                            {operations.map((operation: { id: string; name: string }) => (
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
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10, page: 0 } },
                    }}
                    pageSizeOptions={[10]}
                    disableRowSelectionOnClick
                />
            </Card>
                </>
            )}

            <Dialog 
                open={openDialog} 
                onClose={handleCloseDialog} 
                maxWidth="md" 
                fullWidth
                aria-labelledby="task-dialog-title"
                aria-describedby="task-dialog-description"
                disableEnforceFocus
                disableAutoFocus
                keepMounted
            >
                <DialogTitle id="task-dialog-title">
                    {selectedTask ? 'Edit Task' : 'New Task'}
                </DialogTitle>
                <DialogContent id="task-dialog-description">
                    {formError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {formError}
                        </Alert>
                    )}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
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
                                {operations.map((operation: { id: string; name: string }) => (
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
                            <Autocomplete
                                options={mitreOptions}
                                value={formData.mitreId || ''}
                                onChange={(_, value) => setFormData({ ...formData, mitreId: value || '' })}
                                renderInput={(params) => <TextField {...params} label="MITRE ATT&CK ID" fullWidth />}
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Autocomplete
                                options={owaspOptions}
                                value={formData.owaspId || ''}
                                onChange={(_, value) => setFormData({ ...formData, owaspId: value || '' })}
                                renderInput={(params) => <TextField {...params} label="OWASP ID" fullWidth />}
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete
                                multiple
                                options={tools || []}
                                getOptionLabel={(option) => option.name}
                                value={(tools || []).filter(tool => (formData.tools || []).includes(tool.id))}
                                onChange={(_, value) => setFormData({ ...formData, tools: value.map(v => v.id) })}
                                renderInput={(params) => <TextField {...params} label="Tools" fullWidth />}
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            {/*
                              Accessibility note: If you still see the 'aria-hidden' warning, ensure you do not set aria-hidden manually on #root or any ancestor. Let MUI Dialog handle accessibility.
                            */}
                            <Autocomplete
                                options={allUsers || []}
                                getOptionLabel={(option) => option.username}
                                value={allUsers.find(user => formData.assignedTo === user.id) || null}
                                onChange={(_, value) => setFormData({ ...formData, assignedTo: value ? value.id : '' })}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Assign To"
                                        fullWidth
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {usersLoading ? <span style={{ marginRight: 8 }}>Loading...</span> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                        helperText={(!usersLoading && allUsers.length === 0) ? 'No users found' : ''}
                                    />
                                )}
                                sx={{ mb: 2 }}
                                loading={usersLoading}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
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
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button 
                        onClick={handleSubmit} 
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : (selectedTask ? 'Update' : 'Create')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Tasks; 