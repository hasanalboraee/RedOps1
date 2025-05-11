import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    TextField,
    InputAdornment,
    IconButton,
    Popper,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    Divider,
    ClickAwayListener,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
} from '@mui/material';
import {
    Search as SearchIcon,
    Close as CloseIcon,
    Assignment as AssignmentIcon,
    Build as BuildIcon,
    People as PeopleIcon,
    Security as SecurityIcon,
    Settings as SettingsIcon,
    Help as HelpIcon,
    FilterList as FilterListIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

interface SearchResult {
    id: string;
    type: 'operation' | 'task' | 'tool' | 'user' | 'settings' | 'help';
    title: string;
    description: string;
    path: string;
    tags?: string[];
}

interface SearchFilters {
    types: string[];
    dateRange: 'all' | 'today' | 'week' | 'month';
    status?: string;
}

const Search: React.FC = () => {
    const navigate = useNavigate();
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<SearchFilters>({
        types: [],
        dateRange: 'all',
    });

    // Keyboard shortcuts
    useKeyboardShortcuts([
        {
            key: '/',
            handler: (e) => {
                e.preventDefault();
                searchInputRef.current?.focus();
            },
        },
        {
            key: 'Escape',
            handler: () => {
                handleClose();
            },
        },
    ]);

    // Mock search results - replace with actual API calls
    const mockSearch = (query: string, filters: SearchFilters): SearchResult[] => {
        if (!query) return [];
        
        const allResults: SearchResult[] = [
            {
                id: '1',
                type: 'operation',
                title: 'Web App Assessment',
                description: 'Security assessment of the main web application',
                path: '/operations/1',
                tags: ['web', 'security', 'assessment'],
            },
            {
                id: '2',
                type: 'task',
                title: 'Vulnerability Scan',
                description: 'Run automated vulnerability scan on target systems',
                path: '/tasks/2',
                tags: ['scan', 'vulnerability', 'automated'],
            },
            {
                id: '3',
                type: 'tool',
                title: 'Nmap',
                description: 'Network mapping and port scanning tool',
                path: '/tools/3',
                tags: ['network', 'scanning', 'ports'],
            },
            {
                id: '4',
                type: 'user',
                title: 'John Doe',
                description: 'Security Analyst',
                path: '/team/4',
                tags: ['analyst', 'security'],
            },
            {
                id: '5',
                type: 'settings',
                title: 'System Settings',
                description: 'Configure system-wide settings',
                path: '/settings',
                tags: ['configuration', 'system'],
            },
            {
                id: '6',
                type: 'help',
                title: 'Getting Started Guide',
                description: 'Learn how to use RedOps',
                path: '/help',
                tags: ['guide', 'documentation'],
            },
        ];

        const queryLower = query.toLowerCase();
        return allResults.filter(result => {
            const matchesQuery = 
                result.title.toLowerCase().includes(queryLower) ||
                result.description.toLowerCase().includes(queryLower) ||
                result.tags?.some(tag => tag.toLowerCase().includes(queryLower));

            const matchesType = filters.types.length === 0 || filters.types.includes(result.type);

            return matchesQuery && matchesType;
        });
    };

    useEffect(() => {
        if (searchQuery) {
            setLoading(true);
            // Simulate API delay
            setTimeout(() => {
                setResults(mockSearch(searchQuery, filters));
                setLoading(false);
            }, 300);
        } else {
            setResults([]);
        }
    }, [searchQuery, filters]);

    const handleSearchClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSearchQuery('');
        setShowFilters(false);
    };

    const handleResultClick = (result: SearchResult) => {
        navigate(result.path);
        handleClose();
    };

    const handleFilterChange = (type: string) => {
        setFilters(prev => ({
            ...prev,
            types: prev.types.includes(type)
                ? prev.types.filter(t => t !== type)
                : [...prev.types, type],
        }));
    };

    const getResultIcon = (type: SearchResult['type']) => {
        switch (type) {
            case 'operation':
                return <SecurityIcon />;
            case 'task':
                return <AssignmentIcon />;
            case 'tool':
                return <BuildIcon />;
            case 'user':
                return <PeopleIcon />;
            case 'settings':
                return <SettingsIcon />;
            case 'help':
                return <HelpIcon />;
            default:
                return <SearchIcon />;
        }
    };

    return (
        <ClickAwayListener onClickAway={handleClose}>
            <Box sx={{ position: 'relative' }}>
                <TextField
                    inputRef={searchInputRef}
                    fullWidth
                    placeholder="Search operations, tasks, tools... (Press '/' to focus)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClick={handleSearchClick}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <>
                                {searchQuery && (
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            onClick={() => setSearchQuery('')}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )}
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        onClick={() => setShowFilters(!showFilters)}
                                        color={showFilters ? 'primary' : 'default'}
                                    >
                                        <FilterListIcon />
                                    </IconButton>
                                </InputAdornment>
                            </>
                        ),
                    }}
                    sx={{ width: 300 }}
                />

                <Popper
                    open={Boolean(anchorEl) && (Boolean(searchQuery) || showFilters)}
                    anchorEl={anchorEl}
                    placement="bottom-start"
                    style={{ width: anchorEl?.clientWidth, zIndex: 1300 }}
                >
                    <Paper elevation={3}>
                        {showFilters && (
                            <Box sx={{ p: 2 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Filter by Type
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                                    {['operation', 'task', 'tool', 'user', 'settings', 'help'].map((type) => (
                                        <Chip
                                            key={type}
                                            label={type}
                                            onClick={() => handleFilterChange(type)}
                                            color={filters.types.includes(type) ? 'primary' : 'default'}
                                            size="small"
                                        />
                                    ))}
                                </Box>
                                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                                    <InputLabel>Date Range</InputLabel>
                                    <Select
                                        value={filters.dateRange}
                                        label="Date Range"
                                        onChange={(e) => setFilters(prev => ({
                                            ...prev,
                                            dateRange: e.target.value as SearchFilters['dateRange'],
                                        }))}
                                    >
                                        <MenuItem value="all">All Time</MenuItem>
                                        <MenuItem value="today">Today</MenuItem>
                                        <MenuItem value="week">This Week</MenuItem>
                                        <MenuItem value="month">This Month</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        )}

                        {loading ? (
                            <Box sx={{ p: 2 }}>
                                <Typography>Searching...</Typography>
                            </Box>
                        ) : results.length > 0 ? (
                            <List sx={{ p: 0 }}>
                                {results.map((result) => (
                                    <ListItem
                                        key={result.id}
                                        button
                                        onClick={() => handleResultClick(result)}
                                    >
                                        <ListItemIcon>
                                            {getResultIcon(result.type)}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={result.title}
                                            secondary={
                                                <>
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                    >
                                                        {result.description}
                                                    </Typography>
                                                    {result.tags && (
                                                        <Box sx={{ mt: 0.5 }}>
                                                            {result.tags.map((tag) => (
                                                                <Chip
                                                                    key={tag}
                                                                    label={tag}
                                                                    size="small"
                                                                    sx={{ mr: 0.5, mb: 0.5 }}
                                                                />
                                                            ))}
                                                        </Box>
                                                    )}
                                                </>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Box sx={{ p: 2 }}>
                                <Typography>No results found</Typography>
                            </Box>
                        )}
                    </Paper>
                </Popper>
            </Box>
        </ClickAwayListener>
    );
};

export default Search; 