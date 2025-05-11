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
    Tooltip,
    CircularProgress,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
} from '../store/slices/userSlice';
import { fetchOperations } from '../store/slices/operationSlice';
import type { User, UserRole } from '../types/models';

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
    const [submitting, setSubmitting] = useState(false);

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
                    sx={{ borderRadius: 2, fontWeight: 700, fontSize: 14, px: 1.5 }}
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
                        .filter((op: { teamLead: string; members: string[] }) => op.teamLead === params.row.id || (op.members || []).includes(params.row.id))
                        .map((op: { id: string; name: string; teamLead: string }) => (
                            <Chip
                                key={op.id}
                                label={op.name}
                                size="small"
                                color={op.teamLead === params.row.id ? 'primary' : 'default'}
                                sx={{ borderRadius: 2, fontWeight: 600, fontSize: 13 }}
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
                            Team Members
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            sx={{ color: 'text.secondary', fontWeight: 500, mb: 1 }}
                        >
                            Manage your team, assign roles, and track operation participation.
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
                        + New Member
                    </Button>
                </Card>

                {/* Team Table Card */}
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
                        rows={users}
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
                            {selectedUser ? 'Edit Team Member' : 'New Team Member'}
                        </Typography>
                    </DialogTitle>
                    <DialogContent dividers sx={{ pt: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: 1 }}>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <TextField
                                    fullWidth
                                    label="Username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                    helperText="Enter a unique username."
                                />
                                <TextField
                                    fullWidth
                                    label="Email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    helperText="Enter a valid email address."
                                />
                            </Box>
                            <TextField
                                fullWidth
                                select
                                label="Role"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                                required
                                helperText="Assign a role to the user."
                            >
                                <MenuItem value="admin">Admin</MenuItem>
                                <MenuItem value="team_lead">Team Lead</MenuItem>
                                <MenuItem value="member">Member</MenuItem>
                            </TextField>
                            <Autocomplete
                                multiple
                                options={operations}
                                getOptionLabel={(option) => option.name}
                                value={operations.filter((op) =>
                                    (formData.operations || []).includes(op.id)
                                )}
                                onChange={(_, value) =>
                                    setFormData({
                                        ...formData,
                                        operations: value.map((op) => op.id),
                                    })
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Assigned Operations"
                                        placeholder="Select operations"
                                        helperText="Assign operations to this user."
                                    />
                                )}
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
                            disabled={!formData.username || !formData.email || !formData.role || submitting}
                            startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : null}
                        >
                            {selectedUser ? 'Update' : 'Create'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
};

export default Team; 