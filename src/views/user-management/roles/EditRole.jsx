import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Divider,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  FormControlLabel,
  FormGroup,
  Checkbox,
  LinearProgress,
  Stack,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer.jsx';
import { getRoleById, updateRole, getAllPermissions } from '../../../api/user-management/RolesData.js';

const EditRole = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [],
    color: '#2196f3',
  });

  const colorOptions = [
    { value: '#f44336', label: 'Red' },
    { value: '#ff9800', label: 'Orange' },
    { value: '#4caf50', label: 'Green' },
    { value: '#2196f3', label: 'Blue' },
    { value: '#9c27b0', label: 'Purple' },
    { value: '#607d8b', label: 'Blue Grey' },
    { value: '#795548', label: 'Brown' },
    { value: '#e91e63', label: 'Pink' },
  ];

  const allPermissions = getAllPermissions();

  useEffect(() => {
    loadRole();
  }, [id]);

  const loadRole = () => {
    try {
      setLoadingData(true);
      const roleData = getRoleById(id);
      
      if (!roleData) {
        setError('Role not found');
        return;
      }

      if (roleData.isSystem) {
        setError('Cannot edit system roles');
        return;
      }

      setRole(roleData);
      setFormData({
        name: roleData.name,
        description: roleData.description,
        permissions: roleData.permissions || [],
        color: roleData.color || '#2196f3',
      });
    } catch (err) {
      setError('Failed to load role');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateRole(id, formData);
      setSuccess('Role updated successfully');
      
      // Navigate to list after 2 seconds
      setTimeout(() => {
        navigate('/user-manage/roles/list');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to update role');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (permissionKey, checked) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permissionKey]
        : prev.permissions.filter(p => p !== permissionKey)
    }));
  };

  const handleCategoryPermissionChange = (categoryPermissions, checked) => {
    const permissionKeys = categoryPermissions.map(p => p.key);
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...new Set([...prev.permissions, ...permissionKeys])]
        : prev.permissions.filter(p => !permissionKeys.includes(p))
    }));
  };

  const getRoleIcon = (roleKey) => {
    switch (roleKey) {
      case 'admin':
        return '👑';
      case 'manager':
        return '👨‍💼';
      case 'user':
        return '👤';
      default:
        return '🔐';
    }
  };

  const formatKey = (key) => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loadingData) {
    return (
      <PageContainer title="Edit Role" description="Edit role information and permissions">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <LinearProgress sx={{ width: '100%' }} />
        </Box>
      </PageContainer>
    );
  }

  if (!role) {
    return (
      <PageContainer title="Edit Role" description="Edit role information and permissions">
        <Card>
          <CardContent>
            <Alert severity="error">
              Role not found or cannot be edited.
            </Alert>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/user-manage/roles/list')}
              sx={{ mt: 2 }}
            >
              Back to Roles
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Edit Role" description="Edit role information and permissions">
      <Box>
        <Card>
          <CardHeader
            title={
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{
                    bgcolor: formData.color,
                    width: 40,
                    height: 40,
                  }}
                >
                  {getRoleIcon(role.key)}
                </Avatar>
                <Box>
                  <Typography variant="h5">Edit Role</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {role.name}
                  </Typography>
                </Box>
              </Stack>
            }
            action={
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/user-manage/roles/list')}
                disabled={loading}
              >
                Back to Roles
              </Button>
            }
          />
          <Divider />
          <CardContent>
            {loading && <LinearProgress sx={{ mb: 2 }} />}
            
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

            {/* Role Info */}
            <Box sx={{ mb: 3, p: 2, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Chip
                  label={formatKey(role.key)}
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label={role.isSystem ? 'System Role' : 'Custom Role'}
                  color={role.isSystem ? 'warning' : 'success'}
                  variant="outlined"
                />
                <Typography variant="body2" color="text.secondary">
                  Created: {new Date(role.createdAt).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Users: {role.userCount}
                </Typography>
              </Stack>
            </Box>

            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Role Name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    placeholder="e.g., Sales Manager"
                  />
                  
                  <TextField
                    fullWidth
                    label="Role Key"
                    value={role.key}
                    disabled
                    helperText="Role key cannot be changed after creation"
                  />
                  
                  <TextField
                    fullWidth
                    label="Description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    multiline
                    rows={3}
                    placeholder="Describe the role's purpose and responsibilities"
                  />
                  
                  <FormControl fullWidth>
                    <InputLabel>Color</InputLabel>
                    <Select
                      value={formData.color}
                      label="Color"
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    >
                      {colorOptions.map((color) => (
                        <MenuItem key={color.value} value={color.value}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                bgcolor: color.value,
                                borderRadius: '50%',
                              }}
                            />
                            <Typography>{color.label}</Typography>
                          </Stack>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>

              {/* Permissions */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" gutterBottom>
                  Permissions ({formData.permissions.length})
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
                  {allPermissions.map((category) => (
                    <Box key={category.category} sx={{ mb: 3 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={category.permissions.every(p => formData.permissions.includes(p.key))}
                            indeterminate={
                              category.permissions.some(p => formData.permissions.includes(p.key)) &&
                              !category.permissions.every(p => formData.permissions.includes(p.key))
                            }
                            onChange={(e) => handleCategoryPermissionChange(category.permissions, e.target.checked)}
                          />
                        }
                        label={
                          <Typography variant="subtitle1" fontWeight="bold">
                            {category.category}
                          </Typography>
                        }
                      />
                      <Box sx={{ ml: 4 }}>
                        {category.permissions.map((permission) => (
                          <FormControlLabel
                            key={permission.key}
                            control={
                              <Checkbox
                                checked={formData.permissions.includes(permission.key)}
                                onChange={(e) => handlePermissionChange(permission.key, e.target.checked)}
                              />
                            }
                            label={
                              <Box>
                                <Typography variant="body2">
                                  {permission.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {permission.description}
                                </Typography>
                              </Box>
                            }
                          />
                        ))}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/user-manage/roles/list')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSubmit}
                disabled={loading || !formData.name}
              >
                Update Role
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </PageContainer>
  );
};

export default EditRole;
