import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import {
    Box,
    Button,
    Card,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    Paper,
    TextField,
    Typography,
    Alert,
    Chip,
    Tooltip,
    CircularProgress,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
} from '@mui/icons-material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    fetchOperations,
    createOperation,
    updateOperation,
    deleteOperation,
} from '../store/slices/operationSlice';
import type { Operation, OperationType, OperationPhase } from '../types/models';
import { useNavigate } from 'react-router-dom';

const statusColors = {
    pending: 'warning',
    in_progress: 'info',
    completed: 'success',
    cancelled: 'error',
};

const Operations: React.FC = () => {
    const dispatch = useAppDispatch();
    const { operations, loading, error } = useAppSelector((state) => state.operations);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);
    const [formData, setFormData] = useState<Partial<Operation>>({
        name: '',
        type: 'red_team',
        description: '',
        scope: '',
        roe: '',
        current_phase: 'reconnaissance',
        status: 'pending',
    });
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchOperations());
    }, [dispatch]);

    const handleOpenDialog = (operation?: Operation) => {
        if (operation) {
            setSelectedOperation(operation);
            setFormData(operation);
        } else {
            setSelectedOperation(null);
            setFormData({
                name: '',
                type: 'red_team',
                description: '',
                scope: '',
                roe: '',
                current_phase: 'reconnaissance',
                status: 'pending',
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedOperation(null);
    };

    const handleSubmit = async () => {
        try {
            if (selectedOperation) {
                await dispatch(updateOperation({
                    id: selectedOperation._id,
                    operation: formData,
                }));
            } else {
                await dispatch(createOperation(formData as Omit<Operation, '_id' | 'created_at' | 'updated_at'>));
            }
            handleCloseDialog();
        } catch (error) {
            console.error('Error saving operation:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this operation?')) {
            try {
                await dispatch(deleteOperation(id));
            } catch (error) {
                console.error('Error deleting operation:', error);
            }
        }
    };

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'type', headerName: 'Type', flex: 1 },
        { field: 'current_phase', headerName: 'Current Phase', flex: 1 },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            renderCell: (params) => (
                <Chip
                    label={params.value.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    color={statusColors[params.value] || 'default'}
                    variant="filled"
                    size="small"
                    sx={{ borderRadius: 2, fontWeight: 700, fontSize: 14, px: 1.5 }}
                />
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Box>
                    <Tooltip title="Edit" arrow>
                        <IconButton onClick={() => handleOpenDialog(params.row)} size="small">
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete" arrow>
                        <IconButton onClick={() => handleDelete(params.row._id)} size="small" color="error">
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="View Details" arrow>
                        <IconButton onClick={() => {}} size="small">
                            <ViewIcon />
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
                            Operations
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            sx={{ color: 'text.secondary', fontWeight: 500, mb: 1 }}
                        >
                            Manage, track, and analyze all your security operations in one place.
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
                        + New Operation
                    </Button>
                </Card>

                {/* Data Table Card */}
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
                        rows={operations}
                        columns={columns.map(col => ({ ...col, flex: col.field === 'actions' ? 0.5 : 1, minWidth: 150 }))}
                        loading={loading}
                        autoHeight
                        getRowId={(row) => row._id}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 10, page: 0 } },
                            sorting: {
                                sortModel: [{ field: 'created_at', sort: 'desc' }],
                            },
                        }}
                        pageSizeOptions={[10, 25, 50]}
                        disableRowSelectionOnClick
                        onRowClick={(params) => navigate(`/operations/${params.row._id}`)}
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
                            '& .MuiDataGrid-overlay': {
                                background: 'none',
                                color: 'text.secondary',
                                fontSize: 18,
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: 200,
                            },
                        }}
                        slots={{
                            noRowsOverlay: () => (
                                <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                                    <ViewIcon sx={{ fontSize: 48, mb: 1, opacity: 0.3 }} />
                                    <Typography variant="h6" fontWeight={700} color="text.secondary">
                                        No operations found
                                    </Typography>
                                </Box>
                            ),
                        }}
                    />
                </Card>

                {/* Floating Action Button for large screens */}
                <Box sx={{
                    position: 'fixed',
                    bottom: { xs: 24, md: 40 },
                    right: { xs: 24, md: 60 },
                    zIndex: 1201,
                    display: { xs: 'none', md: 'flex' },
                }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                        sx={{
                            borderRadius: '50px',
                            boxShadow: 8,
                            px: 4,
                            py: 1.5,
                            fontWeight: 800,
                            fontSize: 20,
                            letterSpacing: 1,
                            background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.main} 80%, ${theme.palette.secondary.main} 100%)`,
                            transition: 'all 0.2s',
                            '&:hover': {
                                background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.dark} 80%, ${theme.palette.secondary.dark} 100%)`,
                                boxShadow: 16,
                                transform: 'scale(1.06)',
                            },
                        }}
                    >
                        New Operation
                    </Button>
                </Box>

                {/* Dialog/Form */}
                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    maxWidth="md"
                    fullWidth
                    PaperProps={{
                        sx: {
                            minHeight: '60vh',
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
                            {selectedOperation ? 'Edit Operation' : 'New Operation'}
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
                                    helperText="Enter a unique operation name."
                                />
                                <TextField
                                    fullWidth
                                    select
                                    label="Type"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value as OperationType })}
                                    required
                                    helperText="Select the operation type."
                                >
                                    <MenuItem value="red_team">Red Team</MenuItem>
                                    <MenuItem value="pen_test">Penetration Test</MenuItem>
                                    <MenuItem value="vulnerability_assessment">Vulnerability Assessment</MenuItem>
                                </TextField>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Current Phase"
                                    value={formData.current_phase}
                                    onChange={(e) => setFormData({ ...formData, current_phase: e.target.value as OperationPhase })}
                                    required
                                    helperText="Select the current phase."
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
                                <TextField
                                    fullWidth
                                    select
                                    label="Status"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    required
                                    helperText="Set the current status."
                                >
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="in_progress">In Progress</MenuItem>
                                    <MenuItem value="completed">Completed</MenuItem>
                                    <MenuItem value="cancelled">Cancelled</MenuItem>
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
                                helperText="Describe the operation's objectives."
                            />
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Scope"
                                    value={formData.scope}
                                    onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                                    required
                                    helperText="Define the scope of the operation."
                                />
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Rules of Engagement"
                                    value={formData.roe}
                                    onChange={(e) => setFormData({ ...formData, roe: e.target.value })}
                                    required
                                    helperText="Specify the rules of engagement."
                                />
                            </Box>
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
                            disabled={!formData.name || !formData.type || !formData.description || submitting}
                            startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : null}
                        >
                            {selectedOperation ? 'Update' : 'Create'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
};

export default Operations;
    