import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Divider,
  Alert,
  TextField,
  InputAdornment,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Stack,
  Badge,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  AdminPanelSettings as AdminIcon,
  SupervisorAccount as ManagerIcon,
  PersonPin as UserIcon,
  Security as SecurityIcon,
  Group as GroupIcon,
  People as PeopleIcon,
  Restore as RestoreIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer.jsx';
import {
  getAllRoles,
  getActiveRoles,
  getDeletedRoles,
  deleteRole,
  restoreRole,
  permanentDeleteRole,
  searchRoles,
  getRoleStats,
  getAllPermissions,
} from '../../../api/user-management/RolesData.js';

const ListRoles = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    system: 0,
    custom: 0,
    totalUsers: 0,
  });

  const typeOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'active', label: 'Active Roles' },
    { value: 'deleted', label: 'Deleted Roles' },
    { value: 'system', label: 'System Roles' },
    { value: 'custom', label: 'Custom Roles' },
  ];

  const allPermissions = getAllPermissions();

  useEffect(() => {
    loadRoles();
    loadStats();
  }, []);

  useEffect(() => {
    filterRoles();
  }, [roles, searchQuery, typeFilter]);

  const loadRoles = () => {
    try {
      const allRoles = getAllRoles();
      setRoles(allRoles);
    } catch (err) {
      setError('Failed to load roles');
    }
  };

  const loadStats = () => {
    try {
      const roleStats = getRoleStats();
      setStats(roleStats);
    } catch (err) {
      setError('Failed to load statistics');
    }
  };

  const filterRoles = () => {
    let filtered = [...roles];

    // Search filter
    if (searchQuery) {
      filtered = searchRoles(searchQuery);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter((role) => {
        if (typeFilter === 'active') return role.status === 'active';
        if (typeFilter === 'deleted') return role.status === 'deleted';
        if (typeFilter === 'system') return role.isSystem;
        if (typeFilter === 'custom') return !role.isSystem;
        return true;
      });
    }

    setFilteredRoles(filtered);
  };

  const handleViewRole = (role) => {
    setSelectedRole(role);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedRole(null);
  };

  const handleEditRole = (role) => {
    navigate(`/user-manage/roles/edit/${role.id}`);
  };

  const handleDelete = async (role) => {
    // Soft delete - always soft delete first
    if (window.confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
      setLoading(true);
      setError('');
      setSuccess('');

      try {
        await deleteRole(role.id);
        setSuccess('Role deleted successfully');
        loadRoles();
        loadStats();

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSuccess('');
        }, 5000);
      } catch (err) {
        setError(err.message || 'Failed to delete role');
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePermanentDelete = async (role) => {
    // Permanent delete
    if (
      window.confirm(
        `Are you sure you want to permanently delete the role "${role.name}"? This action cannot be undone!`,
      )
    ) {
      setLoading(true);
      setError('');
      setSuccess('');

      try {
        await permanentDeleteRole(role.id);
        setSuccess('Role permanently deleted');
        loadRoles();
        loadStats();

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSuccess('');
        }, 5000);
      } catch (err) {
        setError(err.message || 'Failed to permanently delete role');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRestore = async (role) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await restoreRole(role.id);
      setSuccess('Role restored successfully');
      loadRoles();
      loadStats();

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccess('');
      }, 5000);
    } catch (err) {
      setError(err.message || 'Failed to restore role');
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (roleKey) => {
    switch (roleKey) {
      case 'admin':
        return <AdminIcon />;
      case 'manager':
        return <ManagerIcon />;
      case 'user':
        return <UserIcon />;
      default:
        return <SecurityIcon />;
    }
  };

  const getRoleColor = (color) => {
    return color || '#2196f3';
  };

  const formatKey = (key) => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Pagination
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedRoles = filteredRoles.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredRoles.length / rowsPerPage);

  return (
    <PageContainer title="Roles Management" description="Manage user roles and permissions">
      <Box>
        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <SecurityIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="div">
                      {stats.total}
                    </Typography>
                    <Typography color="text.secondary">Total Roles</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'warning.main' }}>
                    <AdminIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="div">
                      {stats.system}
                    </Typography>
                    <Typography color="text.secondary">System Roles</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'success.main' }}>
                    <GroupIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="div">
                      {stats.custom}
                    </Typography>
                    <Typography color="text.secondary">Custom Roles</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'info.main' }}>
                    <PeopleIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="div">
                      {stats.totalUsers}
                    </Typography>
                    <Typography color="text.secondary">Total Users</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content */}
        <Card>
          <CardHeader
            title="Roles Management"
            action={
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/user-manage/roles/create')}
                disabled={loading}
              >
                Add New Role
              </Button>
            }
          />
          <Divider />
          <CardContent>
            {/* Filters */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  placeholder="Search roles..."
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
              <Grid size={{ xs: 12, md: 3 }}>
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
            </Grid>

            {/* Alerts */}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
                {success}
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            {/* Roles Table */}
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Role</TableCell>
                    <TableCell>Key</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Users</TableCell>
                    <TableCell>Permissions</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedRoles.map((role) => (
                    <TableRow key={role.id} hover>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar
                            sx={{
                              bgcolor: getRoleColor(role.color),
                              width: 32,
                              height: 32,
                              opacity: role.status === 'deleted' ? 0.5 : 1,
                            }}
                          >
                            {getRoleIcon(role.key)}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                textDecoration: role.status === 'deleted' ? 'line-through' : 'none',
                                opacity: role.status === 'deleted' ? 0.6 : 1,
                              }}
                            >
                              {role.name}
                            </Typography>
                            {role.status === 'deleted' && (
                              <Typography variant="caption" color="error">
                                Deleted
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={formatKey(role.key)}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {role.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={role.isSystem ? 'System' : 'Custom'}
                          size="small"
                          color={role.isSystem ? 'warning' : 'success'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Badge badgeContent={role.userCount} color="primary">
                          <PeopleIcon />
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {role.permissions?.length || 0} permissions
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="View Details">
                            <IconButton size="small" onClick={() => handleViewRole(role)}>
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          {role.status !== 'deleted' && (
                            <Tooltip title="Edit Role">
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditRole(role)}
                                  disabled={role.isSystem}
                                >
                                  <EditIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                          )}
                          {role.status === 'deleted' ? (
                            <>
                              <Tooltip title="Restore Role">
                                <IconButton
                                  size="small"
                                  onClick={() => handleRestore(role)}
                                  color="success"
                                >
                                  <RestoreIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Forever">
                                <span>
                                  <IconButton
                                    size="small"
                                    onClick={() => handlePermanentDelete(role)}
                                    color="error"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </>
                          ) : (
                            <Tooltip title="Delete Role">
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDelete(role)}
                                  disabled={role.isSystem || role.userCount > 0}
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
                  onChange={(event, value) => setPage(value)}
                  color="primary"
                />
              </Box>
            )}
          </CardContent>
        </Card>

        {/* View Role Dialog */}
        <Dialog open={viewDialogOpen} onClose={handleCloseViewDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                sx={{
                  bgcolor: getRoleColor(selectedRole?.color),
                  width: 40,
                  height: 40,
                }}
              >
                {selectedRole && getRoleIcon(selectedRole.key)}
              </Avatar>
              <Box>
                <Typography variant="h6">{selectedRole?.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedRole?.description}
                </Typography>
              </Box>
            </Stack>
          </DialogTitle>
          <DialogContent>
            {selectedRole && (
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Role Information
                  </Typography>
                  <Stack spacing={1}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Key:
                      </Typography>
                      <Chip
                        label={formatKey(selectedRole.key)}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Type:
                      </Typography>
                      <Chip
                        label={selectedRole.isSystem ? 'System Role' : 'Custom Role'}
                        size="small"
                        color={selectedRole.isSystem ? 'warning' : 'success'}
                        variant="outlined"
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Users:
                      </Typography>
                      <Typography variant="body2">
                        {selectedRole.userCount} users assigned
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Created:
                      </Typography>
                      <Typography variant="body2">
                        {new Date(selectedRole.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Permissions ({selectedRole.permissions?.length || 0})
                  </Typography>
                  <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                    {selectedRole.permissions?.map((permission) => {
                      const permissionInfo = allPermissions
                        .flatMap((cat) => cat.permissions)
                        .find((p) => p.key === permission);

                      return (
                        <Box key={permission} sx={{ mb: 1 }}>
                          <Typography variant="body2" fontWeight="medium">
                            {permissionInfo?.name || permission}
                          </Typography>
                          {permissionInfo?.description && (
                            <Typography variant="caption" color="text.secondary">
                              {permissionInfo.description}
                            </Typography>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseViewDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PageContainer>
  );
};

export default ListRoles;
