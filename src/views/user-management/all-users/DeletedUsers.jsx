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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Stack,
} from '@mui/material';
import {
  Search as SearchIcon,
  Restore as RestoreIcon,
  DeleteForever as DeleteForeverIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  SupervisorAccount as ManagerIcon,
  PersonPin as UserIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Security as SecurityIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer.jsx';
import {
  getUsersByStatus,
  permanentDeleteUser,
  restoreUser,
  searchUsers,
} from '../../../api/user-management/AllUsersData.js';

const DeletedUsers = () => {
  const navigate = useNavigate();
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'admin', label: 'Administrator' },
    { value: 'manager', label: 'Manager' },
    { value: 'user', label: 'User' },
  ];

  useEffect(() => {
    loadDeletedUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [deletedUsers, searchQuery, roleFilter]);

  const loadDeletedUsers = () => {
    try {
      const deleted = getUsersByStatus('deleted');
      setDeletedUsers(deleted);
    } catch (err) {
      setError('Failed to load deleted users');
    }
  };

  const filterUsers = () => {
    let filtered = [...deletedUsers];

    // Search filter
    if (searchQuery) {
      const searchResults = searchUsers(searchQuery);
      filtered = searchResults.filter((user) => user.status === 'deleted');
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

  const handleRoleFilter = (event) => {
    setRoleFilter(event.target.value);
  };

  const handleRestore = (id) => {
    if (window.confirm('Are you sure you want to restore this user?')) {
      try {
        restoreUser(id);
        setSuccess('User restored successfully!');
        loadDeletedUsers();

        // Auto-hide success message after 6 seconds
        setTimeout(() => {
          setSuccess('');
        }, 6000);
      } catch (err) {
        setError('Failed to restore user');
      }
    }
  };

  const handlePermanentDelete = (id) => {
    if (
      window.confirm(
        'Are you sure you want to permanently delete this user? This action cannot be undone and all user data will be lost.',
      )
    ) {
      try {
        permanentDeleteUser(id);
        setSuccess('User permanently deleted!');
        loadDeletedUsers();

        // Auto-hide success message after 6 seconds
        setTimeout(() => {
          setSuccess('');
        }, 6000);
      } catch (err) {
        setError('Failed to permanently delete user');
      }
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
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  };

  const formatDeletedDate = (dateString) => {
    if (!dateString) return 'Unknown';
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
    <PageContainer title="Deleted Users" description="Manage deleted user accounts">
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
                Deleted Users
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Manage deleted user accounts - restore or permanently remove
              </Typography>
            </Box>
            <Avatar sx={{ width: 80, height: 80, bgcolor: 'rgba(255,255,255,0.2)' }}>
              <DeleteForeverIcon sx={{ fontSize: 40 }} />
            </Avatar>
          </Box>
        </Paper>

        {/* Back Button */}
        <Box mb={3}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/user-manage/users/list')}
            variant="outlined"
          >
            Back to Users List
          </Button>
        </Box>

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

        {/* Statistics */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
                      {deletedUsers.length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Total Deleted Users
                    </Typography>
                  </Box>
                  <DeleteForeverIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
                      {deletedUsers.filter((u) => u.role === 'admin').length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Deleted Admins
                    </Typography>
                  </Box>
                  <AdminIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
                      {deletedUsers.filter((u) => u.role === 'user').length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Deleted Regular Users
                    </Typography>
                  </Box>
                  <UserIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Action Bar */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  placeholder="Search deleted users..."
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

              <Grid size={{ xs: 12, md: 4 }}>
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
                  variant="outlined"
                  onClick={() => navigate('/user-manage/users/list')}
                >
                  View All Users
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Deleted Users Table */}
        <Card>
          <CardHeader
            title={`Deleted Users (${filteredUsers.length})`}
            subheader="Restore or permanently delete user accounts"
          />
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Deleted Date</TableCell>
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
                              bgcolor: user.avatar ? 'transparent' : 'error.main',
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
                        <Typography variant="body2" color="error.main">
                          {formatDeletedDate(user.deletedAt)}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2">{formatDate(user.joinDate)}</Typography>
                      </TableCell>

                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Tooltip title="Restore User">
                            <IconButton
                              onClick={() => handleRestore(user.id)}
                              color="success"
                              size="small"
                            >
                              <RestoreIcon />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Permanently Delete">
                            <IconButton
                              onClick={() => handlePermanentDelete(user.id)}
                              color="error"
                              size="small"
                            >
                              <DeleteForeverIcon />
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

            {/* Empty State */}
            {filteredUsers.length === 0 && (
              <Box textAlign="center" py={4}>
                <DeleteForeverIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No deleted users found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchQuery || roleFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria'
                    : 'All users are currently active'}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </PageContainer>
  );
};

export default DeletedUsers;
