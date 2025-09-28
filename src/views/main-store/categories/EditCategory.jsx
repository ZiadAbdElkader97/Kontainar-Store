import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Alert,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';
import PageContainer from 'src/components/container/PageContainer.jsx';

const EditCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    color: '#1976d2',
    status: 'active',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadCategory();
  }, [id]);

  const loadCategory = () => {
    try {
      const categories = JSON.parse(localStorage.getItem('categories') || '[]');
      const category = categories.find((cat) => cat.id === id);

      if (category) {
        setFormData({
          name: category.name,
          description: category.description,
          icon: category.icon,
          color: category.color,
          status: category.status,
        });
      } else {
        setError('Category not found');
      }
    } catch (error) {
      console.error('Error loading category:', error);
      setError('Failed to load category');
    }
  };

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Generate slug from name
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const updatedCategory = {
        id: id,
        name: formData.name,
        description: formData.description,
        icon: formData.icon,
        color: formData.color,
        status: formData.status,
        slug: slug,
        updatedAt: new Date().toISOString(),
      };

      // Get existing categories from localStorage
      const existingCategories = JSON.parse(localStorage.getItem('categories') || '[]');

      // Check if category name already exists (excluding current category)
      const nameExists = existingCategories.some(
        (cat) => cat.id !== id && cat.name.toLowerCase() === formData.name.toLowerCase(),
      );

      if (nameExists) {
        setError('Category name already exists!');
        setLoading(false);
        return;
      }

      // Update category
      const updatedCategories = existingCategories.map((cat) =>
        cat.id === id ? { ...cat, ...updatedCategory } : cat,
      );

      localStorage.setItem('categories', JSON.stringify(updatedCategories));

      setSuccess('Category updated successfully!');

      // Navigate to list after 2 seconds
      setTimeout(() => {
        navigate('/main-store/categories/list');
      }, 2000);
    } catch (err) {
      setError('Failed to update category. Please try again.');
      console.error('Error updating category:', err);
    } finally {
      setLoading(false);
    }
  };

  const predefinedColors = [
    '#1976d2',
    '#dc004e',
    '#9c27b0',
    '#673ab7',
    '#3f51b5',
    '#2196f3',
    '#03a9f4',
    '#00bcd4',
    '#009688',
    '#4caf50',
    '#8bc34a',
    '#cddc39',
    '#ffeb3b',
    '#ffc107',
    '#ff9800',
    '#ff5722',
    '#795548',
    '#607d8b',
    '#9e9e9e',
    '#000000',
  ];

  const predefinedIcons = [
    '🏠',
    '👕',
    '👟',
    '🎒',
    '⌚',
    '📱',
    '💻',
    '🎮',
    '📚',
    '🎵',
    '🎬',
    '🏃',
    '🍕',
    '☕',
    '🍰',
    '🌮',
    '🍔',
    '🥗',
    '🍎',
    '🥤',
  ];

  return (
    <PageContainer title="Edit Category" description="Edit product category">
      <Box>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <IconButton onClick={() => navigate('/main-store/categories/list')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            Edit Category
          </Typography>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Card>
          <CardContent>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Category Name"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    required
                    helperText="Enter a unique category name"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth required>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status}
                      onChange={handleInputChange('status')}
                      label="Status"
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={formData.description}
                    onChange={handleInputChange('description')}
                    multiline
                    rows={3}
                    helperText="Describe what this category is for"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="h6" gutterBottom>
                    <PaletteIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Choose Icon
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {predefinedIcons.map((icon) => (
                      <Chip
                        key={icon}
                        label={icon}
                        onClick={() => setFormData({ ...formData, icon })}
                        variant={formData.icon === icon ? 'filled' : 'outlined'}
                        sx={{ fontSize: '1.2rem', cursor: 'pointer' }}
                      />
                    ))}
                  </Box>
                  <TextField
                    fullWidth
                    label="Custom Icon (Emoji)"
                    value={formData.icon}
                    onChange={handleInputChange('icon')}
                    placeholder="Enter an emoji or icon"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="h6" gutterBottom>
                    <PaletteIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Choose Color
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {predefinedColors.map((color) => (
                      <Box
                        key={color}
                        sx={{
                          width: 40,
                          height: 40,
                          backgroundColor: color,
                          borderRadius: 1,
                          cursor: 'pointer',
                          border: formData.color === color ? '3px solid #000' : '1px solid #ccc',
                          '&:hover': {
                            transform: 'scale(1.1)',
                          },
                        }}
                        onClick={() => setFormData({ ...formData, color })}
                      />
                    ))}
                  </Box>
                  <TextField
                    fullWidth
                    label="Custom Color"
                    type="color"
                    value={formData.color}
                    onChange={handleInputChange('color')}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/main-store/categories/list')}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<SaveIcon />}
                      disabled={loading || !formData.name}
                    >
                      {loading ? 'Updating...' : 'Update Category'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </PageContainer>
  );
};

export default EditCategory;
