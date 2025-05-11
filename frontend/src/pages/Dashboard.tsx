import React from 'react';
import Container from '@mui/material/Container';
import {
  Paper,
  Typography,
  Box,
  Card,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Assessment, AssignmentTurnedIn, Timeline } from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const theme = useTheme();

  // Mock data for initial development
  const mockOperationStats = {
    total: 10,
    active: 4,
    completed: 3,
    pending: 3,
  };

  const mockTaskStats = {
    total: 25,
    completed: 12,
    inProgress: 8,
    pending: 3,
    blocked: 2,
  };

  const mockPhaseData = [
    { phase: 'Planning', count: 3 },
    { phase: 'Execution', count: 4 },
    { phase: 'Review', count: 2 },
    { phase: 'Completed', count: 1 },
  ];

  return (
    <Container maxWidth={false} disableGutters sx={{ width: '100%', px: 0 }}>
      <Box
        sx={{
          width: '100%',
          minHeight: '100vh',
          background: `radial-gradient(ellipse at 60% 0%, ${alpha(
            theme.palette.primary.main,
            0.08
          )} 0%, transparent 70%), linear-gradient(135deg, ${alpha(
            theme.palette.background.paper,
            0.98
          )}, ${alpha(theme.palette.background.default, 0.92)})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: { xs: 2, md: 4 },
          px: 0,
          maxWidth: '100vw',
        }}
      >
        <Paper
          elevation={8}
          sx={{
            width: '100%',
            minHeight: { xs: 400, md: 700 },
            borderRadius: { xs: 0, md: 5 },
            boxShadow: 12,
            background: 'rgba(30,30,30,0.7)',
            backdropFilter: 'blur(12px)',
            px: { xs: 1, sm: 2, md: 8, lg: 12 },
            py: { xs: 1, md: 4 },
            transition: 'box-shadow 0.3s, background 0.3s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: '100vw',
            overflowX: 'auto',
          }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ mb: 3, letterSpacing: 1, color: 'primary.main', textAlign: 'center', fontSize: { xs: 22, sm: 28, md: 34 } }}
          >
            Dashboard Overview
          </Typography>
          <Divider sx={{ mb: 2, opacity: 0.12 }} />

          {/* Stats Row */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'center',
              alignItems: 'stretch',
              gap: 3,
              width: '100%',
              mb: 3,
            }}
          >
            <Card
              sx={{
                flex: 1,
                minWidth: 0,
                borderRadius: { xs: 2, md: 4 },
                background: 'rgba(30,30,30,0.7)',
                boxShadow: 6,
                backdropFilter: 'blur(8px)',
                minHeight: { xs: 120, md: 180 },
                width: '100%',
                transition: 'box-shadow 0.3s, transform 0.2s',
                '&:hover': { boxShadow: 12, transform: 'translateY(-4px) scale(1.03)' },
                maxWidth: '100vw',
                overflowX: 'auto',
              }}
              tabIndex={0}
              aria-label="Operation Statistics"
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Assessment color="primary" />
                <Typography variant="h6" fontWeight={600} color="text.primary">
                  Operation Statistics
                </Typography>
              </Box>
              <Divider sx={{ mb: 2, opacity: 0.15 }} />
              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box>
                  <Typography variant="h4" color="primary.main" fontWeight={700}>
                    {mockOperationStats.total}
                  </Typography>
                  <Typography color="text.secondary">Total Operations</Typography>
                </Box>
                <Box>
                  <Typography variant="h4" color="info.main" fontWeight={700}>
                    {mockOperationStats.active}
                  </Typography>
                  <Typography color="text.secondary">Active Operations</Typography>
                </Box>
              </Box>
            </Card>

            <Card
              sx={{
                flex: 1,
                minWidth: 0,
                borderRadius: { xs: 2, md: 4 },
                background: 'rgba(30,30,30,0.7)',
                boxShadow: 6,
                backdropFilter: 'blur(8px)',
                minHeight: { xs: 120, md: 180 },
                width: '100%',
                transition: 'box-shadow 0.3s, transform 0.2s',
                '&:hover': { boxShadow: 12, transform: 'translateY(-4px) scale(1.03)' },
                maxWidth: '100vw',
                overflowX: 'auto',
              }}
              tabIndex={0}
              aria-label="Task Statistics"
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <AssignmentTurnedIn color="success" />
                <Typography variant="h6" fontWeight={600} color="text.primary">
                  Task Statistics
                </Typography>
              </Box>
              <Divider sx={{ mb: 2, opacity: 0.15 }} />
              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box>
                  <Typography variant="h4" color="primary.main" fontWeight={700}>
                    {mockTaskStats.total}
                  </Typography>
                  <Typography color="text.secondary">Total Tasks</Typography>
                </Box>
                <Box>
                  <Typography variant="h4" color="success.main" fontWeight={700}>
                    {mockTaskStats.completed}
                  </Typography>
                  <Typography color="text.secondary">Completed Tasks</Typography>
                </Box>
              </Box>
            </Card>
          </Box>

          <Divider sx={{ mb: 2, opacity: 0.12 }} />
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{ mb: 1, letterSpacing: 1, color: 'primary.main', textAlign: 'center', fontSize: { xs: 18, sm: 22, md: 26 } }}
          >
            Operations by Phase
          </Typography>

          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Card
              sx={{
                p: { xs: 1, sm: 2, md: 3 },
                borderRadius: { xs: 2, md: 4 },
                background: 'rgba(30,30,30,0.7)',
                boxShadow: 6,
                backdropFilter: 'blur(8px)',
                width: '100%',
                maxWidth: '100vw',
                overflowX: 'auto',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Timeline color="info" />
                <Typography variant="h6" fontWeight={600}>
                  Operations by Phase
                </Typography>
              </Box>
              <Divider sx={{ mb: 2, opacity: 0.15 }} />
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockPhaseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="phase" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="count"
                      fill={theme.palette.primary.main}
                      name="Number of Operations"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Card>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard;
