import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
    Card,
    Grid,
    Chip,
    Button,
    IconButton,
    Paper,
    Divider,
    CircularProgress,
    useTheme,
    alpha,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Container,
    Tooltip,
    Alert,
    CardContent,
    CardActions,
    Stack,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    ArrowBack as ArrowBackIcon,
    Assignment as AssignmentIcon,
    Timeline as TimelineIcon,
    Build as BuildIcon,
    Person as PersonIcon,
    PlayArrow as PlayArrowIcon,
    Download as DownloadIcon,
    Upload as UploadIcon,
    Close as CloseIcon,
    Save as SaveIcon,
} from '@mui/icons-material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import axiosInstance from '../services/axiosConfig';
import * as XLSX from 'xlsx';
import { API_URL } from '../config.ts';
import type { RootState } from '../store';
import { fetchTools, executeTool } from '../store/slices/toolsSlice.ts';
import type { Task, Tool } from '../types/models';
import { useAppDispatch, useAppSelector } from '../store/hooks';

interface ResultRow {
    id: string;
    start: string;
    end: string;
    sourceIP: string;
    destinationIP: string;
    destinationPort: string;
    destinationSystem: string;
    pivotIP: string;
    pivotPort: string;
    url: string;
    toolApp: string;
    command: string;
    description: string;
    output: string;
    result: string;
    systemModification: string;
    comments: string;
    operatorName: string;
}

