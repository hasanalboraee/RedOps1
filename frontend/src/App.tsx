import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard.tsx';
import Operations from './pages/Operations.tsx';
import Tasks from './pages/Tasks.tsx';
import Tools from './pages/Tools.tsx';
import Team from './pages/Team.tsx';
import Reports from './pages/Reports.tsx';
import Login from './pages/Login.tsx';
import { useAppSelector } from './store/hooks';
import { CircularProgress, Box } from '@mui/material';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const currentUser = useAppSelector((state) => state.users.currentUser);
    console.log('PrivateRoute - currentUser:', currentUser);
    return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

const LoadingFallback = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
    </Box>
);

const AppRoutes: React.FC = () => {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <Dashboard />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/operations"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <Operations />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/tasks"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <Tasks />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/tools"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <Tools />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/team"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <Team />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/reports"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <Reports />
                            </Layout>
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Suspense>
    );
};

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <Router>
                <AppRoutes />
            </Router>
        </Provider>
    );
};

export default App;
