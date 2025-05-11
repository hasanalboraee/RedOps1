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
    Autocomplete,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
} from '../store/slices/userSlice';
import { fetchOperations } from '../store/slices/operationSlice';
import { User, UserRole } from '../types/models';

const Team: React.FC = () => {
    const dispatch = useAppDispatch();
    const { users, loading } = useAppSelector((state) => state.users);
    const { operations } = useAppSelector((state) => state.operations);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<Partial<User>>({
        username: '',
        email: '',
        role: 'member',
    });

    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchOperations());
    }, [dispatch]);

    const handleOpenDialog = (user?: User) => {
        if (user) {
            setSelectedUser(user);
            setFormData(user);
        } else {
            setSelectedUser(null);
            setFormData({
                username: '',
                email: '',
                role: 'member',
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedUser(null);
    };

    const handleSubmit = async () => {
        try {
            if (selectedUser) {
                await dispatch(updateUser({
                    id: selectedUser.id,
                    user: formData,
                }));
            } else {
                await dispatch(createUser(formData as Omit<User, 'id' | 'createdAt' | 'updatedAt'>));
            }
            handleCloseDialog();
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await dispatch(deleteUser(id));
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const getRoleColor = (role: UserRole) => {
        switch (role) {
            case 'admin':
                return 'error';
            case 'team_lead':
                return 'warning';
            case 'member':
                return 'info';
            default:
                return 'default';
        }
    };

    const columns: GridColDef[] = [
        { field: 'username', headerName: 'Username', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1 },
        {
            field: 'role',
            headerName: 'Role',
            flex: 1,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={getRoleColor(params.value as UserRole)}
                    size="small"
                />
            ),
        },
        {
            field: 'operations',
            headerName: 'Assigned Operations',
            flex: 2,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {operations
                        .filter(op => op.teamLead === params.row.id || op.members.includes(params.row.id))
                        .map(op => (
                            <Chip
                                key={op.id}
                                label={op.name}
                                size="small"
                                color={op.teamLead === params.row.id ? 'primary' : 'default'}
                            />
                        ))}
                </Box>
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
                </Box>
            ),
        },
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Team Members</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    New Member
                </Button>
            </Box>

            <Card>
                <DataGrid
                    rows={users}
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
                    {selectedUser ? 'Edit Team Member' : 'New Team Member'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                select
                                label="Role"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                            >
                                <MenuItem value="admin">Admin</MenuItem>
                                <MenuItem value="team_lead">Team Lead</MenuItem>
                                <MenuItem value="member">Member</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {selectedUser ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Team; 