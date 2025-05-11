import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { useAppSelector } from './store/hooks';
import { store } from './store';
import theme from './theme';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Operations from './pages/Operations';
import OperationDashboard from './pages/OperationDashboard';
import Tasks from './pages/Tasks';
import TaskDashboard from './pages/TaskDashboard';
import Team from './pages/Team';
import Tools from './pages/Tools';
import Reports from './pages/Reports';
import authService from './services/authService';
import { SidebarProvider } from './components/layout/SidebarContext';

// Private route component
const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const user = useAppSelector((state) => state.auth.user);
  console.log('PrivateRoute - currentUser:', user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

const AppRoutes: React.FC = () => {
  useEffect(() => {
    // Initialize auth state
    authService.initialize();
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute
            element={
              <SidebarProvider>
                <Layout>
                  <Dashboard />
                </Layout>
              </SidebarProvider>
            }
          />
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute
            element={
              <SidebarProvider>
                <Layout>
                  <Dashboard />
                </Layout>
              </SidebarProvider>
            }
          />
        }
      />
      <Route
        path="/operations"
        element={
          <PrivateRoute
            element={
              <SidebarProvider>
                <Layout>
                  <Operations />
                </Layout>
              </SidebarProvider>
            }
          />
        }
      />
      <Route
        path="/operations/:id"
        element={
          <PrivateRoute
            element={
              <SidebarProvider>
                <Layout>
                  <OperationDashboard />
                </Layout>
              </SidebarProvider>
            }
          />
        }
      />
      <Route
        path="/operations/:id/tasks/:taskId"
        element={
          <PrivateRoute
            element={
              <SidebarProvider>
                <Layout>
                  <TaskDashboard />
                </Layout>
              </SidebarProvider>
            }
          />
        }
      />
      <Route
        path="/tasks"
        element={
          <PrivateRoute
            element={
              <SidebarProvider>
                <Layout>
                  <Tasks />
                </Layout>
              </SidebarProvider>
            }
          />
        }
      />
      <Route
        path="/tasks/:id"
        element={
          <PrivateRoute
            element={
              <SidebarProvider>
                <Layout>
                  <TaskDashboard />
                </Layout>
              </SidebarProvider>
            }
          />
        }
      />
      <Route
        path="/team"
        element={
          <PrivateRoute
            element={
              <SidebarProvider>
                <Layout>
                  <Team />
                </Layout>
              </SidebarProvider>
            }
          />
        }
      />
      <Route
        path="/tools"
        element={
          <PrivateRoute
            element={
              <SidebarProvider>
                <Layout>
                  <Tools />
                </Layout>
              </SidebarProvider>
            }
          />
        }
      />
      <Route
        path="/reports"
        element={
          <PrivateRoute
            element={
              <SidebarProvider>
                <Layout>
                  <Reports />
                </Layout>
              </SidebarProvider>
            }
          />
        }
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppRoutes />
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
