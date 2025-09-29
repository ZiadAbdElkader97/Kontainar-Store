import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer.jsx';
import { createRole, getAllPermissions } from '../../../api/user-management/RolesData.js';

const AddNewRole = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    key: '',
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

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await createRole(formData);
      setSuccess('Role created successfully');

      // Reset form
      setFormData({
        name: '',
        key: '',
        description: '',
        permissions: [],
        color: '#2196f3',
      });

      // Navigate to list after 2 seconds
      setTimeout(() => {
        navigate('/user-manage/roles/list');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to create role');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (permissionKey, checked) => {
    setFormData((prev) => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permissionKey]
        : prev.permissions.filter((p) => p !== permissionKey),
    }));
  };

  const handleCategoryPermissionChange = (categoryPermissions, checked) => {
    const permissionKeys = categoryPermissions.map((p) => p.key);
    setFormData((prev) => ({
      ...prev,
      permissions: checked
        ? [...new Set([...prev.permissions, ...permissionKeys])]
        : prev.permissions.filter((p) => !permissionKeys.includes(p)),
    }));
  };

  return (
    <PageContainer title="Add New Role" description="Create a new role with specific permissions">
      <Box>
        <Card>
          <CardHeader
            title={
              <Stack direction="row" alignItems="center" spacing={2}>
                <SecurityIcon color="primary" />
                <Typography variant="h5">Add New Role</Typography>
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
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                    placeholder="e.g., Sales Manager"
                  />

                  <TextField
                    fullWidth
                    label="Role Key"
                    value={formData.key}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        key: e.target.value.toLowerCase().replace(/\s+/g, '_'),
                      }))
                    }
                    required
                    placeholder="e.g., sales_manager"
                    helperText="Unique identifier for the role (auto-generated from name)"
                  />

                  <TextField
                    fullWidth
                    label="Description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    multiline
                    rows={3}
                    placeholder="Describe the role's purpose and responsibilities"
                  />

                  <FormControl fullWidth>
                    <InputLabel>Color</InputLabel>
                    <Select
                      value={formData.color}
                      label="Color"
                      onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
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
                  Permissions
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
                  {allPermissions.map((category) => (
                    <Box key={category.category} sx={{ mb: 3 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={category.permissions.every((p) =>
                              formData.permissions.includes(p.key),
                            )}
                            indeterminate={
                              category.permissions.some((p) =>
                                formData.permissions.includes(p.key),
                              ) &&
                              !category.permissions.every((p) =>
                                formData.permissions.includes(p.key),
                              )
                            }
                            onChange={(e) =>
                              handleCategoryPermissionChange(category.permissions, e.target.checked)
                            }
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
                                onChange={(e) =>
                                  handlePermissionChange(permission.key, e.target.checked)
                                }
                              />
                            }
                            label={
                              <Box>
                                <Typography variant="body2">{permission.name}</Typography>
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
                disabled={loading || !formData.name || !formData.key}
              >
                Create Role
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </PageContainer>
  );
};

export default AddNewRole;
