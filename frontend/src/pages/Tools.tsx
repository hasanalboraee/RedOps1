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
    Switch,
    FormControlLabel,
    Chip,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    PlayArrow as ExecuteIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    fetchTools,
    createTool,
    updateTool,
    deleteTool,
    executeTool,
} from '../store/slices/toolSlice';
import { Tool, ToolType } from '../types/models';

const Tools: React.FC = () => {
    const dispatch = useAppDispatch();
    const { tools, loading } = useAppSelector((state) => state.tools);
    const [openDialog, setOpenDialog] = useState(false);
    const [openExecuteDialog, setOpenExecuteDialog] = useState(false);
    const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
    const [formData, setFormData] = useState<Partial<Tool>>({
        name: '',
        type: 'reconnaissance',
        description: '',
        command: '',
        arguments: {},
        outputFormat: '',
        isActive: true,
    });
    const [executeArgs, setExecuteArgs] = useState<Record<string, string>>({});

    useEffect(() => {
        dispatch(fetchTools());
    }, [dispatch]);

    const handleOpenDialog = (tool?: Tool) => {
        if (tool) {
            setSelectedTool(tool);
            setFormData(tool);
        } else {
            setSelectedTool(null);
            setFormData({
                name: '',
                type: 'reconnaissance',
                description: '',
                command: '',
                arguments: {},
                outputFormat: '',
                isActive: true,
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedTool(null);
    };

    const handleOpenExecuteDialog = (tool: Tool) => {
        setSelectedTool(tool);
        setExecuteArgs(
            Object.keys(tool.arguments).reduce((acc, key) => {
                acc[key] = '';
                return acc;
            }, {} as Record<string, string>)
        );
        setOpenExecuteDialog(true);
    };

    const handleCloseExecuteDialog = () => {
        setOpenExecuteDialog(false);
        setSelectedTool(null);
        setExecuteArgs({});
    };

    const handleSubmit = async () => {
        try {
            if (selectedTool) {
                await dispatch(updateTool({
                    id: selectedTool.id,
                    tool: formData,
                }));
            } else {
                await dispatch(createTool(formData as Omit<Tool, 'id' | 'createdAt' | 'updatedAt'>));
            }
            handleCloseDialog();
        } catch (error) {
            console.error('Error saving tool:', error);
        }
    };

    const handleExecute = async () => {
        if (!selectedTool) return;

        try {
            await dispatch(executeTool({
                toolId: selectedTool.id,
                arguments: Object.entries(executeArgs).map(([key, value]) => `${key}=${value}`),
            }));
            handleCloseExecuteDialog();
        } catch (error) {
            console.error('Error executing tool:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this tool?')) {
            try {
                await dispatch(deleteTool(id));
            } catch (error) {
                console.error('Error deleting tool:', error);
            }
        }
    };

    const getTypeColor = (type: ToolType) => {
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

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', flex: 1 },
        {
            field: 'type',
            headerName: 'Type',
            flex: 1,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={getTypeColor(params.value as ToolType)}
                    size="small"
                />
            ),
        },
        {
            field: 'isActive',
            headerName: 'Status',
            flex: 1,
            renderCell: (params) => (
                <Chip
                    label={params.value ? 'Active' : 'Inactive'}
                    color={params.value ? 'success' : 'default'}
                    size="small"
                />
            ),
        },
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
                        onClick={() => handleOpenExecuteDialog(params.row)}
                        size="small"
                        color="primary"
                    >
                        <ExecuteIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Tools</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    New Tool
                </Button>
            </Box>

            <Card>
                <DataGrid
                    rows={tools}
                    columns={columns}
                    loading={loading}
                    autoHeight
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    disableSelectionOnClick
                />
            </Card>

            {/* Tool Creation/Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    {selectedTool ? 'Edit Tool' : 'New Tool'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                select
                                label="Type"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as ToolType })}
                            >
                                <MenuItem value="reconnaissance">Reconnaissance</MenuItem>
                                <MenuItem value="vulnerability">Vulnerability</MenuItem>
                                <MenuItem value="exploitation">Exploitation</MenuItem>
                                <MenuItem value="post_exploitation">Post Exploitation</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Output Format"
                                value={formData.outputFormat}
                                onChange={(e) => setFormData({ ...formData, outputFormat: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Command"
                                value={formData.command}
                                onChange={(e) => setFormData({ ...formData, command: e.target.value })}
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
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    />
                                }
                                label="Active"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {selectedTool ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Tool Execution Dialog */}
            <Dialog open={openExecuteDialog} onClose={handleCloseExecuteDialog} maxWidth="md" fullWidth>
                <DialogTitle>Execute Tool: {selectedTool?.name}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        {selectedTool && Object.entries(selectedTool.arguments).map(([key, description]) => (
                            <Grid item xs={12} key={key}>
                                <TextField
                                    fullWidth
                                    label={`${key} (${description})`}
                                    value={executeArgs[key] || ''}
                                    onChange={(e) => setExecuteArgs({ ...executeArgs, [key]: e.target.value })}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseExecuteDialog}>Cancel</Button>
                    <Button onClick={handleExecute} variant="contained" color="primary">
                        Execute
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Tools; 