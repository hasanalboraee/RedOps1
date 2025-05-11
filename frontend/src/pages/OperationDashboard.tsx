import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Autocomplete,
  Grid,
  Paper,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Avatar,
  Container,
} from '@mui/material';
import {
  Add as AddIcon,
  Assignment,
  Group,
  CheckCircle,
  Timeline,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import axiosInstance from '../services/axiosConfig';
import type { Task, TaskStatus, OperationPhase, User } from '../types/models';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useSidebarContext } from '../components/layout/SidebarContext';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchTasksByOperation, createTask } from '../store/slices/taskSlice';
import { fetchUsers } from '../store/slices/userSlice';

const API_URL = 'http://localhost:8080/api';

const operationPhases = [
  'reconnaissance',
  'initial_access',
  'execution',
  'persistence',
  'privilege_escalation',
  'defense_evasion',
  'credential_access',
  'discovery',
  'lateral_movement',
  'collection',
  'command_and_control',
  'exfiltration',
  'impact',
];

const mitreOptions = [
  'T1001', 'T1002', 'T1003', 'T1004', 'T1005', // ... add more as needed
];
const owaspOptions = [
  'A01:2021', 'A02:2021', 'A03:2021', 'A04:2021', // ... add more as needed
];

const SIDEBAR_WIDTH = 240;

