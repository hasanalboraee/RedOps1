import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    Paper,
    Alert,
    useTheme,
    alpha,
    ThemeProvider,
    createTheme,
} from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import authService from '../services/authService';
import type { LoginCredentials } from '../types/models';

// Define the same dark theme as in Layout.tsx
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#f44336',
        },
        secondary: {
            main: '#ff9800',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
    },
});

const Login: React.FC = () => {
    // Use the dark theme for all MUI hooks
    const theme = darkTheme;
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState<LoginCredentials>({
        email: '',
        password: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // Basic validation
        if (!credentials.email || !credentials.password) {
            setError('Please enter both email and password');
            setLoading(false);
            return;
        }

        try {
            const user = await authService.login(credentials);
            navigate('/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <Box
                sx={{
                    width: '100%',
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `radial-gradient(ellipse at 60% 0%, ${alpha(
                        theme.palette.primary.main,
                        0.08
                    )} 0%, transparent 70%), linear-gradient(135deg, ${alpha(
                        theme.palette.background.paper,
                        0.98
                    )}, ${alpha(theme.palette.background.default, 0.92)})`,
                    py: { xs: 2, md: 4 },
                }}
            >
                <Container component="main" maxWidth="xs">
                    <Paper
                        elevation={8}
                        sx={{
                            p: { xs: 2, sm: 3, md: 4 },
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '100%',
                            background: 'rgba(30,30,30,0.7)',
                            borderRadius: { xs: 0, md: 5 },
                            boxShadow: 12,
                            backdropFilter: 'blur(12px)',
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.06)}`,
                            transition: 'box-shadow 0.3s, transform 0.2s',
                            '&:hover': { boxShadow: 16, transform: 'translateY(-4px) scale(1.01)' },
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: '100%',
                            }}
                        >
                            <Box
                                sx={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: '50%',
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mb: 2,
                                    transition: 'transform 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.1)',
                                    },
                                }}
                            >
                                <LockIcon color="primary" sx={{ fontSize: 28 }} />
                            </Box>
                            <Typography
                                component="h1"
                                variant="h4"
                                sx={{
                                    mb: 3,
                                    fontWeight: 700,
                                    color: 'primary.main',
                                    textAlign: 'center',
                                    letterSpacing: 1,
                                    fontSize: { xs: 22, sm: 28, md: 34 },
                                }}
                            >
                                RedOps Login
                            </Typography>
                            {error && (
                                <Alert
                                    severity="error"
                                    sx={{
                                        width: '100%',
                                        mb: 2,
                                        borderRadius: 1,
                                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                                        color: theme.palette.error.main,
                                        '& .MuiAlert-icon': {
                                            color: theme.palette.error.main,
                                        },
                                    }}
                                >
                                    {error}
                                </Alert>
                            )}
                            <Box
                                component="form"
                                onSubmit={handleSubmit}
                                sx={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                }}
                            >
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    value={credentials.email}
                                    onChange={(e) =>
                                        setCredentials({ ...credentials, email: e.target.value })
                                    }
                                    disabled={loading}
                                    error={!!error}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                            backgroundColor: alpha(theme.palette.background.paper, 0.7),
                                            '&:hover': {
                                                backgroundColor: alpha(theme.palette.background.paper, 0.9),
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: theme.palette.text.secondary,
                                        },
                                    }}
                                />
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    value={credentials.password}
                                    onChange={(e) =>
                                        setCredentials({ ...credentials, password: e.target.value })
                                    }
                                    disabled={loading}
                                    error={!!error}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                            backgroundColor: alpha(theme.palette.background.paper, 0.7),
                                            '&:hover': {
                                                backgroundColor: alpha(theme.palette.background.paper, 0.9),
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: theme.palette.text.secondary,
                                        },
                                    }}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={loading}
                                    sx={{
                                        mt: 2,
                                        py: 1.5,
                                        borderRadius: 1,
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        backgroundColor: theme.palette.primary.main,
                                        '&:hover': {
                                            backgroundColor: theme.palette.primary.dark,
                                            transform: 'translateY(-2px)',
                                        },
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    {loading ? 'Signing in...' : 'Sign In'}
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default Login; 