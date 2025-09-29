import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  Stack,
  Grid,
  Alert,
  LinearProgress,
  Pagination,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Security as SecurityIcon,
  Category as CategoryIcon,
  Restore as RestoreIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer.jsx';
import {
  getAllPermissions,
  getActivePermissions,
  getDeletedPermissions,
  deletePermission,
  restorePermission,
  permanentDeletePermission,
  searchPermissions,
  getPermissionStats,
  getAllCategories,
} from '../../../api/user-management/PermissionsData.js';

const ListPermissions = () => {
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState([]);
  const [filteredPermissions, setFilteredPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    deleted: 0,
    system: 0,
    custom: 0,
    categories: 0,
    categoryStats: {},
  });

  const typeOptions = [
    { value: 'all', label: 'All Permissions' },
    { value: 'active', label: 'Active Permissions' },
    { value: 'deleted', label: 'Deleted Permissions' },
    { value: 'system', label: 'System Permissions' },
    { value: 'custom', label: 'Custom Permissions' },
  ];

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadPermissions();
    loadStats();
    loadCategories();
  }, []);

  useEffect(() => {
    filterPermissions();
  }, [permissions, searchQuery, typeFilter, categoryFilter]);

  const loadPermissions = () => {
    try {
      const allPermissions = getAllPermissions();
      setPermissions(allPermissions);
    } catch (err) {
      setError('Failed to load permissions');
    }
  };

  const loadStats = () => {
    try {
      const permissionStats = getPermissionStats();
      setStats(permissionStats);
    } catch (err) {
      setError('Failed to load statistics');
    }
  };

  const loadCategories = () => {
    try {
      const allCategories = getAllCategories();
      setCategories(allCategories);
    } catch (err) {
      setError('Failed to load categories');
    }
  };

  const filterPermissions = () => {
    let filtered = [...permissions];

    // Search filter
    if (searchQuery) {
      filtered = searchPermissions(searchQuery);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter((permission) => {
        if (typeFilter === 'active') return permission.status === 'active';
        if (typeFilter === 'deleted') return permission.status === 'deleted';
        if (typeFilter === 'system') return permission.isSystem;
        if (typeFilter === 'custom') return !permission.isSystem;
        return true;
      });
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((permission) => permission.category === categoryFilter);
    }

    setFilteredPermissions(filtered);
  };

  const handleViewPermission = (permission) => {
    setSelectedPermission(permission);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedPermission(null);
  };

  const handleEditPermission = (permission) => {
    navigate(`/user-manage/permissions/edit/${permission.id}`);
  };

  const handleDelete = async (permission) => {
    // Soft delete - always soft delete first
    if (window.confirm(`Are you sure you want to delete the permission "${permission.name}"?`)) {
      setLoading(true);
      setError('');
      setSuccess('');

      try {
        await deletePermission(permission.id);
        setSuccess('Permission deleted successfully');
        loadPermissions();
        loadStats();

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSuccess('');
        }, 5000);
      } catch (err) {
        setError(err.message || 'Failed to delete permission');
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePermanentDelete = async (permission) => {
    // Permanent delete
    if (
      window.confirm(
        `Are you sure you want to permanently delete the permission "${permission.name}"? This action cannot be undone!`,
      )
    ) {
      setLoading(true);
      setError('');
      setSuccess('');

      try {
        await permanentDeletePermission(permission.id);
        setSuccess('Permission permanently deleted');
        loadPermissions();
        loadStats();

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSuccess('');
        }, 5000);
      } catch (err) {
        setError(err.message || 'Failed to permanently delete permission');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRestore = async (permission) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await restorePermission(permission.id);
      setSuccess('Permission restored successfully');
      loadPermissions();
      loadStats();

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccess('');
      }, 5000);
    } catch (err) {
      setError(err.message || 'Failed to restore permission');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'User Management': '#f44336',
      'E-commerce': '#2196f3',
      Analytics: '#ff9800',
      System: '#9c27b0',
      Support: '#4caf50',
      Content: '#00bcd4',
    };
    return colors[category] || '#757575';
  };

  const getActionColor = (action) => {
    const colors = {
      read: '#4caf50',
      create: '#2196f3',
      update: '#ff9800',
      delete: '#f44336',
    };
    return colors[action] || '#757575';
  };

  const formatKey = (key) => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Pagination
  const totalPages = Math.ceil(filteredPermissions.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedPermissions = filteredPermissions.slice(startIndex, endIndex);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <PageContainer title="Permissions Management" description="Manage system permissions">
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" gutterBottom>
                Permissions Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage system permissions and access controls
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/user-manage/permissions/create')}
            >
              Add New Permission
            </Button>
          </Stack>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <SecurityIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{stats.total}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Permissions
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'success.main' }}>
                    <SecurityIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{stats.active}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'error.main' }}>
                    <SecurityIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{stats.deleted}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Deleted
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'warning.main' }}>
                    <SecurityIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{stats.system}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      System
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'info.main' }}>
                    <CategoryIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{stats.categories}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Categories
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  fullWidth
                  placeholder="Search permissions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={typeFilter}
                    label="Type"
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    {typeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={categoryFilter}
                    label="Category"
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {/* Loading */}
        {loading && <LinearProgress sx={{ mb: 2 }} />}

        {/* Permissions Table */}
        <Card>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Permission</TableCell>
                    <TableCell>Key</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Actions</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedPermissions.map((permission) => (
                    <TableRow key={permission.id} hover>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar
                            sx={{
                              bgcolor: getCategoryColor(permission.category),
                              width: 32,
                              height: 32,
                              opacity: permission.status === 'deleted' ? 0.5 : 1,
                            }}
                          >
                            <SecurityIcon />
                          </Avatar>
                          <Box>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                textDecoration:
                                  permission.status === 'deleted' ? 'line-through' : 'none',
                                opacity: permission.status === 'deleted' ? 0.6 : 1,
                              }}
                            >
                              {permission.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {permission.description}
                            </Typography>
                            {permission.status === 'deleted' && (
                              <Typography variant="caption" color="error" display="block">
                                Deleted
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={formatKey(permission.key)}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={permission.category}
                          size="small"
                          sx={{
                            bgcolor: getCategoryColor(permission.category),
                            color: 'white',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5} flexWrap="wrap">
                          {permission.actions.map((action) => (
                            <Chip
                              key={action}
                              label={action}
                              size="small"
                              sx={{
                                bgcolor: getActionColor(action),
                                color: 'white',
                                fontSize: '0.7rem',
                                height: 20,
                              }}
                            />
                          ))}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={permission.isSystem ? 'System' : 'Custom'}
                          size="small"
                          color={permission.isSystem ? 'warning' : 'info'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleViewPermission(permission)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          {permission.status !== 'deleted' && (
                            <Tooltip title="Edit Permission">
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditPermission(permission)}
                                  disabled={permission.isSystem}
                                >
                                  <EditIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                          )}
                          {permission.status === 'deleted' ? (
                            <>
                              <Tooltip title="Restore Permission">
                                <IconButton
                                  size="small"
                                  onClick={() => handleRestore(permission)}
                                  color="success"
                                >
                                  <RestoreIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Forever">
                                <span>
                                  <IconButton
                                    size="small"
                                    onClick={() => handlePermanentDelete(permission)}
                                    color="error"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </>
                          ) : (
                            <Tooltip title="Delete Permission">
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDelete(permission)}
                                  disabled={permission.isSystem}
                                  color="error"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}

            {/* No data message */}
            {filteredPermissions.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No permissions found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your search or filter criteria
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* View Permission Dialog */}
        <Dialog open={viewDialogOpen} onClose={handleCloseViewDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <SecurityIcon />
              </Avatar>
              <Box>
                <Typography variant="h6">{selectedPermission?.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Permission Details
                </Typography>
              </Box>
            </Stack>
          </DialogTitle>
          <DialogContent>
            {selectedPermission && (
              <Box>
                {/* Basic Information */}
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Name
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedPermission.name}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Key
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      <Chip
                        label={formatKey(selectedPermission.key)}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Description
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedPermission.description || 'No description provided'}
                    </Typography>
                  </Grid>
                </Grid>

                {/* Category and Type */}
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Classification
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Category
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      <Chip
                        label={selectedPermission.category}
                        size="small"
                        sx={{
                          bgcolor: getCategoryColor(selectedPermission.category),
                          color: 'white',
                        }}
                      />
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Type
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      <Chip
                        label={selectedPermission.isSystem ? 'System' : 'Custom'}
                        size="small"
                        color={selectedPermission.isSystem ? 'warning' : 'info'}
                        variant="outlined"
                      />
                    </Typography>
                  </Grid>
                </Grid>

                {/* Actions */}
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Available Actions
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {selectedPermission.actions?.map((action) => (
                    <Chip
                      key={action}
                      label={action}
                      size="small"
                      sx={{
                        bgcolor: getActionColor(action),
                        color: 'white',
                      }}
                    />
                  ))}
                </Stack>

                {/* Status */}
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Status
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Current Status
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      <Chip
                        label={selectedPermission.status === 'active' ? 'Active' : 'Deleted'}
                        size="small"
                        color={selectedPermission.status === 'active' ? 'success' : 'error'}
                        variant="outlined"
                      />
                    </Typography>
                  </Grid>
                  {selectedPermission.deletedAt && (
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Deleted At
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {new Date(selectedPermission.deletedAt).toLocaleString()}
                      </Typography>
                    </Grid>
                  )}
                </Grid>

                {/* Timestamps */}
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Timestamps
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Created At
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {new Date(selectedPermission.createdAt).toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {new Date(selectedPermission.updatedAt).toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseViewDialog} color="primary">
              Close
            </Button>
            {selectedPermission && selectedPermission.status !== 'deleted' && (
              <Button
                onClick={() => {
                  handleCloseViewDialog();
                  handleEditPermission(selectedPermission);
                }}
                variant="contained"
                color="primary"
              >
                Edit Permission
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    </PageContainer>
  );
};

export default ListPermissions;
