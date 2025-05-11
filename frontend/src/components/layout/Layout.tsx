import React from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const theme = createTheme({
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

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = React.useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                <Navbar sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />
                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        mt: 8,
                        backgroundColor: 'background.default',
                        minHeight: '100vh',
                    }}
                >
                    {children}
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default Layout; 