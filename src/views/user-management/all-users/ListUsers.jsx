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
  Avatar,
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
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  SupervisorAccount as ManagerIcon,
  PersonPin as UserIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Restore as RestoreIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Security as SecurityIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  FilterList as FilterIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer.jsx';
import {
  getAllUsers,
  deleteUser,
  permanentDeleteUser,
  restoreUser,
  toggleUserStatus,
  searchUsers,
  getUsersByStatus,
  getUsersByRole,
  getUserStats,
  verifyUserEmail,
  verifyUserPhone,
  toggleTwoFactorAuth,
} from '../../../api/user-management/AllUsersData.js';

const ListUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    deleted: 0,
    admins: 0,
    managers: 0,
    users: 0,
  });

  const statusOptions = [
    { value: 'all', label: 'All Users' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'deleted', label: 'Deleted' },
  ];

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'admin', label: 'Administrator' },
    { value: 'manager', label: 'Manager' },
    { value: 'user', label: 'User' },
  ];

  useEffect(() => {
    loadUsers();
    loadStats();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, statusFilter, roleFilter]);

  const loadUsers = () => {
    try {
      const allUsers = getAllUsers();
      setUsers(allUsers);
    } catch (err) {
      setError('Failed to load users');
    }
  };

  const loadStats = () => {
    try {
      const userStats = getUserStats();
      setStats(userStats);
    } catch (err) {
      setError('Failed to load statistics');
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Search filter
    if (searchQuery) {
      filtered = searchUsers(searchQuery);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
    setPage(1); // Reset to first page when filtering
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleStatusFilter = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleRoleFilter = (event) => {
    setRoleFilter(event.target.value);
  };

  const handleView = (id) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      setSelectedUser(user);
      setViewDialogOpen(true);
    }
  };

  const closeViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedUser(null);
  };

  const handleDelete = (id) => {
    const user = users.find((u) => u.id === id);

    if (user.status === 'deleted') {
      // Second delete - permanent deletion
      if (
        window.confirm(
          'This user is already deleted. Are you sure you want to permanently remove them? This action cannot be undone.',
        )
      ) {
        try {
          permanentDeleteUser(id);
          setSuccess('User permanently deleted!');
          loadUsers();
          loadStats();

          // Auto-hide success message after 6 seconds
          setTimeout(() => {
            setSuccess('');
          }, 6000);
        } catch (err) {
          setError('Failed to permanently delete user');
        }
      }
    } else {
      // First delete - soft delete
      if (
        window.confirm(
          'Are you sure you want to delete this user? You can restore them later or permanently delete them.',
        )
      ) {
        try {
          deleteUser(id);
          setSuccess('User deleted successfully! You can restore them or permanently delete them.');
          loadUsers();
          loadStats();

          // Auto-hide success message after 6 seconds
          setTimeout(() => {
            setSuccess('');
          }, 6000);
        } catch (err) {
          setError('Failed to delete user');
        }
      }
    }
  };

  const handleRestore = (id) => {
    if (window.confirm('Are you sure you want to restore this user?')) {
      try {
        restoreUser(id);
        setSuccess('User restored successfully!');
        loadUsers();
        loadStats();

        // Auto-hide success message after 6 seconds
        setTimeout(() => {
          setSuccess('');
        }, 6000);
      } catch (err) {
        setError('Failed to restore user');
      }
    }
  };

  const handleToggleStatus = (id) => {
    try {
      const user = users.find((u) => u.id === id);

      // Only show success message if the toggle will actually change the status
      if (user && (user.status === 'active' || user.status === 'inactive')) {
        toggleUserStatus(id);
        setSuccess('User status updated successfully!');

        // Auto-hide success message after 6 seconds
        setTimeout(() => {
          setSuccess('');
        }, 6000);
      } else {
        // For other statuses (deleted), just toggle without message
        toggleUserStatus(id);
      }

      loadUsers();
      loadStats();
    } catch (err) {
      setError('Failed to update user status');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <ActiveIcon color="success" />;
      case 'inactive':
        return <InactiveIcon color="error" />;
      case 'deleted':
        return <DeleteIcon color="error" />;
      default:
        return <InactiveIcon color="disabled" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'deleted':
        return 'error';
      default:
        return 'default';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <AdminIcon color="error" />;
      case 'manager':
        return <ManagerIcon color="warning" />;
      case 'user':
        return <UserIcon color="success" />;
      default:
        return <PersonIcon color="disabled" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'manager':
        return 'warning';
      case 'user':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  const formatLastLogin = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Pagination
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  return (
    <PageContainer title="List Users" description="Manage all users in the system">
      <Box>
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgb(27, 27, 48) 0%, #16213e 100%)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                List Users
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Manage and monitor all users in the system
              </Typography>
            </Box>
            <Avatar sx={{ width: 80, height: 80, bgcolor: 'rgba(255,255,255,0.2)' }}>
              <PersonIcon sx={{ fontSize: 40 }} />
            </Avatar>
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

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {stats.total}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Total Users
                    </Typography>
                  </Box>
                  <PersonIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #0f4c3a 0%, #1b5e20 100%)'
                    : 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)',
                color: 'white',
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {stats.active}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Active Users
                    </Typography>
                  </Box>
                  <ActiveIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #4a148c 0%, #7b1fa2 100%)'
                    : 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
                color: 'white',
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {stats.admins}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Administrators
                    </Typography>
                  </Box>
                  <AdminIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #b71c1c 0%, #d32f2f 100%)'
                    : 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)',
                color: 'white',
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {stats.deleted}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Deleted Users
                    </Typography>
                  </Box>
                  <DeleteIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Action Bar */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={handleSearch}
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
                  <InputLabel>Status</InputLabel>
                  <Select value={statusFilter} onChange={handleStatusFilter} label="Status">
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, md: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select value={roleFilter} onChange={handleRoleFilter} label="Role">
                    {roleOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, md: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/user-manage/users/create')}
                >
                  New User
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader
            title={`Users (${filteredUsers.length})`}
            subheader="Manage user accounts and permissions"
          />
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Last Login</TableCell>
                    <TableCell>Join Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedUsers.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar
                            sx={{
                              bgcolor: user.avatar ? 'transparent' : 'primary.main',
                              width: 40,
                              height: 40,
                            }}
                          >
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={`${user.firstName} ${user.lastName}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
                            )}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {user.firstName} {user.lastName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {user.email}
                            </Typography>
                            <Box display="flex" gap={1} mt={0.5}>
                              {user.isEmailVerified && (
                                <Tooltip title="Email Verified">
                                  <EmailIcon color="success" sx={{ fontSize: 16 }} />
                                </Tooltip>
                              )}
                              {user.isPhoneVerified && (
                                <Tooltip title="Phone Verified">
                                  <PhoneIcon color="success" sx={{ fontSize: 16 }} />
                                </Tooltip>
                              )}
                              {user.twoFactorEnabled && (
                                <Tooltip title="2FA Enabled">
                                  <SecurityIcon color="info" sx={{ fontSize: 16 }} />
                                </Tooltip>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          {getRoleIcon(user.role)}
                          <Chip
                            label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            color={getRoleColor(user.role)}
                            size="small"
                          />
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <BusinessIcon color="action" sx={{ fontSize: 16 }} />
                          <Typography variant="body2">{user.department}</Typography>
                        </Box>
                        {user.position && (
                          <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                            <WorkIcon color="action" sx={{ fontSize: 14 }} />
                            <Typography variant="caption" color="text.secondary">
                              {user.position}
                            </Typography>
                          </Box>
                        )}
                      </TableCell>

                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          {getStatusIcon(user.status)}
                          <Chip
                            label={user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                            color={getStatusColor(user.status)}
                            size="small"
                          />
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2">{formatLastLogin(user.lastLogin)}</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2">{formatDate(user.joinDate)}</Typography>
                      </TableCell>

                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Tooltip title="View Details">
                            <IconButton
                              onClick={() => handleView(user.id)}
                              color="info"
                              size="small"
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>

                          {user.status !== 'deleted' && (
                            <>
                              <Tooltip title="Edit User">
                                <IconButton
                                  onClick={() => navigate(`/user-manage/users/edit/${user.id}`)}
                                  color="primary"
                                  size="small"
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Toggle Status">
                                <IconButton
                                  onClick={() => handleToggleStatus(user.id)}
                                  color={user.status === 'active' ? 'warning' : 'success'}
                                  size="small"
                                >
                                  {user.status === 'active' ? <InactiveIcon /> : <ActiveIcon />}
                                </IconButton>
                              </Tooltip>
                            </>
                          )}

                          {user.status === 'deleted' && (
                            <Tooltip title="Restore User">
                              <IconButton
                                onClick={() => handleRestore(user.id)}
                                color="success"
                                size="small"
                              >
                                <RestoreIcon />
                              </IconButton>
                            </Tooltip>
                          )}

                          <Tooltip
                            title={
                              user.status === 'deleted' ? 'Permanently Delete User' : 'Delete User'
                            }
                          >
                            <IconButton
                              onClick={() => handleDelete(user.id)}
                              color="error"
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={3}>
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

        {/* View Details Dialog */}
        <Dialog open={viewDialogOpen} onClose={closeViewDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                sx={{
                  bgcolor: selectedUser?.avatar ? 'transparent' : 'primary.main',
                  width: 50,
                  height: 50,
                }}
              >
                {selectedUser?.avatar ? (
                  <img
                    src={selectedUser.avatar}
                    alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  `${selectedUser?.firstName?.charAt(0)}${selectedUser?.lastName?.charAt(0)}`
                )}
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {selectedUser?.firstName} {selectedUser?.lastName} - Details
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedUser?.email}
                </Typography>
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedUser && (
              <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Basic Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Full Name
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedUser.firstName} {selectedUser.lastName}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email Address
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedUser.email}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Phone Number
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedUser.phone}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Role
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    {getRoleIcon(selectedUser.role)}
                    <Chip
                      label={selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                      color={getRoleColor(selectedUser.role)}
                      size="small"
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Department
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedUser.department}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Position
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedUser.position}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    {getStatusIcon(selectedUser.status)}
                    <Chip
                      label={
                        selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)
                      }
                      color={getStatusColor(selectedUser.status)}
                      size="small"
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Join Date
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {formatDate(selectedUser.joinDate)}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Last Login
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {formatLastLogin(selectedUser.lastLogin)}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Created At
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {formatDate(selectedUser.createdAt)}
                  </Typography>
                </Grid>

                {/* Security Information */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                    Security Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email Verified
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    {selectedUser.isEmailVerified ? (
                      <CheckIcon color="success" />
                    ) : (
                      <CancelIcon color="error" />
                    )}
                    <Typography variant="body2">
                      {selectedUser.isEmailVerified ? 'Verified' : 'Not Verified'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Phone Verified
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    {selectedUser.isPhoneVerified ? (
                      <CheckIcon color="success" />
                    ) : (
                      <CancelIcon color="error" />
                    )}
                    <Typography variant="body2">
                      {selectedUser.isPhoneVerified ? 'Verified' : 'Not Verified'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Two-Factor Authentication
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    {selectedUser.twoFactorEnabled ? (
                      <CheckIcon color="success" />
                    ) : (
                      <CancelIcon color="error" />
                    )}
                    <Typography variant="body2">
                      {selectedUser.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </Typography>
                  </Box>
                </Grid>

                {/* Permissions */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                    Permissions
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {selectedUser.permissions?.map((permission) => (
                      <Chip
                        key={permission}
                        label={permission.charAt(0).toUpperCase() + permission.slice(1)}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={closeViewDialog}>Close</Button>
            {selectedUser?.status !== 'deleted' && (
              <Button
                onClick={() => {
                  closeViewDialog();
                  navigate(`/user-management/all-users/edit/${selectedUser.id}`);
                }}
                variant="contained"
                startIcon={<EditIcon />}
              >
                Edit User
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    </PageContainer>
  );
};

export default ListUsers;