const TaskDashboard: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { id: operationId, taskId } = useParams<{ id: string; taskId: string }>();
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openToolDialog, setOpenToolDialog] = useState(false);
    const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
    const [executeArgs, setExecuteArgs] = useState<Record<string, string>>({});
    const [manualResults, setManualResults] = useState('');
    const { tools } = useAppSelector((state) => state.tools);
    const [results, setResults] = useState<ResultRow[]>([]);
    const [loadingResults, setLoadingResults] = useState(false);
    const [manualResultsData, setManualResultsData] = useState<ResultRow[]>([]);
    const [openImportDialog, setOpenImportDialog] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Define the columns for the results table
    const columns: GridColDef[] = [
        { field: 'start', headerName: 'Start', width: 150 },
        { field: 'end', headerName: 'End', width: 150 },
        { field: 'sourceIP', headerName: 'Source IP', width: 130 },
        { field: 'destinationIP', headerName: 'Destination IP', width: 130 },
        { field: 'destinationPort', headerName: 'Destination Port', width: 130 },
        { field: 'destinationSystem', headerName: 'Destination System', width: 150 },
        { field: 'pivotIP', headerName: 'Pivot IP', width: 130 },
        { field: 'pivotPort', headerName: 'Pivot Port', width: 130 },
        { field: 'url', headerName: 'URL', width: 200 },
        { field: 'toolApp', headerName: 'Tool/App', width: 130 },
        { field: 'command', headerName: 'Command', width: 200 },
        { field: 'description', headerName: 'Description', width: 200 },
        { field: 'output', headerName: 'Output', width: 200 },
        { field: 'result', headerName: 'Result', width: 200 },
        { field: 'systemModification', headerName: 'System Modification', width: 150 },
        { field: 'comments', headerName: 'Comments', width: 200 },
        { field: 'operatorName', headerName: 'Operator Name', width: 130 },
    ];

    // Function to format results into the required structure
    const formatResults = (rawResults: any[]): ResultRow[] => {
        if (!Array.isArray(rawResults)) {
            rawResults = [rawResults];
        }

        return rawResults.map((result, index) => ({
            id: (index + 1).toString(),
            start: result.start || result.Start || '',
            end: result.end || result.End || '',
            sourceIP: result.sourceIp || result['Source IP'] || '',
            destinationIP: result.destinationIp || result['Destination IP'] || '',
            destinationPort: result.destinationPort || result['Destination Port'] || '',
            destinationSystem: result.destinationSystem || result['Destination System'] || '',
            pivotIP: result.pivotIp || result['Pivot IP'] || '',
            pivotPort: result.pivotPort || result['Pivot Port'] || '',
            url: result.url || result.URL || '',
            toolApp: result.tool || result['Tool/App'] || '',
            command: result.command || result.Command || '',
            description: result.description || result.Description || '',
            output: result.output || result.Output || '',
            result: result.result || result.Result || '',
            systemModification: result.systemModification || result['System Modification'] || '',
            comments: result.comments || result.Comments || '',
            operatorName: result.operatorName || result['Operator Name'] || '',
        }));
    };

    // Function to fetch results from the backend
    const fetchResults = async () => {
        try {
            setLoadingResults(true);
            const response = await axiosInstance.get(`${API_URL}/tasks/${taskId}/results`);
            setResults(response.data);
        } catch (err) {
            console.error('Error fetching results:', err);
            setError('Failed to fetch results');
        } finally {
            setLoadingResults(false);
        }
    };

    useEffect(() => {
        const fetchTaskDetails = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(`${API_URL}/operations/${operationId}/tasks/${taskId}`);
                setTask(response.data);
                setManualResults(response.data.manualResults || '');
                await fetchResults();
            } catch (err) {
                console.error('Error fetching task details:', err);
                setError('Failed to load task details');
            } finally {
                setLoading(false);
            }
        };

        if (taskId && operationId) {
            fetchTaskDetails();
            dispatch(fetchTools());
        }
    }, [taskId, operationId, dispatch]);

    const handleBack = () => {
        navigate(`/operations/${operationId}`);
    };

    const handleEdit = () => {
        // TODO: Implement edit functionality
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await axiosInstance.delete(`${API_URL}/tasks/${taskId}`);
                handleBack();
            } catch (err) {
                console.error('Error deleting task:', err);
                setError('Failed to delete task');
            }
        }
    };

    const handleOpenToolDialog = (tool: Tool) => {
        setSelectedTool(tool);
        setExecuteArgs(
            Object.keys(tool.arguments).reduce((acc, key) => {
                acc[key] = '';
                return acc;
            }, {} as Record<string, string>)
        );
        setOpenToolDialog(true);
    };

    const handleCloseToolDialog = () => {
        setOpenToolDialog(false);
        setSelectedTool(null);
        setExecuteArgs({});
    };

    const handleExecuteTool = async () => {
        if (!selectedTool || !taskId) return;

        try {
            setLoadingResults(true);
            const result = await dispatch(executeTool({
                toolId: selectedTool.id,
                args: Object.entries(executeArgs).map(([key, value]) => `${key}=${value}`),
            })).unwrap();

            // Update task with new results
            const updatedTask = await axiosInstance.get(`${API_URL}/tasks/${taskId}`);
            setTask(updatedTask.data);
            
            // Parse and update results
            if (updatedTask.data.results) {
                try {
                    const parsedResults = JSON.parse(updatedTask.data.results);
                    setResults(formatResults(parsedResults));
                } catch (e) {
                    setResults([{
                        id: '1',
                        start: '',
                        end: '',
                        sourceIP: '',
                        destinationIP: '',
                        destinationPort: '',
                        destinationSystem: '',
                        pivotIP: '',
                        pivotPort: '',
                        url: '',
                        toolApp: '',
                        command: '',
                        description: '',
                        output: updatedTask.data.results,
                        result: '',
                        systemModification: '',
                        comments: '',
                        operatorName: '',
                    }]);
                }
            }
            
            handleCloseToolDialog();
        } catch (error) {
            console.error('Error executing tool:', error);
        } finally {
            setLoadingResults(false);
        }
    };

    const handleManualResultsChange = async (value: string) => {
        setManualResults(value);
        try {
            await axiosInstance.put(`${API_URL}/tasks/${taskId}`, {
                ...task,
                manualResults: value
            });
        } catch (err) {
            console.error('Error updating manual results:', err);
        }
    };

    const handleExportResults = () => {
        const worksheet = XLSX.utils.json_to_sheet(results);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');
        XLSX.writeFile(workbook, `task_${taskId}_results.xlsx`);
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setLoadingResults(true);
            const formData = new FormData();
            formData.append('file', file);

            // Upload the Excel file to the backend
            await axiosInstance.post(`${API_URL}/tasks/${taskId}/results/import`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Refresh the results after successful import
            await fetchResults();
            setError(null);
        } catch (error) {
            console.error('Error importing Excel file:', error);
            setError('Error importing Excel file. Please ensure it has the correct format.');
        } finally {
            setLoadingResults(false);
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleExportManualResults = () => {
        const worksheet = XLSX.utils.json_to_sheet(manualResultsData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Manual Results');
        XLSX.writeFile(workbook, `manual_results_${taskId}.xlsx`);
    };

    const getStatusColor = (status: string) => {
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

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'reconnaissance':
                return 'info';
            case 'vulnerability':
                return 'warning';
            case 'exploitation':
                return 'error';
            case 'post_exploitation':
                return 'success';
            default:
                return 'default';
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !task) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="error" variant="h6">{error || 'Task not found'}</Typography>
                <Button onClick={handleBack} startIcon={<ArrowBackIcon />} sx={{ mt: 2 }}>
                    Back to Operation
                </Button>
            </Box>
        );
    }

    const relevantTools = tools?.filter(tool => tool.type === task.phase) || [];

    return (
        <Container maxWidth={false} sx={{ maxWidth: '1600px', mx: 'auto', px: { xs: 0, md: 2 }, py: { xs: 1, md: 2 } }}>
            <Box sx={{
                width: '100%',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: theme.palette.background.default,
                boxSizing: 'border-box',
            }}>
                {/* Header */}
                <Paper elevation={8} sx={{
                    width: '100%',
                    maxWidth: '1600px',
                    p: { xs: 1, md: 2 },
                    mb: { xs: 1, md: 2 },
                    borderRadius: 2,
                    background: alpha(theme.palette.background.paper, 0.98),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.06)}`,
                    boxShadow: 10,
                    backdropFilter: 'blur(6px)',
                    transition: 'box-shadow 0.3s, background 0.3s',
                }}>
                    <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
                        <Grid item xs={12} md={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minWidth: 0 }}>
                            <IconButton onClick={handleBack} sx={{ color: theme.palette.primary.main }}>
                                <ArrowBackIcon />
                            </IconButton>
                        </Grid>
                        <Grid item xs={12} md={7} sx={{ width: '100%', minWidth: 0 }}>
                            <Typography variant="h5" fontWeight={700} color="text.primary" gutterBottom sx={{ fontSize: { xs: 20, md: 26 } }}>{task.title}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                <Chip 
                                    label={task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('_', ' ')} 
                                    color={getStatusColor(task.status)} 
                                    sx={{ fontWeight: 600 }} 
                                />
                                <Chip 
                                    label={task.phase?.replace(/_/g, ' ').charAt(0).toUpperCase() + task.phase?.slice(1)} 
                                    color="info" 
                                    variant="outlined"
                                    sx={{ fontWeight: 600 }}
                                />
                                <Typography variant="body2" color="text.secondary">
                                    Created: {new Date(task.createdAt).toLocaleString()}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, width: '100%', minWidth: 0 }}>
                            <Button
                                variant="outlined"
                                startIcon={<EditIcon />}
                                onClick={handleEdit}
                                sx={{ mr: 1, borderRadius: 2, px: 2, py: 0.5, fontSize: 14, boxShadow: 1, '&:hover': { boxShadow: 3 } }}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={handleDelete}
                                sx={{ borderRadius: 2, px: 2, py: 0.5, fontSize: 14, boxShadow: 1, '&:hover': { boxShadow: 3 } }}
                            >
                                Delete
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                <Divider sx={{ mb: 2, opacity: 0.10 }} />

                {/* Main Content */}
                <Grid container spacing={2} justifyContent="center" sx={{ width: '100%' }}>
                    {/* Task Overview */}
                    <Grid item xs={12} md={8}>
                        <Card sx={{ 
                            p: { xs: 2, sm: 3 },
                            borderRadius: 4,
                            background: alpha(theme.palette.background.paper, 0.98),
                            boxShadow: 6,
                            backdropFilter: 'blur(8px)',
                            width: '100%',
                            mb: { xs: 2, md: 3 },
                            transition: 'box-shadow 0.3s, transform 0.2s',
                            '&:hover': { boxShadow: 12, transform: 'translateY(-4px) scale(1.01)' },
                        }}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>Task Overview</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                        Description
                                    </Typography>
                                    <Box component="div" sx={{ 
                                        p: 2, 
                                        bgcolor: alpha(theme.palette.background.default, 0.5),
                                        borderRadius: 1,
                                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                    }}>
                                        {task.description}
                                    </Box>
                                </Grid>
                            </Grid>
                        </Card>

                        {/* Tools Section */}
                        <Card sx={{ 
                            p: { xs: 2, sm: 3 },
                            borderRadius: 4,
                            background: alpha(theme.palette.background.paper, 0.98),
                            boxShadow: 6,
                            backdropFilter: 'blur(8px)',
                            width: '100%',
                            mb: { xs: 2, md: 3 },
                            transition: 'box-shadow 0.3s, transform 0.2s',
                            '&:hover': { boxShadow: 12, transform: 'translateY(-4px) scale(1.01)' },
                        }}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>Available Tools</Typography>
                            <Grid container spacing={2}>
                                {relevantTools.map((tool) => (
                                    <Grid item xs={12} sm={6} md={4} key={tool.id}>
                                        <Card 
                                            sx={{ 
                                                p: 2,
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                background: alpha(theme.palette.background.paper, 0.7),
                                                borderRadius: 2,
                                                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                                '&:hover': {
                                                    boxShadow: 8,
                                                    transform: 'translateY(-4px)',
                                                    background: alpha(theme.palette.background.paper, 0.9),
                                                },
                                                transition: 'all 0.3s ease',
                                            }}
                                        >
                                            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                                {tool.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                                                {tool.description}
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                startIcon={<PlayArrowIcon />}
                                                onClick={() => handleOpenToolDialog(tool)}
                                                fullWidth
                                                sx={{
                                                    borderRadius: 2,
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                    boxShadow: 2,
                                                    '&:hover': {
                                                        boxShadow: 4,
                                                    },
                                                }}
                                            >
                                                Execute
                                            </Button>
                                        </Card>
                                    </Grid>
                                ))}
                                {relevantTools.length === 0 && (
                                    <Grid item xs={12}>
                                        <Typography color="text.secondary" align="center">
                                            No tools available for this phase
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </Card>

                        {/* Results Section */}
                        <Card sx={{ 
                            p: { xs: 2, sm: 3 },
                            borderRadius: 4,
                            background: alpha(theme.palette.background.paper, 0.98),
                            boxShadow: 6,
                            backdropFilter: 'blur(8px)',
                            width: '100%',
                            mb: { xs: 2, md: 3 },
                            transition: 'box-shadow 0.3s, transform 0.2s',
                            '&:hover': { boxShadow: 12, transform: 'translateY(-4px) scale(1.01)' },
                        }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" fontWeight={600}>Results</Typography>
                                <Box>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        accept=".xlsx,.xls"
                                        style={{ display: 'none' }}
                                    />
                                    <Button
                                        variant="outlined"
                                        startIcon={<UploadIcon />}
                                        onClick={handleImportClick}
                                        sx={{ mr: 1, borderRadius: 2, textTransform: 'none' }}
                                    >
                                        Import Excel
                                    </Button>
                                    {results?.length > 0 && (
                                        <Button
                                            variant="outlined"
                                            startIcon={<DownloadIcon />}
                                            onClick={handleExportResults}
                                            sx={{ borderRadius: 2, textTransform: 'none' }}
                                        >
                                            Export Results
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                            
                            <Paper sx={{ 
                                p: 2, 
                                bgcolor: alpha(theme.palette.background.default, 0.5),
                                borderRadius: 2,
                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                height: 600,
                            }}>
                                {loadingResults ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                        <CircularProgress />
                                    </Box>
                                ) : results?.length > 0 ? (
                                    <DataGrid
                                        rows={results}
                                        columns={columns}
                                        initialState={{
                                            pagination: {
                                                paginationModel: { pageSize: 10, page: 0 },
                                            },
                                        }}
                                        pageSizeOptions={[10, 25, 50]}
                                        disableRowSelectionOnClick
                                        sx={{
                                            border: 'none',
                                            '& .MuiDataGrid-cell': {
                                                borderColor: alpha(theme.palette.divider, 0.1),
                                                fontSize: '0.875rem',
                                            },
                                            '& .MuiDataGrid-columnHeaders': {
                                                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                                borderColor: alpha(theme.palette.divider, 0.1),
                                                fontSize: '0.875rem',
                                                fontWeight: 600,
                                            },
                                            '& .MuiDataGrid-footerContainer': {
                                                borderColor: alpha(theme.palette.divider, 0.1),
                                            },
                                        }}
                                    />
                                ) : (
                                    <Box sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'center', 
                                        alignItems: 'center', 
                                        height: '100%',
                                        color: 'text.secondary'
                                    }}>
                                        No results available. Import an Excel file to add results.
                                    </Box>
                                )}
                            </Paper>
                        </Card>
                    </Grid>

                    {/* Sidebar */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ 
                            p: { xs: 2, sm: 3 },
                            borderRadius: 4,
                            background: alpha(theme.palette.background.paper, 0.98),
                            boxShadow: 6,
                            backdropFilter: 'blur(8px)',
                            width: '100%',
                            mb: { xs: 2, md: 3 },
                            transition: 'box-shadow 0.3s, transform 0.2s',
                            '&:hover': { boxShadow: 12, transform: 'translateY(-4px) scale(1.01)' },
                        }}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>Task Details</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                                        <Typography variant="subtitle1" fontWeight={500}>Assigned To</Typography>
                                    </Box>
                                    <Box sx={{ 
                                        p: 1.5, 
                                        bgcolor: alpha(theme.palette.background.default, 0.5),
                                        borderRadius: 1,
                                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                    }}>
                                        {task?.assignedTo ? task.assignedTo.username : 'Unassigned'}
                                    </Box>
                                </Box>

                                {task?.tools && task.tools.length > 0 && (
                                    <Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <BuildIcon sx={{ mr: 1, color: 'primary.main' }} />
                                            <Typography variant="subtitle1" fontWeight={500}>Tools</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                            {task.tools.map((tool: string) => (
                                                <Chip 
                                                    key={tool} 
                                                    label={tool} 
                                                    size="small"
                                                    sx={{ 
                                                        fontWeight: 600,
                                                        background: alpha(theme.palette.primary.main, 0.1),
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                )}

                                {task?.mitreId && (
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={500} gutterBottom>MITRE ID</Typography>
                                        <Chip 
                                            label={task.mitreId} 
                                            size="small"
                                            sx={{ 
                                                fontWeight: 600,
                                                background: alpha(theme.palette.info.main, 0.1),
                                            }}
                                        />
                                    </Box>
                                )}

                                {task.owaspId && (
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={500} gutterBottom>OWASP ID</Typography>
                                        <Chip 
                                            label={task.owaspId} 
                                            size="small"
                                            sx={{ 
                                                fontWeight: 600,
                                                background: alpha(theme.palette.warning.main, 0.1),
                                            }}
                                        />
                                    </Box>
                                )}

                                <Divider sx={{ my: 1, opacity: 0.1 }} />

                                <Box>
                                    <Typography variant="subtitle1" fontWeight={500} gutterBottom>Timeline</Typography>
                                    <Box sx={{ 
                                        p: 1.5, 
                                        bgcolor: alpha(theme.palette.background.default, 0.5),
                                        borderRadius: 1,
                                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                    }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Created: {new Date(task.createdAt).toLocaleString()}
                                        </Typography>
                                        {task.updatedAt && (
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                Last Updated: {new Date(task.updatedAt).toLocaleString()}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>

                {/* Tool Execution Dialog */}
                <Dialog 
                    open={openToolDialog} 
                    onClose={handleCloseToolDialog} 
                    maxWidth="sm" 
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 2,
                            background: alpha(theme.palette.background.paper, 0.98),
                            backdropFilter: 'blur(8px)',
                        }
                    }}
                >
                    <DialogTitle sx={{ 
                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        pb: 2
                    }}>
                        Execute {selectedTool?.name}
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ mt: 2 }}>
                            {selectedTool && Object.entries(selectedTool.arguments).map(([key, value]) => (
                                <TextField
                                    key={key}
                                    fullWidth
                                    label={key}
                                    value={executeArgs[key] || ''}
                                    onChange={(e) => setExecuteArgs({ ...executeArgs, [key]: e.target.value })}
                                    margin="normal"
                                    helperText={typeof value === 'string' ? value : ''}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                        },
                                    }}
                                />
                            ))}
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ 
                        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        px: 3,
                        py: 2
                    }}>
                        <Button 
                            onClick={handleCloseToolDialog}
                            sx={{ 
                                borderRadius: 2,
                                px: 2,
                                textTransform: 'none',
                            }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleExecuteTool} 
                            variant="contained"
                            disabled={!selectedTool}
                            sx={{ 
                                borderRadius: 2,
                                px: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                            }}
                        >
                            Execute
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Container>
    );
};

export default TaskDashboard; 