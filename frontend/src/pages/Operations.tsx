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

const Operations: React.FC = () => {
    const dispatch = useAppDispatch();
    const { operations, loading } = useAppSelector((state) => state.operations);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);
    const [formData, setFormData] = useState<Partial<Operation>>({
        name: '',
        type: 'red_team',
        description: '',
        scope: '',
        roe: '',
        currentPhase: 'reconnaissance',
        status: 'pending',
    });

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
                currentPhase: 'reconnaissance',
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
                    id: selectedOperation.id,
                    operation: formData,
                }));
            } else {
                await dispatch(createOperation(formData as Omit<Operation, 'id' | 'createdAt' | 'updatedAt'>));
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
        { field: 'currentPhase', headerName: 'Current Phase', flex: 1 },
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
              <IconButton onClick={() => handleDelete(params.row.id)} size="small" color="error">
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
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h4">Operations</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
              New Operation
            </Button>
          </Box>
    
          <Card>
            <DataGrid
              rows={operations}
              columns={columns}
              loading={loading}
              autoHeight
              getRowId={(row) => row.id}
              initialState={{
                pagination: { paginationModel: { pageSize: 10, page: 0 } },
              }}
              pageSizeOptions={[10]}
              disableRowSelectionOnClick
            />
          </Card>
    
          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
            <DialogTitle>{selectedOperation ? 'Edit Operation' : 'New Operation'}</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <TextField
                    fullWidth
                    select
                    label="Type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as OperationType })}
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
                    value={formData.currentPhase}
                    onChange={(e) => setFormData({ ...formData, currentPhase: e.target.value as OperationPhase })}
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
                  rows={4}
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Scope"
                    value={formData.scope}
                    onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Rules of Engagement"
                    value={formData.roe}
                    onChange={(e) => setFormData({ ...formData, roe: e.target.value })}
                  />
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={handleSubmit} variant="contained">
                {selectedOperation ? 'Update' : 'Create'}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      );
    };
    
    export default Operations;
    