const OperationDashboard: React.FC = () => {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const [operation, setOperation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingPhase, setUpdatingPhase] = useState(false);
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [taskForm, setTaskForm] = useState<Partial<Task>>({
    title: '',
    description: '',
    operationId: id,
    assignedTo: null as unknown as User,
    status: 'pending',
    phase: 'reconnaissance' as OperationPhase,
    mitreId: '',
    owaspId: '',
    results: '',
    tools: [],
  });
  const [tools, setTools] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const { isOpen } = useSidebarContext();
  const dispatch = useAppDispatch();
  const { tasks: operationTasks, loading: tasksLoading } = useAppSelector((state) => state.tasks);
  const { users: allUsers, loading: usersLoading } = useAppSelector((state) => state.users);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOperation = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/operations/${id}`);
        setOperation(res.data);
        console.log('Operation data:', res.data);
      } catch (err: any) {
        console.error('Error fetching operation:', err);
        setError('Failed to load operation');
      } finally {
        setLoading(false);
      }
    };
    fetchOperation();
  }, [id]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (id) {
        try {
          console.log('Fetching tasks for operation:', id);
          dispatch(fetchTasksByOperation(id));
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      }
    };
    fetchTasks();
    dispatch(fetchUsers());
  }, [dispatch, id]);

  // Add debug logging
  useEffect(() => {
    console.log('Operation Tasks in state:', operationTasks);
  }, [operationTasks]);

  useEffect(() => {
    axiosInstance.get('/tools').then(res => setTools(res.data));
    // Members for assignment
    if (operation && operation.members) setMembers(operation.members);
  }, [operation]);

  const handlePhaseChange = async (newPhase: string) => {
    if (!id) return;
    setUpdatingPhase(true);
    try {
      await axiosInstance.put(`/operations/${id}/phase`, { phase: newPhase });
      setOperation((prev: any) => ({ ...prev, current_phase: newPhase }));
    } catch (err) {
      alert('Failed to update phase');
    } finally {
      setUpdatingPhase(false);
    }
  };

  const handleOpenTaskDialog = () => {
    setTaskForm({
      title: '',
      description: '',
      operationId: id,
      assignedTo: null as unknown as User,
      status: 'pending',
      phase: 'reconnaissance' as OperationPhase,
      mitreId: '',
      owaspId: '',
      results: '',
      tools: [],
    });
    setOpenTaskDialog(true);
  };
  const handleCloseTaskDialog = () => setOpenTaskDialog(false);

  const getAutoMitreId = (phase: string) => {
    // Simple mapping for demo; expand as needed
    const mapping: Record<string, string> = {
      reconnaissance: 'T1595',
      initial_access: 'T1078',
      execution: 'T1059',
      persistence: 'T1547',
      privilege_escalation: 'T1068',
      defense_evasion: 'T1562',
      credential_access: 'T1003',
      discovery: 'T1087',
      lateral_movement: 'T1021',
      collection: 'T1119',
      command_and_control: 'T1105',
      exfiltration: 'T1041',
      impact: 'T1486',
    };
    return mapping[phase] || '';
  };
  const getAutoOwaspId = (phase: string) => {
    // Simple mapping for demo; expand as needed
    const mapping: Record<string, string> = {
      reconnaissance: 'A01:2021',
      initial_access: 'A02:2021',
      execution: 'A03:2021',
      persistence: 'A04:2021',
      privilege_escalation: 'A05:2021',
      defense_evasion: 'A06:2021',
      credential_access: 'A07:2021',
      discovery: 'A08:2021',
      lateral_movement: 'A09:2021',
      collection: 'A10:2021',
      command_and_control: 'A01:2021',
      exfiltration: 'A02:2021',
      impact: 'A03:2021',
    };
    return mapping[phase] || '';
  };

  const handleTaskSubmit = async () => {
    try {
      // Validate required fields
      if (!taskForm.title || !taskForm.description) {
        alert('Please fill in all required fields');
        return;
      }

      if (!id) {
        alert('Operation ID is missing');
        return;
      }

      const now = new Date().toISOString();
      let newTask = {
        ...taskForm,
        operation_id: id,
        status: 'pending' as TaskStatus,
        start_date: now,
        end_date: now, // Set a default end date to avoid empty string
        tools: [],
        results: '',
        mitreId: '', // Use camelCase for TypeScript
        owaspId: '', // Use camelCase for TypeScript
      };

      if (operation.type === 'red_team') {
        newTask.mitreId = getAutoMitreId(newTask.phase || '');
        newTask.owaspId = '';
      } else if (operation.type === 'pen_test') {
        newTask.owaspId = getAutoOwaspId(newTask.phase || '');
        newTask.mitreId = '';
      }

      console.log('Creating task with data:', newTask);

      // Create the task
      const result = await dispatch(createTask(newTask as Omit<Task, 'id' | 'createdAt' | 'updatedAt'>)).unwrap();
      console.log('Task created:', result);
      
      // Refresh tasks for this operation
      await dispatch(fetchTasksByOperation(id));
      
      setOpenTaskDialog(false);
    } catch (err) {
      console.error('Failed to create task:', err);
      alert(err instanceof Error ? err.message : 'Failed to create task');
    }
  };

  const handleTaskClick = (taskId: string) => {
    navigate(`/operations/${id}/tasks/${taskId}`);
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        p: 4, 
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2
      }}>
        <Typography color="error" variant="h6">{error}</Typography>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          startIcon={<RefreshIcon />}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (!operation) return null;

  const currentPhaseIndex = operationPhases.indexOf(operation.current_phase);
  const currentUsername = window.localStorage.getItem('username');
  const currentUserId = window.localStorage.getItem('userId');
  const isTeamLead = (operation.team_lead && (
    operation.team_lead.username === currentUsername ||
    operation.team_lead === currentUsername ||
    operation.team_lead._id === currentUserId ||
    operation.team_lead.id === currentUserId
  )) || (window.localStorage.getItem('role') === 'admin') || (!operation.team_lead && true);

  const taskStatusColors = {
    pending: theme.palette.warning.main,
    in_progress: theme.palette.info.main,
    completed: theme.palette.success.main,
    blocked: theme.palette.error.main,
  };

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
              <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 48, height: 48, fontSize: 22 }}>{operation.name?.charAt(0).toUpperCase()}</Avatar>
            </Grid>
            <Grid item xs={12} md={7} sx={{ width: '100%', minWidth: 0 }}>
              <Typography variant="h5" fontWeight={700} color="text.primary" gutterBottom sx={{ fontSize: { xs: 20, md: 26 } }}>{operation.name}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Chip label={operation.type.replace(/_/g, ' ').toUpperCase()} color="primary" variant="outlined" sx={{ fontWeight: 600 }} />
                <Chip label={operation.current_phase?.replace(/_/g, ' ').toUpperCase() || '-'} color="info" sx={{ fontWeight: 600 }} />
                <Typography variant="body2" color="text.secondary">Created: {new Date(operation.created_at).toLocaleString()}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, width: '100%', minWidth: 0 }}>
              {isTeamLead && (
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenTaskDialog} sx={{ borderRadius: 2, px: 2, py: 0.5, fontSize: 14, boxShadow: 1, '&:hover': { boxShadow: 3 } }}>New Task</Button>
              )}
            </Grid>
          </Grid>
        </Paper>
        <Divider sx={{ mb: 2, opacity: 0.10 }} />
        <Typography variant="h6" fontWeight={700} sx={{ mb: 1, letterSpacing: 1, color: 'text.primary', fontSize: { xs: 16, md: 20 } }}>Operation Overview</Typography>
        <Grid container spacing={2} justifyContent="center" sx={{ mb: 2, width: '100%' }}>
          <Grid item xs={12} sm={4} md={4} sx={{ width: '100%', minWidth: 0 }}>
            <Card sx={{ p: { xs: 1, md: 2 }, borderRadius: 2, background: alpha(theme.palette.background.paper, 0.98), boxShadow: 4, minHeight: 120, width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Assignment color="primary" fontSize="small" />
                <Typography variant="subtitle1" fontWeight={600} color="text.primary">Task Overview</Typography>
              </Box>
              <Grid container>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Total Tasks</Typography>
                  <Typography variant="h5" color="primary.main" fontWeight={700}>{tasksLoading ? <CircularProgress size={18} /> : Array.isArray(operationTasks) ? operationTasks.length : 0}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Completed</Typography>
                  <Typography variant="h5" color="success.main" fontWeight={700}>{tasksLoading ? <CircularProgress size={18} /> : Array.isArray(operationTasks) && operationTasks.length > 0 ? `${Math.round((operationTasks.filter(t => t.status === 'completed').length / operationTasks.length) * 100)}%` : '0%'}</Typography>
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4} md={4} sx={{ width: '100%', minWidth: 0 }}>
            <Card sx={{ p: { xs: 1, md: 2 }, borderRadius: 2, background: alpha(theme.palette.background.paper, 0.98), boxShadow: 4, minHeight: 120, width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Group color="info" fontSize="small" />
                <Typography variant="subtitle1" fontWeight={600} color="text.primary">Team Status</Typography>
              </Box>
              <Typography variant="h5" color="info.main" fontWeight={700}>{operation.members?.length || 0}</Typography>
              <Typography variant="caption" color="text.secondary">Active Members</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4} md={4} sx={{ width: '100%', minWidth: 0 }}>
            <Card sx={{ p: { xs: 1, md: 2 }, borderRadius: 2, background: alpha(theme.palette.background.paper, 0.98), boxShadow: 4, minHeight: 120, width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Timeline color="success" fontSize="small" />
                <Typography variant="subtitle1" fontWeight={600} color="text.primary">Phase Progress</Typography>
              </Box>
              <Typography variant="h5" color="success.main" fontWeight={700}>{currentPhaseIndex + 1}/{operationPhases.length}</Typography>
              <Typography variant="caption" color="text.secondary">Current Phase</Typography>
            </Card>
          </Grid>
        </Grid>
        <Divider sx={{ mb: 2, opacity: 0.10 }} />
        <Typography variant="h6" fontWeight={700} sx={{ mb: 1, letterSpacing: 1, color: 'text.primary', fontSize: { xs: 16, md: 20 } }}>Task Analytics</Typography>
        <Grid container spacing={2} justifyContent="center" sx={{ mb: 2, width: '100%' }}>
          <Grid item xs={12} md={6} sx={{ width: '100%', minWidth: 0 }}>
            <Card sx={{ p: { xs: 1, md: 2 }, borderRadius: 2, background: alpha(theme.palette.background.paper, 0.98), boxShadow: 4, minHeight: 180, width: '100%' }}>
              <Typography variant="subtitle1" fontWeight={600} color="text.primary" gutterBottom>Task Status Distribution</Typography>
              {operationTasks && operationTasks.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={(() => {
                        const statusCounts: Record<string, number> = {};
                        (operationTasks || []).forEach((task: any) => {
                          statusCounts[task.status] = (statusCounts[task.status] || 0) + 1;
                        });
                        return Object.entries(statusCounts).map(([status, value]) => ({ 
                          name: status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '), 
                          value 
                        }));
                      })()}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {Object.entries(taskStatusColors).map(([status, color]) => (
                        <Cell key={status} fill={color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ 
                  height: 300, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <Typography color="text.secondary">No tasks available</Typography>
                </Box>
              )}
            </Card>
          </Grid>
          <Grid item xs={12} md={6} sx={{ width: '100%', minWidth: 0 }}>
            <Card sx={{ p: { xs: 1, md: 2 }, borderRadius: 2, background: alpha(theme.palette.background.paper, 0.98), boxShadow: 4, minHeight: 180, width: '100%' }}>
              <Typography variant="subtitle1" fontWeight={600} color="text.primary" gutterBottom>Tasks by Phase</Typography>
              {operationTasks && operationTasks.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={(() => {
                      const phaseCounts: Record<string, number> = {};
                      (operationTasks || []).forEach((task: any) => {
                        phaseCounts[task.phase] = (phaseCounts[task.phase] || 0) + 1;
                      });
                      return Object.entries(phaseCounts).map(([phase, value]) => ({ 
                        phase: phase.charAt(0).toUpperCase() + phase.slice(1).replace('_', ' '), 
                        value 
                      }));
                    })()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <XAxis 
                      dataKey="phase" 
                      angle={-45} 
                      textAnchor="end" 
                      height={100}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis allowDecimals={false} />
                    <RechartsTooltip />
                    <Bar 
                      dataKey="value" 
                      fill={theme.palette.primary.main}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ 
                  height: 300, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <Typography color="text.secondary">No tasks available</Typography>
                </Box>
              )}
            </Card>
          </Grid>
        </Grid>
        <Divider sx={{ mb: 2, opacity: 0.12 }} />
        <Typography variant="h5" fontWeight={700} sx={{ mb: 1, letterSpacing: 1, color: 'primary.main' }}>
          Recent Tasks
        </Typography>
        {/* Recent Tasks Section */}
        <Card sx={{ 
          p: { xs: 2, sm: 3 },
          borderRadius: 4,
          background: 'rgba(30,30,30,0.7)',
          boxShadow: 6,
          backdropFilter: 'blur(8px)',
          width: '100%',
          minHeight: 180,
          mb: { xs: 2, md: 3 },
          transition: 'box-shadow 0.3s, transform 0.2s',
          '&:hover': { boxShadow: 12, transform: 'translateY(-4px) scale(1.01)' },
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 2 
          }}>
            <Typography variant="h6" fontWeight={600}>Recent Tasks</Typography>
            <Button 
              variant="outlined" 
              size="small"
              endIcon={<ArrowForwardIcon />}
              onClick={() => {/* Navigate to tasks page */}}
            >
              View All
            </Button>
          </Box>
          <List sx={{ 
            maxHeight: 400, 
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: alpha(theme.palette.primary.main, 0.1),
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: alpha(theme.palette.primary.main, 0.2),
              borderRadius: '4px',
              '&:hover': {
                background: alpha(theme.palette.primary.main, 0.3),
              },
            },
          }}>
            {tasksLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress size={24} />
              </Box>
            ) : Array.isArray(operationTasks) && operationTasks.length > 0 ? (
              operationTasks.slice(-5).reverse().map((task: any) => (
                <ListItem
                  key={task.id}
                  button
                  onClick={() => handleTaskClick(task.id)}
                  sx={{
                    mb: 1,
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography component="span" sx={{ fontWeight: 500 }}>{task.title}</Typography>
                        <Chip 
                          label={task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('_', ' ')} 
                          size="small" 
                          color={task.status === 'completed' ? 'success' : task.status === 'in_progress' ? 'primary' : task.status === 'blocked' ? 'error' : 'default'} 
                          sx={{ fontWeight: 600 }}
                        />
                        <Chip 
                          label={task.phase?.replace(/_/g, ' ').charAt(0).toUpperCase() + task.phase?.slice(1)} 
                          size="small" 
                          color="info" 
                          variant="outlined"
                          sx={{ fontWeight: 600 }}
                        />
                      </Typography>
                    }
                    secondary={
                      <Typography component="div" sx={{ mt: 1 }}>
                        <Typography component="span" sx={{ color: 'text.secondary', display: 'block' }}>
                          {task.description}
                        </Typography>
                        {task.assignedTo && (
                          <Typography component="span" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                            Assigned to: {typeof task.assignedTo === 'string' ? task.assignedTo : task.assignedTo.username}
                          </Typography>
                        )}
                      </Typography>
                    }
                  />
                  <Tooltip title="View Details">
                    <IconButton size="small">
                      <ArrowForwardIcon />
                    </IconButton>
                  </Tooltip>
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText 
                  primary={
                    <Typography color="text.secondary" align="center">
                      No tasks available
                    </Typography>
                  } 
                />
              </ListItem>
            )}
          </List>
        </Card>
        {/* Task Creation Dialog */}
        <Dialog 
          open={openTaskDialog} 
          onClose={handleCloseTaskDialog}
          maxWidth="md"
          fullWidth
          aria-labelledby="task-dialog-title"
          aria-describedby="task-dialog-description"
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: theme.shadows[4],
            }
          }}
          disableEnforceFocus
          disableAutoFocus
          keepMounted
        >
          <DialogTitle 
            id="task-dialog-title"
            sx={{ 
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              pb: 2
            }}
          >
            Create New Task
          </DialogTitle>
          <DialogContent id="task-dialog-description" sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Task Title"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  multiline
                  rows={4}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Phase"
                  value={taskForm.phase}
                  onChange={(e) => setTaskForm({ ...taskForm, phase: e.target.value as OperationPhase })}
                  variant="outlined"
                  required
                >
                  {operationPhases.map((phase) => (
                    <MenuItem key={phase} value={phase}>
                      {phase.replace(/_/g, ' ').charAt(0).toUpperCase() + phase.slice(1)}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={allUsers || []}
                  getOptionLabel={(option) => option.username}
                  value={taskForm.assignedTo ? allUsers.find(user => user.id === taskForm.assignedTo?.id) || undefined : undefined}
                  onChange={(_, value) => setTaskForm({ ...taskForm, assignedTo: value || undefined })}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Assign To"
                      variant="outlined"
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
                  isOptionEqualToValue={(option, value) => option.id === value?.id}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ 
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            px: 3,
            py: 2
          }}>
            <Button onClick={handleCloseTaskDialog} variant="outlined">
              Cancel
            </Button>
            <Button 
              onClick={handleTaskSubmit} 
              variant="contained"
              disabled={!taskForm.title || !taskForm.description || !taskForm.phase}
            >
              Create Task
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default OperationDashboard; 