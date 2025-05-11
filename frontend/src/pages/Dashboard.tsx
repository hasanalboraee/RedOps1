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
    <Container maxWidth={false} disableGutters sx={{ width: '100%', px: 0, fontFamily: 'Graphik Arabic, Roboto, Helvetica, Arial, sans-serif' }}>
      <Box
        sx={{
          width: '100%',
          minHeight: '100vh',
          background: `
            linear-gradient(120deg, ${alpha(theme.palette.background.default, 0.98)} 60%, ${alpha(theme.palette.primary.main, 0.08)} 100%),
            radial-gradient(ellipse at 60% 0%, ${alpha(theme.palette.primary.main, 0.18)} 0%, transparent 70%)
          `,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: { xs: 3, md: 6 },
          px: 0,
          maxWidth: '100vw',
        }}
      >
        {/* Header Card */}
        <Paper
          elevation={12}
          sx={{
            width: '100%',
            maxWidth: 1400,
            borderRadius: { xs: 0, md: 5 },
            boxShadow: '0 8px 48px 0 rgba(0,0,0,0.22)',
            background: 'rgba(30,30,30,0.88)',
            backdropFilter: 'blur(16px)',
            px: { xs: 2, sm: 4, md: 8 },
            py: { xs: 2, md: 5 },
            mb: 5,
            transition: 'box-shadow 0.3s, background 0.3s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflowX: 'auto',
          }}
        >
          <Typography
            variant="h3"
            fontWeight={900}
            sx={{ mb: 1, letterSpacing: 2, color: 'primary.main', textAlign: 'center', fontSize: { xs: 26, sm: 34, md: 44 } }}
          >
            Dashboard
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: 'text.secondary', fontWeight: 500, mb: 2, textAlign: 'center', fontSize: { xs: 16, md: 20 } }}
          >
            Welcome to your security operations overview. Track, analyze, and manage your team's performance in real time.
          </Typography>
          <Box sx={{ height: 4, width: 64, background: 'primary.main', borderRadius: 2, mb: 2 }} />

          {/* Stats Row */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'center',
              alignItems: 'stretch',
              gap: 4,
              width: '100%',
              mb: 4,
            }}
          >
            {/* Operation Stats Card */}
            <Card
              sx={{
                flex: 1,
                minWidth: 0,
                borderRadius: { xs: 2, md: 4 },
                background: 'rgba(30,30,30,0.92)',
                boxShadow: '0 4px 32px 0 rgba(0,0,0,0.18)',
                backdropFilter: 'blur(10px)',
                minHeight: { xs: 120, md: 180 },
                width: '100%',
                transition: 'box-shadow 0.3s, transform 0.2s',
                '&:hover': { boxShadow: 16, transform: 'translateY(-4px) scale(1.03)' },
                maxWidth: '100vw',
                overflowX: 'auto',
                p: { xs: 2, md: 4 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
              tabIndex={0}
              aria-label="Operation Statistics"
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Box sx={{
                  background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.18)}, transparent 80%)`,
                  borderRadius: 2,
                  p: 1,
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: `0 2px 12px 0 ${alpha(theme.palette.primary.main, 0.18)}`,
                }}>
                  <Assessment color="primary" sx={{ fontSize: 32 }} />
                </Box>
                <Typography variant="h6" fontWeight={700} color="text.primary">
                  Operation Statistics
                </Typography>
              </Box>
              <Divider sx={{ mb: 2, opacity: 0.15 }} />
              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box>
                  <Typography variant="h3" color="primary.main" fontWeight={900} sx={{ fontSize: { xs: 28, md: 36 } }}>
                    {mockOperationStats.total}
                  </Typography>
                  <Typography color="text.secondary" fontWeight={500}>Total Operations</Typography>
                </Box>
                <Box>
                  <Typography variant="h3" color="info.main" fontWeight={900} sx={{ fontSize: { xs: 28, md: 36 } }}>
                    {mockOperationStats.active}
                  </Typography>
                  <Typography color="text.secondary" fontWeight={500}>Active Operations</Typography>
                </Box>
              </Box>
            </Card>

            {/* Task Stats Card */}
            <Card
              sx={{
                flex: 1,
                minWidth: 0,
                borderRadius: { xs: 2, md: 4 },
                background: 'rgba(30,30,30,0.92)',
                boxShadow: '0 4px 32px 0 rgba(0,0,0,0.18)',
                backdropFilter: 'blur(10px)',
                minHeight: { xs: 120, md: 180 },
                width: '100%',
                transition: 'box-shadow 0.3s, transform 0.2s',
                '&:hover': { boxShadow: 16, transform: 'translateY(-4px) scale(1.03)' },
                maxWidth: '100vw',
                overflowX: 'auto',
                p: { xs: 2, md: 4 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
              tabIndex={0}
              aria-label="Task Statistics"
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Box sx={{
                  background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.18)}, transparent 80%)`,
                  borderRadius: 2,
                  p: 1,
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: `0 2px 12px 0 ${alpha(theme.palette.success.main, 0.18)}`,
                }}>
                  <AssignmentTurnedIn color="success" sx={{ fontSize: 32 }} />
                </Box>
                <Typography variant="h6" fontWeight={700} color="text.primary">
                  Task Statistics
                </Typography>
              </Box>
              <Divider sx={{ mb: 2, opacity: 0.15 }} />
              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box>
                  <Typography variant="h3" color="primary.main" fontWeight={900} sx={{ fontSize: { xs: 28, md: 36 } }}>
                    {mockTaskStats.total}
                  </Typography>
                  <Typography color="text.secondary" fontWeight={500}>Total Tasks</Typography>
                </Box>
                <Box>
                  <Typography variant="h3" color="success.main" fontWeight={900} sx={{ fontSize: { xs: 28, md: 36 } }}>
                    {mockTaskStats.completed}
                  </Typography>
                  <Typography color="text.secondary" fontWeight={500}>Completed Tasks</Typography>
                </Box>
              </Box>
            </Card>
          </Box>

          <Divider sx={{ mb: 3, opacity: 0.12 }} />
          <Typography
            variant="h5"
            fontWeight={900}
            sx={{ mb: 1, letterSpacing: 1, color: 'primary.main', textAlign: 'center', fontSize: { xs: 20, sm: 26, md: 32 } }}
          >
            Operations by Phase
          </Typography>
          <Box sx={{ height: 4, width: 48, background: 'primary.main', borderRadius: 2, mb: 3, mx: 'auto' }} />

          {/* Chart Section */}
          <Card
            sx={{
              width: '100%',
              maxWidth: 900,
              mx: 'auto',
              p: { xs: 2, md: 4 },
              borderRadius: 4,
              background: 'rgba(30,30,30,0.92)',
              boxShadow: '0 4px 32px 0 rgba(0,0,0,0.18)',
              backdropFilter: 'blur(10px)',
              mb: 2,
              transition: 'box-shadow 0.3s, background 0.3s',
            }}
          >
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
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard;
