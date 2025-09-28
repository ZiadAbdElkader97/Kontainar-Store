import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Stack,
  Alert,
  Grid,
  IconButton,
  Avatar,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import PageContainer from 'src/components/container/PageContainer.jsx';

const AddCategory = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('📁');
  const [color, setColor] = useState('#1976d2');
  const [status, setStatus] = useState('active');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    '🚗',
    '✈️',
    '🏖️',
    '🎨',
    '🔧',
    '💊',
    '📦',
    '🎯',
    '🌟',
    '💎',
  ];

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

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Category name is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Generate simple ID
      const id = Date.now().toString();

      // Generate slug
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const newCategory = {
        id,
        name: name.trim(),
        description: description.trim(),
        icon,
        color,
        status,
        slug,
        image: imagePreview, // Store base64 image
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Get existing categories
      const existingCategories = JSON.parse(localStorage.getItem('categories') || '[]');

      // Check if name exists
      const nameExists = existingCategories.some(
        (cat) => cat.name.toLowerCase() === name.toLowerCase(),
      );

      if (nameExists) {
        setError('Category name already exists!');
        setLoading(false);
        return;
      }

      // Add new category
      const updatedCategories = [...existingCategories, newCategory];
      localStorage.setItem('categories', JSON.stringify(updatedCategories));

      setSuccess('Category added successfully!');

      // Reset form
      setName('');
      setDescription('');
      setIcon('📁');
      setColor('#1976d2');
      setStatus('active');
      setImage(null);
      setImagePreview(null);

      // Navigate after 2 seconds
      setTimeout(() => {
        navigate('/main-store/categories/list');
      }, 2000);
    } catch (err) {
      setError('Failed to add category');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer title="Add Category" description="Add new category">
      <Box sx={{ width: '100%', p: 3 }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
          <IconButton onClick={() => navigate('/main-store/categories/list')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h3" component="h1" fontWeight="bold">
            Add New Category
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

        <Grid container spacing={4}>
          {/* Left Column - Form */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card elevation={3}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                  Category Information
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                  <Stack spacing={3}>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Category Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          variant="outlined"
                          helperText="Enter a unique category name"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel>Status</InputLabel>
                          <Select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            label="Status"
                          >
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="inactive">Inactive</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>

                    <TextField
                      fullWidth
                      label="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      multiline
                      rows={4}
                      variant="outlined"
                      helperText="Describe what this category is for"
                    />

                    <Divider />

                    <Typography variant="h6" gutterBottom>
                      Visual Settings
                    </Typography>

                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Choose Icon
                        </Typography>
                        <Paper
                          sx={{
                            p: 2,
                            maxHeight: 200,
                            overflow: 'auto',
                            backgroundColor: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          <Stack direction="row" flexWrap="wrap" spacing={1}>
                            {predefinedIcons.map((iconEmoji) => (
                              <Chip
                                key={iconEmoji}
                                label={iconEmoji}
                                onClick={() => setIcon(iconEmoji)}
                                variant={icon === iconEmoji ? 'filled' : 'outlined'}
                                sx={{
                                  fontSize: '1.2rem',
                                  cursor: 'pointer',
                                  backgroundColor:
                                    icon === iconEmoji ? theme.palette.primary.main : 'transparent',
                                  color:
                                    icon === iconEmoji
                                      ? theme.palette.primary.contrastText
                                      : 'inherit',
                                  borderColor: theme.palette.divider,
                                  '&:hover': {
                                    transform: 'scale(1.1)',
                                    backgroundColor:
                                      theme.palette.mode === 'dark' ? 'grey.700' : 'grey.100',
                                  },
                                }}
                              />
                            ))}
                          </Stack>
                        </Paper>
                        <TextField
                          fullWidth
                          label="Custom Icon"
                          value={icon}
                          onChange={(e) => setIcon(e.target.value)}
                          sx={{ mt: 2 }}
                          helperText="Enter a custom emoji"
                        />
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Choose Color
                        </Typography>
                        <Paper
                          sx={{
                            p: 2,
                            backgroundColor: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          <Stack direction="row" flexWrap="wrap" spacing={1} sx={{ mb: 2 }}>
                            {predefinedColors.map((colorValue) => (
                              <Box
                                key={colorValue}
                                sx={{
                                  width: 40,
                                  height: 40,
                                  backgroundColor: colorValue,
                                  borderRadius: 1,
                                  cursor: 'pointer',
                                  border:
                                    color === colorValue
                                      ? `3px solid ${
                                          theme.palette.mode === 'dark' ? '#fff' : '#000'
                                        }`
                                      : `2px solid ${theme.palette.divider}`,
                                  '&:hover': {
                                    transform: 'scale(1.1)',
                                    boxShadow:
                                      theme.palette.mode === 'dark'
                                        ? '0 0 10px rgba(255,255,255,0.3)'
                                        : '0 0 10px rgba(0,0,0,0.3)',
                                  },
                                }}
                                onClick={() => setColor(colorValue)}
                              />
                            ))}
                          </Stack>
                          <TextField
                            fullWidth
                            label="Custom Color"
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                  borderColor: theme.palette.divider,
                                },
                              },
                            }}
                          />
                        </Paper>
                      </Grid>
                    </Grid>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Image Upload & Preview */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Card elevation={3}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                  Category Image
                </Typography>

                {/* Image Upload */}
                <Box sx={{ mb: 3 }}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="image-upload"
                    type="file"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUploadIcon />}
                      fullWidth
                      sx={{ py: 2 }}
                    >
                      Upload Image
                    </Button>
                  </label>
                </Box>

                {/* Image Preview */}
                {imagePreview && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Preview:
                    </Typography>
                    <Box sx={{ position: 'relative', display: 'inline-block' }}>
                      <Avatar
                        src={imagePreview}
                        sx={{
                          width: 200,
                          height: 200,
                          mx: 'auto',
                          border: `3px solid ${color}`,
                          boxShadow:
                            theme.palette.mode === 'dark'
                              ? '0 4px 20px rgba(0,0,0,0.5)'
                              : '0 4px 20px rgba(0,0,0,0.2)',
                        }}
                        variant="rounded"
                      />
                      <IconButton
                        onClick={handleRemoveImage}
                        sx={{
                          position: 'absolute',
                          top: -10,
                          right: -10,
                          backgroundColor: 'error.main',
                          color: 'white',
                          '&:hover': { backgroundColor: 'error.dark' },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                )}

                {/* Category Preview */}
                <Box sx={{ mt: 4 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Category Preview:
                  </Typography>
                  <Paper
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow:
                          theme.palette.mode === 'dark'
                            ? '0 4px 20px rgba(255,255,255,0.1)'
                            : '0 4px 20px rgba(0,0,0,0.1)',
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        mx: 'auto',
                        mb: 2,
                        backgroundColor: color,
                        fontSize: '2rem',
                        boxShadow:
                          theme.palette.mode === 'dark'
                            ? '0 4px 12px rgba(0,0,0,0.3)'
                            : '0 4px 12px rgba(0,0,0,0.2)',
                      }}
                    >
                      {icon}
                    </Avatar>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        color: theme.palette.text.primary,
                        fontWeight: 600,
                      }}
                    >
                      {name || 'Category Name'}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        minHeight: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {description || 'Category description will appear here'}
                    </Typography>
                    <Chip
                      label={status}
                      color={status === 'active' ? 'success' : 'error'}
                      size="small"
                      sx={{
                        mt: 1,
                        fontWeight: 500,
                      }}
                    />
                  </Paper>
                </Box>

                {/* Action Buttons */}
                <Stack spacing={2} sx={{ mt: 4 }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<SaveIcon />}
                    onClick={handleSubmit}
                    disabled={loading || !name.trim()}
                    fullWidth
                  >
                    {loading ? 'Adding...' : 'Add Category'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/main-store/categories/list')}
                    disabled={loading}
                    fullWidth
                  >
                    Cancel
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default AddCategory;
