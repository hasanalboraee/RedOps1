import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Container,
    Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCurrentUser } from '../store/slices/userSlice';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector((state) => state.users.currentUser);

    useEffect(() => {
        // If user is already logged in, redirect to dashboard
        if (currentUser) {
            navigate('/');
        }
    }, [currentUser, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Simple validation
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        try {
            // For development, accept any non-empty credentials
            const mockUser = {
                id: '1',
                username: 'admin',
                email: email,
                role: 'admin' as const,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            dispatch(setCurrentUser(mockUser));
            navigate('/');
        } catch (err) {
            setError('Failed to log in. Please try again.');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        padding: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: 'background.paper',
                        width: '100%',
                    }}
                >
                    <Typography
                        component="h1"
                        variant="h5"
                        sx={{ mb: 3, color: 'primary.main' }}
                    >
                        RedOps Framework
                    </Typography>
                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ width: '100%' }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ mb: 3 }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login; 