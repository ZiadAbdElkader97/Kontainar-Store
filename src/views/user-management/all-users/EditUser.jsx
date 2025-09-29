import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  TextField,
  Typography,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Avatar,
  IconButton,
  InputAdornment,
  FormControlLabel,
  FormGroup,
  Checkbox,
  LinearProgress,
} from '@mui/material';
import {
  Save as SaveIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  ArrowBack as ArrowBackIcon,
  AdminPanelSettings as AdminIcon,
  SupervisorAccount as ManagerIcon,
  PersonPin as UserIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer.jsx';
import { getUserById, updateUser } from '../../../api/user-management/AllUsersData.js';

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'user',
    department: '',
    position: '',
    permissions: [],
  });

  const roleOptions = [
    { value: 'admin', label: 'Administrator', color: 'error' },
    { value: 'manager', label: 'Manager', color: 'warning' },
    { value: 'user', label: 'User', color: 'success' },
  ];

  const departmentOptions = [
    'IT',
    'Sales',
    'Marketing',
    'HR',
    'Finance',
    'Operations',
    'Customer Service',
    'Research & Development',
  ];

  const permissionOptions = [
    { value: 'read', label: 'Read Access' },
    { value: 'write', label: 'Write Access' },
    { value: 'delete', label: 'Delete Access' },
    { value: 'admin', label: 'Admin Access' },
  ];

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = () => {
    try {
      const userData = getUserById(id);
      if (userData) {
        setUser(userData);
        setFormData({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone,
          role: userData.role,
          department: userData.department,
          position: userData.position,
          permissions: userData.permissions || [],
        });
      } else {
        setError('User not found');
      }
    } catch (err) {
      setError('Failed to load user data');
    }
  };

  const handleInputChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handlePermissionChange = (permission) => (event) => {
    setFormData((prev) => ({
      ...prev,
      permissions: event.target.checked
        ? [...prev.permissions, permission]
        : prev.permissions.filter((p) => p !== permission),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateUser(id, formData);
      setSuccess('User updated successfully!');

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
        navigate('/user-manage/users/list');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to update user');
    } finally {
      setLoading(false);
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
        return <UserIcon color="disabled" />;
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

  if (!user) {
    return (
      <PageContainer title="Edit User" description="Edit user information">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <LinearProgress />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Edit User" description="Edit user information">
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
                Edit User
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Update user information and permissions
              </Typography>
            </Box>
            <Avatar sx={{ width: 80, height: 80, bgcolor: 'rgba(255,255,255,0.2)' }}>
              <EditIcon sx={{ fontSize: 40 }} />
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

        {/* Form */}
        <Card>
          <CardHeader title="User Information" subheader="Update the user details below" />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Personal Information */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Personal Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange('firstName')}
                    required
                    variant="outlined"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange('lastName')}
                    required
                    variant="outlined"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange('phone')}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                  />
                </Grid>

                {/* Role and Department */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                    Role & Department
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Role</InputLabel>
                    <Select value={formData.role} onChange={handleInputChange('role')} label="Role">
                      {roleOptions.map((role) => (
                        <MenuItem key={role.value} value={role.value}>
                          <Box display="flex" alignItems="center" gap={1}>
                            {getRoleIcon(role.value)}
                            <Chip label={role.label} color={role.color} size="small" />
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Department</InputLabel>
                    <Select
                      value={formData.department}
                      onChange={handleInputChange('department')}
                      label="Department"
                    >
                      {departmentOptions.map((dept) => (
                        <MenuItem key={dept} value={dept}>
                          {dept}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Position/Job Title"
                    value={formData.position}
                    onChange={handleInputChange('position')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <WorkIcon />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                  />
                </Grid>

                {/* Permissions */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                    Permissions
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <FormControl component="fieldset" variant="outlined">
                    <FormGroup>
                      {permissionOptions.map((permission) => (
                        <FormControlLabel
                          key={permission.value}
                          control={
                            <Checkbox
                              checked={formData.permissions.includes(permission.value)}
                              onChange={handlePermissionChange(permission.value)}
                            />
                          }
                          label={permission.label}
                        />
                      ))}
                    </FormGroup>
                  </FormControl>
                </Grid>

                {/* Submit Button */}
                <Grid size={{ xs: 12 }}>
                  <Box display="flex" justifyContent="flex-end" gap={2} sx={{ mt: 3 }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/user-manage/users/list')}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={loading ? <LinearProgress size={16} /> : <SaveIcon />}
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'Update User'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Box>
    </PageContainer>
  );
};

export default EditUser;
