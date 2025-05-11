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
    Tooltip,
    CircularProgress,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    PlayArrow as ExecuteIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    fetchTools,
    createTool,
    updateTool,
    deleteTool,
    executeTool,
} from '../store/slices/toolSlice';
import type { Tool, ToolType } from '../types/models';

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
    const [submitting, setSubmitting] = useState(false);

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
                    sx={{ borderRadius: 2, fontWeight: 700, fontSize: 14, px: 1.5 }}
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
                    sx={{ borderRadius: 2, fontWeight: 700, fontSize: 14, px: 1.5 }}
                />
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            renderCell: (params) => (
                <Box>
                    <Tooltip title="Edit" arrow>
                        <IconButton onClick={() => handleOpenDialog(params.row)} size="small">
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete" arrow>
                        <IconButton onClick={() => handleDelete(params.row.id)} size="small" color="error">
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Execute" arrow>
                        <IconButton onClick={() => handleOpenExecuteDialog(params.row)} size="small" color="info">
                            <ExecuteIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];

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
                            Tools
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            sx={{ color: 'text.secondary', fontWeight: 500, mb: 1 }}
                        >
                            Manage, execute, and organize your security tools efficiently.
                        </Typography>
                        <Box sx={{ height: 4, width: 48, background: 'primary.main', borderRadius: 2, mb: 1 }} />
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
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
                        + New Tool
                    </Button>
                </Card>

                {/* Tools Table Card */}
                <Card sx={{
                    width: '100%',
                    boxShadow: '0 4px 32px 0 rgba(0,0,0,0.18)',
                    p: { xs: 1, md: 3 },
                    mb: 4,
                    borderRadius: 4,
                    background: (theme) => `rgba(30,30,30,0.82)`,
                    backdropFilter: 'blur(10px)',
                    border: (theme) => `1.5px solid ${theme.palette.primary.main}22`,
                    transition: 'box-shadow 0.3s, background 0.3s',
                }}>
                    <DataGrid
                        rows={tools}
                        columns={columns.map(col => ({ ...col, flex: col.field === 'actions' ? 0.5 : 1, minWidth: 150 }))}
                        loading={loading}
                        autoHeight
                        getRowId={(row) => row.id}
                        pageSizeOptions={[10, 25, 50]}
                        disableRowSelectionOnClick
                        sx={{
                            backgroundColor: 'transparent',
                            borderRadius: 3,
                            fontFamily: 'Graphik Arabic, Roboto, Helvetica, Arial, sans-serif',
                            '& .MuiDataGrid-cell': {
                                color: 'text.primary',
                                fontWeight: 500,
                                fontSize: 16,
                                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                                background: 'transparent',
                            },
                            '& .MuiDataGrid-row:nth-of-type(even)': {
                                background: (theme) => `${theme.palette.background.default}08`,
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                position: 'sticky',
                                top: 0,
                                zIndex: 2,
                                background: (theme) => `linear-gradient(90deg, ${theme.palette.background.paper}F7 60%, ${theme.palette.background.default}EB 100%)`,
                                color: 'primary.main',
                                fontWeight: 800,
                                fontSize: 17,
                                borderBottom: '2px solid',
                                borderColor: 'divider',
                                letterSpacing: 1,
                            },
                            '& .MuiDataGrid-footerContainer': {
                                background: (theme) => `linear-gradient(90deg, ${theme.palette.background.paper}F7 60%, ${theme.palette.background.default}EB 100%)`,
                                color: 'text.primary',
                                borderTop: '1px solid',
                                borderColor: 'divider',
                            },
                            '& .MuiDataGrid-row:hover': {
                                background: (theme) => `${theme.palette.primary.main}11`,
                                boxShadow: (theme) => `0 2px 12px 0 ${theme.palette.primary.main}22`,
                                cursor: 'pointer',
                            },
                            '& .MuiDataGrid-row': {
                                transition: 'background 0.2s, box-shadow 0.2s',
                            },
                            '& .MuiIconButton-root': {
                                color: 'text.secondary',
                                transition: 'color 0.2s, transform 0.2s',
                                '&:hover': {
                                    color: 'primary.main',
                                    transform: 'scale(1.18)',
                                },
                            },
                            '& .MuiDataGrid-virtualScroller': {
                                overflowX: 'hidden',
                            },
                        }}
                    />
                </Card>

                {/* Dialog/Form */}
                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    maxWidth="md"
                    fullWidth
                    PaperProps={{
                        sx: {
                            minHeight: '40vh',
                            maxHeight: '90vh',
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
                            {selectedTool ? 'Edit Tool' : 'New Tool'}
                        </Typography>
                    </DialogTitle>
                    <DialogContent dividers sx={{ pt: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: 1 }}>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    helperText="Enter a unique tool name."
                                />
                                <TextField
                                    fullWidth
                                    select
                                    label="Type"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value as ToolType })}
                                    required
                                    helperText="Select the tool type."
                                >
                                    <MenuItem value="reconnaissance">Reconnaissance</MenuItem>
                                    <MenuItem value="vulnerability">Vulnerability</MenuItem>
                                    <MenuItem value="exploitation">Exploitation</MenuItem>
                                    <MenuItem value="post_exploitation">Post Exploitation</MenuItem>
                                </TextField>
                            </Box>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                                helperText="Describe the tool's purpose."
                            />
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <TextField
                                    fullWidth
                                    label="Command"
                                    value={formData.command}
                                    onChange={(e) => setFormData({ ...formData, command: e.target.value })}
                                    required
                                    helperText="Specify the command to execute."
                                />
                                <TextField
                                    fullWidth
                                    label="Output Format"
                                    value={formData.outputFormat}
                                    onChange={(e) => setFormData({ ...formData, outputFormat: e.target.value })}
                                    required
                                    helperText="e.g., JSON, TXT, XML"
                                />
                            </Box>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.isActive ?? true}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        color="primary"
                                    />
                                }
                                label="Active"
                                sx={{ ml: 1 }}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 2, gap: 1 }}>
                        <Button onClick={handleCloseDialog} variant="outlined">
                            Cancel
                        </Button>
                        <Button
                            onClick={async () => {
                                setSubmitting(true);
                                await handleSubmit();
                                setSubmitting(false);
                            }}
                            variant="contained"
                            disabled={!formData.name || !formData.type || !formData.command || submitting}
                            startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : null}
                        >
                            {selectedTool ? 'Update' : 'Create'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
};

export default Tools; 