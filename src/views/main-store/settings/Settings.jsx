import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  TextField,
  Typography,
  Divider,
  Alert,
  Switch,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  InputAdornment,
  Paper,
  Avatar,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ToggleButton,
  ToggleButtonGroup,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  CircularProgress,
  Skeleton,
  AlertTitle,
} from '@mui/material';
import {
  Save as SaveIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Settings as SettingsIcon,
  Store as StoreIcon,
  CreditCard as CreditCardIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  ColorLens as ColorLensIcon,
  NotificationsActive as NotificationsActiveIcon,
  TrendingUp as TrendingUpIcon,
  CloudUpload as CloudUploadIcon,
  History as HistoryIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Help as HelpIcon,
  Search as SearchIcon,
  ViewList as ViewListIcon,
  GridView as GridViewIcon,
  CheckCircle as CheckIcon,
  Edit as EditIcon,
  Restore as RestoreIcon,
} from '@mui/icons-material';
import PageContainer from 'src/components/container/PageContainer.jsx';
import {
  getSettings,
  updateSettings,
  resetSettings,
  exportSettings,
  importSettings,
  validateSettings,
  getSettingsStats,
} from '../../../api/settings/SettingsData.js';

const Settings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalSettings: 0,
    categories: 0,
    lastUpdated: null,
    version: '1.0.0',
  });

  // UI States
  const [expandedCards, setExpandedCards] = useState({});
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Dialog states
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Speed Dial states
  const [speedDialOpen, setSpeedDialOpen] = useState(false);

  const categories = [
    {
      id: 'store',
      title: 'Store Information',
      icon: <StoreIcon />,
      description: 'Basic store details and contact information',
      color: '#1976d2',
      lightGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      darkGradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      items: 6,
      priority: 'high',
      tags: ['essential', 'business'],
    },
    {
      id: 'payment',
      title: 'Payment & Shipping',
      icon: <CreditCardIcon />,
      description: 'Payment methods, taxes, and shipping costs',
      color: '#2e7d32',
      lightGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      darkGradient: 'linear-gradient(135deg, #0f3460 0%, #16537e 100%)',
      items: 5,
      priority: 'high',
      tags: ['financial', 'essential'],
    },
    {
      id: 'email',
      title: 'Email & Communications',
      icon: <EmailIcon />,
      description: 'Email notifications and SMTP configuration',
      color: '#ed6c02',
      lightGradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      darkGradient: 'linear-gradient(135deg, #8b1538 0%, #a52a2a 100%)',
      items: 4,
      priority: 'medium',
      tags: ['communication', 'notifications'],
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      icon: <LockIcon />,
      description: 'Security policies and authentication settings',
      color: '#d32f2f',
      lightGradient: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
      darkGradient: 'linear-gradient(135deg, #8b0000 0%, #b22222 100%)',
      items: 5,
      priority: 'high',
      tags: ['security', 'privacy'],
    },
    {
      id: 'theme',
      title: 'Appearance & Branding',
      icon: <ColorLensIcon />,
      description: 'Store appearance and branding',
      color: '#7b1fa2',
      lightGradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      darkGradient: 'linear-gradient(135deg, #2d5016 0%, #4a6741 100%)',
      items: 4,
      priority: 'medium',
      tags: ['design', 'branding'],
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <NotificationsActiveIcon />,
      description: 'User notification preferences',
      color: '#0288d1',
      lightGradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      darkGradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      items: 4,
      priority: 'medium',
      tags: ['alerts', 'user-experience'],
    },
    {
      id: 'analytics',
      title: 'Analytics & Tracking',
      icon: <TrendingUpIcon />,
      description: 'Tracking and analytics configuration',
      color: '#388e3c',
      lightGradient: 'linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%)',
      darkGradient: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)',
      items: 6,
      priority: 'low',
      tags: ['data', 'insights'],
    },
    {
      id: 'backup',
      title: 'Backup & Maintenance',
      icon: <CloudUploadIcon />,
      description: 'Data backup and maintenance settings',
      color: '#5d4037',
      lightGradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      darkGradient: 'linear-gradient(135deg, #451a03 0%, #92400e 100%)',
      items: 4,
      priority: 'low',
      tags: ['maintenance', 'data'],
    },
  ];

  useEffect(() => {
    loadSettings();
    loadStats();
  }, []);

  const loadSettings = () => {
    try {
      const storeSettings = getSettings();
      setSettings(storeSettings);
    } catch (err) {
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = () => {
    try {
      const settingsStats = getSettingsStats();
      setStats(settingsStats);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNestedSettingChange = (parentKey, childKey, value) => {
    setSettings((prev) => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [childKey]: value,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Validate settings
      const validation = validateSettings(settings);
      if (!validation.isValid) {
        setError(`Validation failed: ${validation.errors.join(', ')}`);
        return;
      }

      // Update settings
      await updateSettings(settings);
      setSuccess('Settings saved successfully!');
      loadStats();

      // Auto-hide success message after 6 seconds
      setTimeout(() => {
        setSuccess('');
      }, 6000);
    } catch (err) {
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      await resetSettings();
      loadSettings();
      setSuccess('Settings reset to default successfully!');
      setResetDialogOpen(false);

      // Auto-hide success message after 6 seconds
      setTimeout(() => {
        setSuccess('');
      }, 6000);
    } catch (err) {
      setError('Failed to reset settings');
    }
  };

  const handleExport = () => {
    try {
      exportSettings();
      setSuccess('Settings exported successfully!');

      // Auto-hide success message after 6 seconds
      setTimeout(() => {
        setSuccess('');
      }, 6000);
    } catch (err) {
      setError('Failed to export settings');
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      setError('Please select a file to import');
      return;
    }

    try {
      await importSettings(selectedFile);
      loadSettings();
      setSuccess('Settings imported successfully!');
      setImportDialogOpen(false);
      setSelectedFile(null);

      // Auto-hide success message after 6 seconds
      setTimeout(() => {
        setSuccess('');
      }, 6000);
    } catch (err) {
      setError('Failed to import settings');
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
      setSelectedFile(file);
    } else {
      setError('Please select a valid JSON file');
    }
  };

  const handleCardExpand = (categoryId) => {
    setExpandedCards((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleConfigureSettings = (category) => {
    setSelectedCategory(category);
    setSettingsDialogOpen(true);
  };

  const handleCloseSettingsDialog = () => {
    setSettingsDialogOpen(false);
    setSelectedCategory(null);
  };

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <WarningIcon />;
      case 'medium':
        return <InfoIcon />;
      case 'low':
        return <CheckIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const filteredCategories = categories.filter((category) => {
    if (filterCategory !== 'all' && !category.tags.includes(filterCategory)) {
      return false;
    }
    if (
      searchQuery &&
      !category.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !category.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const speedDialActions = [
    { icon: <SaveIcon />, name: 'Save All', action: handleSave },
    { icon: <DownloadIcon />, name: 'Export', action: handleExport },
    { icon: <UploadIcon />, name: 'Import', action: () => setImportDialogOpen(true) },
    { icon: <RestoreIcon />, name: 'Reset', action: () => setResetDialogOpen(true) },
    { icon: <HelpIcon />, name: 'Help', action: () => setHelpDialogOpen(true) },
  ];

  if (loading) {
    return (
      <PageContainer title="Settings" description="Manage store settings">
        <Box>
          {/* Header Skeleton */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Skeleton variant="text" width={200} height={40} />
            <Stack direction="row" spacing={2}>
              <Skeleton variant="rectangular" width={100} height={36} />
              <Skeleton variant="rectangular" width={100} height={36} />
              <Skeleton variant="rectangular" width={100} height={36} />
              <Skeleton variant="rectangular" width={120} height={36} />
            </Stack>
          </Box>

          {/* Stats Skeleton */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={3}>
                {[1, 2, 3, 4].map((item) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Skeleton variant="circular" width={40} height={40} />
                      <Box>
                        <Skeleton variant="text" width={60} height={24} />
                        <Skeleton variant="text" width={80} height={16} />
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Categories Skeleton */}
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={item}>
                <Card>
                  <CardContent>
                    <Skeleton variant="text" width="80%" height={32} />
                    <Skeleton variant="text" width="60%" height={20} />
                    <Skeleton variant="rectangular" width="100%" height={120} sx={{ mt: 2 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Settings" description="Manage store settings">
      <Box>
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg,rgb(27, 27, 48) 0%, #16213e 100%)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                Store Settings
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Configure and manage your store settings
              </Typography>
            </Box>
            <Avatar sx={{ width: 80, height: 80, bgcolor: 'rgba(255,255,255,0.2)' }}>
              <SettingsIcon sx={{ fontSize: 40 }} />
            </Avatar>
          </Box>
        </Paper>

        {/* Action Bar */}
        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <TextField
                size="small"
                placeholder="Search settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 250 }}
              />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Filter</InputLabel>
                <Select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  label="Filter"
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  <MenuItem value="essential">Essential</MenuItem>
                  <MenuItem value="financial">Financial</MenuItem>
                  <MenuItem value="security">Security</MenuItem>
                  <MenuItem value="design">Design</MenuItem>
                  <MenuItem value="data">Data</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box display="flex" alignItems="center" gap={2}>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={handleViewModeChange}
                size="small"
              >
                <ToggleButton value="grid">
                  <GridViewIcon />
                </ToggleButton>
                <ToggleButton value="list">
                  <ViewListIcon />
                </ToggleButton>
              </ToggleButtonGroup>

              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleExport}
                size="small"
              >
                Export
              </Button>
              <Button
                variant="outlined"
                startIcon={<UploadIcon />}
                onClick={() => setImportDialogOpen(true)}
                size="small"
              >
                Import
              </Button>
              <Button
                variant="outlined"
                startIcon={<RestoreIcon />}
                onClick={() => setResetDialogOpen(true)}
                color="warning"
                size="small"
              >
                Reset
              </Button>
              <Button
                variant="contained"
                startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
                onClick={handleSave}
                disabled={saving}
                size="small"
              >
                {saving ? 'Saving...' : 'Save All'}
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Success/Error Messages */}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Settings Statistics */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {stats.totalSettings}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Total Settings
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <SettingsIcon />
                  </Avatar>
                </Box>
                <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.1 }}>
                  <SettingsIcon sx={{ fontSize: 100 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #0f3460 0%, #16537e 100%)'
                    : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {stats.categories}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Categories
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <StoreIcon />
                  </Avatar>
                </Box>
                <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.1 }}>
                  <StoreIcon sx={{ fontSize: 100 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #8b1538 0%, #a52a2a 100%)'
                    : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {stats.version}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Version
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <CheckIcon />
                  </Avatar>
                </Box>
                <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.1 }}>
                  <CheckIcon sx={{ fontSize: 100 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #2d5016 0%, #4a6741 100%)'
                    : 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {stats.lastUpdated
                        ? new Date(stats.lastUpdated).toLocaleDateString()
                        : 'Never'}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Last Updated
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <HistoryIcon />
                  </Avatar>
                </Box>
                <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.1 }}>
                  <HistoryIcon sx={{ fontSize: 100 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Settings Categories */}
        {viewMode === 'grid' ? (
          <Grid container spacing={3}>
            {filteredCategories.map((category) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={category.id}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                    background: expandedCards[category.id]
                      ? (theme) =>
                          theme.palette.mode === 'dark'
                            ? category.darkGradient
                            : category.lightGradient
                      : 'inherit',
                    color: expandedCards[category.id] ? 'white' : 'inherit',
                  }}
                  onClick={() => handleCardExpand(category.id)}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                      <Avatar
                        sx={{
                          bgcolor: expandedCards[category.id]
                            ? 'rgba(255,255,255,0.2)'
                            : category.color,
                          color: expandedCards[category.id] ? 'white' : 'white',
                        }}
                      >
                        {category.icon}
                      </Avatar>
                      <Box display="flex" gap={1}>
                        <Chip
                          icon={getPriorityIcon(category.priority)}
                          label={category.priority}
                          color={getPriorityColor(category.priority)}
                          size="small"
                          sx={{
                            bgcolor: expandedCards[category.id]
                              ? 'rgba(255,255,255,0.2)'
                              : undefined,
                            color: expandedCards[category.id] ? 'white' : undefined,
                          }}
                        />
                        <Chip
                          label={`${category.items} items`}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: expandedCards[category.id]
                              ? 'rgba(255,255,255,0.5)'
                              : undefined,
                            color: expandedCards[category.id] ? 'white' : undefined,
                          }}
                        />
                      </Box>
                    </Box>

                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {category.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        opacity: expandedCards[category.id] ? 0.9 : 0.7,
                        mb: 2,
                      }}
                    >
                      {category.description}
                    </Typography>

                    <Box display="flex" gap={1} flexWrap="wrap">
                      {category.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: '0.7rem',
                            borderColor: expandedCards[category.id]
                              ? 'rgba(255,255,255,0.5)'
                              : undefined,
                            color: expandedCards[category.id] ? 'white' : undefined,
                          }}
                        />
                      ))}
                    </Box>

                    <Collapse in={expandedCards[category.id]}>
                      <Box mt={2}>
                        <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.2)' }} />
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<EditIcon />}
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.2)',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                          }}
                          onClick={() => handleConfigureSettings(category)}
                        >
                          Configure Settings
                        </Button>
                      </Box>
                    </Collapse>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <List>
            {filteredCategories.map((category) => (
              <ListItem key={category.id} sx={{ mb: 2 }}>
                <Card sx={{ width: '100%' }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: category.color }}>{category.icon}</Avatar>
                        <Box>
                          <Typography variant="h6">{category.title}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {category.description}
                          </Typography>
                        </Box>
                      </Box>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Chip
                          icon={getPriorityIcon(category.priority)}
                          label={category.priority}
                          color={getPriorityColor(category.priority)}
                          size="small"
                        />
                        <Chip label={`${category.items} items`} size="small" variant="outlined" />
                        <Button
                          variant="contained"
                          startIcon={<EditIcon />}
                          size="small"
                          onClick={() => handleConfigureSettings(category)}
                        >
                          Configure
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </ListItem>
            ))}
          </List>
        )}

        {/* Speed Dial */}
        <SpeedDial
          ariaLabel="Settings actions"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
          onClose={() => setSpeedDialOpen(false)}
          onOpen={() => setSpeedDialOpen(true)}
          open={speedDialOpen}
        >
          {speedDialActions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={action.action}
            />
          ))}
        </SpeedDial>

        {/* Reset Confirmation Dialog */}
        <Dialog
          open={resetDialogOpen}
          onClose={() => setResetDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={2}>
              <WarningIcon color="warning" />
              Reset Settings
            </Box>
          </DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <AlertTitle>Warning</AlertTitle>
              This action will reset all settings to their default values and cannot be undone.
            </Alert>
            <Typography>
              Are you sure you want to proceed? All your current settings will be lost.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setResetDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleReset} color="warning" variant="contained">
              Reset Settings
            </Button>
          </DialogActions>
        </Dialog>

        {/* Import Settings Dialog */}
        <Dialog
          open={importDialogOpen}
          onClose={() => setImportDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={2}>
              <UploadIcon color="primary" />
              Import Settings
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography gutterBottom>Select a JSON file to import settings from:</Typography>
            <Box
              sx={{
                border: '2px dashed #ccc',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                mt: 2,
                cursor: 'pointer',
                '&:hover': { borderColor: 'primary.main' },
              }}
              onClick={() => document.getElementById('file-input').click()}
            >
              <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Drop file here or click to browse
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Only JSON files are supported
              </Typography>
              <input
                id="file-input"
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </Box>
            {selectedFile && (
              <Alert severity="success" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Selected: <strong>{selectedFile.name}</strong>
                </Typography>
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setImportDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleImport}
              variant="contained"
              disabled={!selectedFile}
              startIcon={<UploadIcon />}
            >
              Import Settings
            </Button>
          </DialogActions>
        </Dialog>

        {/* Settings Configuration Dialog */}
        <Dialog
          open={settingsDialogOpen}
          onClose={handleCloseSettingsDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={2}>
              {selectedCategory?.icon}
              <Typography variant="h6">{selectedCategory?.title} Settings</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedCategory?.id === 'store' && (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Store Name"
                    value={settings.storeName || ''}
                    onChange={(e) => handleSettingChange('storeName', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Store Email"
                    type="email"
                    value={settings.storeEmail || ''}
                    onChange={(e) => handleSettingChange('storeEmail', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Store Phone"
                    value={settings.storePhone || ''}
                    onChange={(e) => handleSettingChange('storePhone', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Store Website"
                    value={settings.storeWebsite || ''}
                    onChange={(e) => handleSettingChange('storeWebsite', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Store Description"
                    multiline
                    rows={3}
                    value={settings.storeDescription || ''}
                    onChange={(e) => handleSettingChange('storeDescription', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Store Address"
                    multiline
                    rows={2}
                    value={settings.storeAddress || ''}
                    onChange={(e) => handleSettingChange('storeAddress', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            )}

            {selectedCategory?.id === 'payment' && (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Currency</InputLabel>
                    <Select
                      value={settings.currency || 'USD'}
                      onChange={(e) => handleSettingChange('currency', e.target.value)}
                      label="Currency"
                    >
                      <MenuItem value="USD">USD - US Dollar</MenuItem>
                      <MenuItem value="EUR">EUR - Euro</MenuItem>
                      <MenuItem value="GBP">GBP - British Pound</MenuItem>
                      <MenuItem value="EGP">EGP - Egyptian Pound</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Currency Symbol"
                    value={settings.currencySymbol || '$'}
                    onChange={(e) => handleSettingChange('currencySymbol', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Tax Rate (%)"
                    type="number"
                    value={settings.taxRate || 0}
                    onChange={(e) => handleSettingChange('taxRate', parseFloat(e.target.value))}
                    inputProps={{ min: 0, max: 100, step: 0.1 }}
                    variant="outlined"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Shipping Cost"
                    type="number"
                    value={settings.shippingCost || 0}
                    onChange={(e) =>
                      handleSettingChange('shippingCost', parseFloat(e.target.value))
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {settings.currencySymbol || '$'}
                        </InputAdornment>
                      ),
                    }}
                    inputProps={{ min: 0, step: 0.01 }}
                    variant="outlined"
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Free Shipping Threshold"
                    type="number"
                    value={settings.freeShippingThreshold || 0}
                    onChange={(e) =>
                      handleSettingChange('freeShippingThreshold', parseFloat(e.target.value))
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {settings.currencySymbol || '$'}
                        </InputAdornment>
                      ),
                    }}
                    inputProps={{ min: 0, step: 0.01 }}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            )}

            {selectedCategory?.id === 'email' && (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom>
                    Email Notifications
                  </Typography>
                  <FormControl component="fieldset" variant="outlined">
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.emailNotifications?.newOrder || false}
                            onChange={(e) =>
                              handleNestedSettingChange(
                                'emailNotifications',
                                'newOrder',
                                e.target.checked,
                              )
                            }
                          />
                        }
                        label="New Order Notifications"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.emailNotifications?.orderShipped || false}
                            onChange={(e) =>
                              handleNestedSettingChange(
                                'emailNotifications',
                                'orderShipped',
                                e.target.checked,
                              )
                            }
                          />
                        }
                        label="Order Shipped Notifications"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.emailNotifications?.orderDelivered || false}
                            onChange={(e) =>
                              handleNestedSettingChange(
                                'emailNotifications',
                                'orderDelivered',
                                e.target.checked,
                              )
                            }
                          />
                        }
                        label="Order Delivered Notifications"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.emailNotifications?.lowStock || false}
                            onChange={(e) =>
                              handleNestedSettingChange(
                                'emailNotifications',
                                'lowStock',
                                e.target.checked,
                              )
                            }
                          />
                        }
                        label="Low Stock Notifications"
                      />
                    </FormGroup>
                  </FormControl>
                </Grid>
              </Grid>
            )}

            {selectedCategory?.id === 'security' && (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom>
                    Security Policies
                  </Typography>
                  <FormControl component="fieldset" variant="outlined">
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.securitySettings?.requireEmailVerification || false}
                            onChange={(e) =>
                              handleNestedSettingChange(
                                'securitySettings',
                                'requireEmailVerification',
                                e.target.checked,
                              )
                            }
                          />
                        }
                        label="Require Email Verification"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.securitySettings?.requirePhoneVerification || false}
                            onChange={(e) =>
                              handleNestedSettingChange(
                                'securitySettings',
                                'requirePhoneVerification',
                                e.target.checked,
                              )
                            }
                          />
                        }
                        label="Require Phone Verification"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.securitySettings?.twoFactorAuth || false}
                            onChange={(e) =>
                              handleNestedSettingChange(
                                'securitySettings',
                                'twoFactorAuth',
                                e.target.checked,
                              )
                            }
                          />
                        }
                        label="Two-Factor Authentication"
                      />
                    </FormGroup>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Session Timeout (minutes)"
                    type="number"
                    value={settings.securitySettings?.sessionTimeout || 30}
                    onChange={(e) =>
                      handleNestedSettingChange(
                        'securitySettings',
                        'sessionTimeout',
                        parseInt(e.target.value),
                      )
                    }
                    inputProps={{ min: 5, max: 1440 }}
                    variant="outlined"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Max Login Attempts"
                    type="number"
                    value={settings.securitySettings?.maxLoginAttempts || 5}
                    onChange={(e) =>
                      handleNestedSettingChange(
                        'securitySettings',
                        'maxLoginAttempts',
                        parseInt(e.target.value),
                      )
                    }
                    inputProps={{ min: 3, max: 10 }}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            )}

            {selectedCategory?.id === 'theme' && (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Primary Color"
                    type="color"
                    value={settings.themeSettings?.primaryColor || '#1976d2'}
                    onChange={(e) =>
                      handleNestedSettingChange('themeSettings', 'primaryColor', e.target.value)
                    }
                    variant="outlined"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Secondary Color"
                    type="color"
                    value={settings.themeSettings?.secondaryColor || '#dc004e'}
                    onChange={(e) =>
                      handleNestedSettingChange('themeSettings', 'secondaryColor', e.target.value)
                    }
                    variant="outlined"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Font Family</InputLabel>
                    <Select
                      value={settings.themeSettings?.fontFamily || 'Roboto'}
                      onChange={(e) =>
                        handleNestedSettingChange('themeSettings', 'fontFamily', e.target.value)
                      }
                      label="Font Family"
                    >
                      <MenuItem value="Roboto">Roboto</MenuItem>
                      <MenuItem value="Arial">Arial</MenuItem>
                      <MenuItem value="Helvetica">Helvetica</MenuItem>
                      <MenuItem value="Times New Roman">Times New Roman</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Layout Style</InputLabel>
                    <Select
                      value={settings.themeSettings?.layout || 'modern'}
                      onChange={(e) =>
                        handleNestedSettingChange('themeSettings', 'layout', e.target.value)
                      }
                      label="Layout Style"
                    >
                      <MenuItem value="modern">Modern</MenuItem>
                      <MenuItem value="classic">Classic</MenuItem>
                      <MenuItem value="minimal">Minimal</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            )}

            {selectedCategory?.id === 'notifications' && (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom>
                    Notification Preferences
                  </Typography>
                  <FormControl component="fieldset" variant="outlined">
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.notificationSettings?.browserNotifications || false}
                            onChange={(e) =>
                              handleNestedSettingChange(
                                'notificationSettings',
                                'browserNotifications',
                                e.target.checked,
                              )
                            }
                          />
                        }
                        label="Browser Notifications"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.notificationSettings?.emailNotifications || false}
                            onChange={(e) =>
                              handleNestedSettingChange(
                                'notificationSettings',
                                'emailNotifications',
                                e.target.checked,
                              )
                            }
                          />
                        }
                        label="Email Notifications"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.notificationSettings?.pushNotifications || false}
                            onChange={(e) =>
                              handleNestedSettingChange(
                                'notificationSettings',
                                'pushNotifications',
                                e.target.checked,
                              )
                            }
                          />
                        }
                        label="Push Notifications"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.notificationSettings?.soundNotifications || false}
                            onChange={(e) =>
                              handleNestedSettingChange(
                                'notificationSettings',
                                'soundNotifications',
                                e.target.checked,
                              )
                            }
                          />
                        }
                        label="Sound Notifications"
                      />
                    </FormGroup>
                  </FormControl>
                </Grid>
              </Grid>
            )}

            {selectedCategory?.id === 'analytics' && (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom>
                    Analytics Configuration
                  </Typography>
                  <FormControl component="fieldset" variant="outlined">
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.analyticsSettings?.trackUserBehavior || false}
                            onChange={(e) =>
                              handleNestedSettingChange(
                                'analyticsSettings',
                                'trackUserBehavior',
                                e.target.checked,
                              )
                            }
                          />
                        }
                        label="Track User Behavior"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.analyticsSettings?.trackPageViews || false}
                            onChange={(e) =>
                              handleNestedSettingChange(
                                'analyticsSettings',
                                'trackPageViews',
                                e.target.checked,
                              )
                            }
                          />
                        }
                        label="Track Page Views"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.analyticsSettings?.trackConversions || false}
                            onChange={(e) =>
                              handleNestedSettingChange(
                                'analyticsSettings',
                                'trackConversions',
                                e.target.checked,
                              )
                            }
                          />
                        }
                        label="Track Conversions"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.analyticsSettings?.anonymizeIp || false}
                            onChange={(e) =>
                              handleNestedSettingChange(
                                'analyticsSettings',
                                'anonymizeIp',
                                e.target.checked,
                              )
                            }
                          />
                        }
                        label="Anonymize IP Addresses"
                      />
                    </FormGroup>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Google Analytics ID"
                    value={settings.seoSettings?.googleAnalyticsId || ''}
                    onChange={(e) =>
                      handleNestedSettingChange('seoSettings', 'googleAnalyticsId', e.target.value)
                    }
                    placeholder="GA-XXXXXXXXX"
                    variant="outlined"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Facebook Pixel ID"
                    value={settings.seoSettings?.facebookPixelId || ''}
                    onChange={(e) =>
                      handleNestedSettingChange('seoSettings', 'facebookPixelId', e.target.value)
                    }
                    placeholder="123456789012345"
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            )}

            {selectedCategory?.id === 'backup' && (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom>
                    Backup & Maintenance
                  </Typography>
                  <FormControl component="fieldset" variant="outlined">
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.backupSettings?.autoBackup || false}
                            onChange={(e) =>
                              handleNestedSettingChange(
                                'backupSettings',
                                'autoBackup',
                                e.target.checked,
                              )
                            }
                          />
                        }
                        label="Automatic Backup"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.maintenanceSettings?.maintenanceMode || false}
                            onChange={(e) =>
                              handleNestedSettingChange(
                                'maintenanceSettings',
                                'maintenanceMode',
                                e.target.checked,
                              )
                            }
                          />
                        }
                        label="Maintenance Mode"
                      />
                    </FormGroup>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Backup Frequency</InputLabel>
                    <Select
                      value={settings.backupSettings?.backupFrequency || 'daily'}
                      onChange={(e) =>
                        handleNestedSettingChange(
                          'backupSettings',
                          'backupFrequency',
                          e.target.value,
                        )
                      }
                      label="Backup Frequency"
                    >
                      <MenuItem value="daily">Daily</MenuItem>
                      <MenuItem value="weekly">Weekly</MenuItem>
                      <MenuItem value="monthly">Monthly</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Backup Retention (days)"
                    type="number"
                    value={settings.backupSettings?.backupRetention || 30}
                    onChange={(e) =>
                      handleNestedSettingChange(
                        'backupSettings',
                        'backupRetention',
                        parseInt(e.target.value),
                      )
                    }
                    inputProps={{ min: 7, max: 365 }}
                    variant="outlined"
                  />
                </Grid>
                {settings.maintenanceSettings?.maintenanceMode && (
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Maintenance Message"
                      multiline
                      rows={3}
                      value={settings.maintenanceSettings?.maintenanceMessage || ''}
                      onChange={(e) =>
                        handleNestedSettingChange(
                          'maintenanceSettings',
                          'maintenanceMessage',
                          e.target.value,
                        )
                      }
                      variant="outlined"
                    />
                  </Grid>
                )}
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSettingsDialog}>Cancel</Button>
            <Button onClick={handleSave} variant="contained" startIcon={<SaveIcon />}>
              Save Settings
            </Button>
          </DialogActions>
        </Dialog>

        {/* Help Dialog */}
        <Dialog
          open={helpDialogOpen}
          onClose={() => setHelpDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={2}>
              <HelpIcon color="primary" />
              Settings Help
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography variant="h6" gutterBottom>
              How to use Settings
            </Typography>
            <Typography paragraph>
              This settings panel allows you to configure all aspects of your store. Here's how to
              get started:
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Categories Overview
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <StoreIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Store Information"
                  secondary="Basic store details and contact information"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CreditCardIcon color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Payment & Shipping"
                  secondary="Payment methods, taxes, and shipping costs"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LockIcon color="error" />
                </ListItemIcon>
                <ListItemText
                  primary="Security & Privacy"
                  secondary="Security policies and authentication settings"
                />
              </ListItem>
            </List>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Tips
            </Typography>
            <Typography>
              • Use the search bar to quickly find specific settings
              <br />
              • Filter by category to focus on related settings
              <br />
              • Export your settings regularly as a backup
              <br />• High priority settings are marked with warning icons
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setHelpDialogOpen(false)} variant="contained">
              Got it!
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PageContainer>
  );
};

export default Settings;
