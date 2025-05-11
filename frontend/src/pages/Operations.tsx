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
        { field: 'status', headerName: 'Status', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Box>
                    <IconButton onClick={() => handleOpenDialog(params.row)} size="small">
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(params.row._id)} size="small" color="error">
                        <DeleteIcon />
                    </IconButton>
                    <IconButton onClick={() => {/* TODO: Implement view details */}} size="small">
                        <ViewIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];

    return (
        <Box sx={{ p: 3, px: 4, width: '100%', maxWidth: 1400, margin: '0 auto' }}>
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 3, 
                width: '100%'
            }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Operations
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary"
                    startIcon={<AddIcon />} 
                    onClick={() => handleOpenDialog()}
                    sx={{ minWidth: 180, fontWeight: 600 }}
                >
                    + New Operation
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
                    {error}
                </Alert>
            )}

            <Card sx={{ width: '100%', boxShadow: 3, p: 2, mb: 4 }}>
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
                        backgroundColor: 'background.paper',
                        borderRadius: 2,
                        width: '100%',
                        '& .MuiDataGrid-cell': {
                            color: 'text.primary',
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: 'background.paper',
                            color: 'text.primary',
                            borderBottom: '2px solid',
                            borderColor: 'divider',
                        },
                        '& .MuiDataGrid-footerContainer': {
                            backgroundColor: 'background.paper',
                            color: 'text.primary',
                            borderTop: '1px solid',
                            borderColor: 'divider',
                        },
                        '& .MuiDataGrid-row:hover': {
                            backgroundColor: 'action.hover',
                        },
                    }}
                />
            </Card>

            <Dialog 
                open={openDialog} 
                onClose={handleCloseDialog} 
                maxWidth="md" 
                fullWidth
                PaperProps={{
                    sx: {
                        minHeight: '60vh',
                        maxHeight: '90vh',
                    }
                }}
            >
                <DialogTitle>
                    <Typography variant="h6">
                        {selectedOperation ? 'Edit Operation' : 'New Operation'}
                    </Typography>
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                fullWidth
                                label="Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <TextField
                                fullWidth
                                select
                                label="Type"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as OperationType })}
                                required
                            >
                                <MenuItem value="red_team">Red Team</MenuItem>
                                <MenuItem value="pen_test">Penetration Test</MenuItem>
                                <MenuItem value="vulnerability_assessment">Vulnerability Assessment</MenuItem>
                            </TextField>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                fullWidth
                                select
                                label="Current Phase"
                                value={formData.current_phase}
                                onChange={(e) => setFormData({ ...formData, current_phase: e.target.value as OperationPhase })}
                                required
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
                        />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Scope"
                                value={formData.scope}
                                onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                                required
                            />
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Rules of Engagement"
                                value={formData.roe}
                                onChange={(e) => setFormData({ ...formData, roe: e.target.value })}
                                required
                            />
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button onClick={handleCloseDialog} variant="outlined">
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        variant="contained"
                        disabled={!formData.name || !formData.type || !formData.description}
                    >
                        {selectedOperation ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Operations;
    