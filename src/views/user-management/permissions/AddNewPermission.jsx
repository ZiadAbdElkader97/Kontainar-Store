import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  LinearProgress,
  Stack,
  Chip,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Divider,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer.jsx';
import {
  createPermission,
  getAllCategories,
  getPermissionByKey,
} from '../../../api/user-management/PermissionsData.js';

const AddNewPermission = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    key: '',
    description: '',
    category: '',
    actions: [],
  });

  const availableActions = [
    { value: 'read', label: 'Read', color: '#4caf50' },
    { value: 'create', label: 'Create', color: '#2196f3' },
    { value: 'update', label: 'Update', color: '#ff9800' },
    { value: 'delete', label: 'Delete', color: '#f44336' },
  ];

  const predefinedCategories = [
    'User Management',
    'E-commerce',
    'Analytics',
    'System',
    'Support',
    'Content',
    'Reports',
    'Settings',
    'Security',
    'Notifications',
  ];

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    try {
      const existingCategories = getAllCategories();
      const allCategories = [...new Set([...predefinedCategories, ...existingCategories])];
      setCategories(allCategories.sort());
    } catch (err) {
      setError('Failed to load categories');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-generate key from name
    if (field === 'name') {
      const key = value
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .trim();
      setFormData(prev => ({
        ...prev,
        key: key
      }));
    }
  };

  const handleActionChange = (action, checked) => {
    setFormData(prev => ({
      ...prev,
      actions: checked
        ? [...prev.actions, action]
        : prev.actions.filter(a => a !== action)
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Permission name is required');
      return false;
    }
    if (!formData.key.trim()) {
      setError('Permission key is required');
      return false;
    }
    if (!formData.category) {
      setError('Category is required');
      return false;
    }
    if (formData.actions.length === 0) {
      setError('At least one action is required');
      return false;
    }

    // Check if key already exists
    const existingPermission = getPermissionByKey(formData.key);
    if (existingPermission) {
      setError('Permission key already exists');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await createPermission(formData);
      setSuccess('Permission created successfully');
      
      // Auto-hide success message after 3 seconds and navigate
      setTimeout(() => {
        setSuccess('');
        navigate('/user-manage/permissions');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to create permission');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/user-manage/permissions');
  };

  return (
    <PageContainer title="Add New Permission" description="Create a new system permission">
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleCancel}
              variant="outlined"
            >
              Back to Permissions
            </Button>
          </Stack>
          <Typography variant="h4" gutterBottom>
            Add New Permission
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create a new system permission with specific actions and category
          </Typography>
        </Box>

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

        {/* Form */}
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SecurityIcon />
                    Basic Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Permission Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Product Management"
                    required
                    helperText="A descriptive name for the permission"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Permission Key"
                    value={formData.key}
                    onChange={(e) => handleInputChange('key', e.target.value)}
                    placeholder="e.g., product_management"
                    required
                    helperText="Unique identifier (auto-generated from name)"
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Brief description of what this permission allows"
                    multiline
                    rows={3}
                    helperText="Optional description explaining the permission's purpose"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth required>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={formData.category}
                      label="Category"
                      onChange={(e) => handleInputChange('category', e.target.value)}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Actions */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Available Actions
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Select the actions that this permission allows
                  </Typography>
                  <FormGroup>
                    <Grid container spacing={1}>
                      {availableActions.map((action) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={action.value}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formData.actions.includes(action.value)}
                                onChange={(e) => handleActionChange(action.value, e.target.checked)}
                                color="primary"
                              />
                            }
                            label={
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Chip
                                  label={action.label}
                                  size="small"
                                  sx={{
                                    bgcolor: action.color,
                                    color: 'white',
                                    fontSize: '0.75rem',
                                  }}
                                />
                                <Typography variant="body2">
                                  {action.value}
                                </Typography>
                              </Stack>
                            }
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </FormGroup>
                </Grid>

                {/* Selected Actions Preview */}
                {formData.actions.length > 0 && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Selected Actions:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {formData.actions.map((action) => {
                        const actionInfo = availableActions.find(a => a.value === action);
                        return (
                          <Chip
                            key={action}
                            label={actionInfo?.label || action}
                            size="small"
                            sx={{
                              bgcolor: actionInfo?.color || '#757575',
                              color: 'white',
                            }}
                          />
                        );
                      })}
                    </Stack>
                  </Grid>
                )}

                {/* Form Actions */}
                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 2 }} />
                  <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<SaveIcon />}
                      disabled={loading}
                    >
                      {loading ? 'Creating...' : 'Create Permission'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Box>
    </PageContainer>
  );
};

export default AddNewPermission;
