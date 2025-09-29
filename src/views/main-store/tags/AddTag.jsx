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
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import PageContainer from 'src/components/container/PageContainer.jsx';
import { createTag } from '../../../api/tags/TagsData.js';

const AddTag = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#1976d2');
  const [status, setStatus] = useState('active');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Tag name is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const tagData = {
        name: name.trim(),
        description: description.trim(),
        color,
        status,
      };

      const newTag = await createTag(tagData);

      if (newTag) {
        setSuccess('Tag added successfully!');
      } else {
        setError('Failed to create tag');
      }

      // Reset form
      setName('');
      setDescription('');
      setColor('#1976d2');
      setStatus('active');

      // Navigate after 2 seconds
      setTimeout(() => {
        navigate('/main-store/tags/list');
      }, 2000);
    } catch (err) {
      setError('Failed to add tag');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer title="Add Tag" description="Add new tag">
      <Box sx={{ width: '100%', p: 3 }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
          <IconButton onClick={() => navigate('/tags/list')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h3" component="h1" fontWeight="bold">
            Add New Tag
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
                  Tag Information
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                  <Stack spacing={3}>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Tag Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          variant="outlined"
                          helperText="Enter a unique tag name"
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
                      helperText="Describe what this tag is for"
                    />

                    <Divider />

                    <Typography variant="h6" gutterBottom>
                      Visual Settings
                    </Typography>

                    <Grid container spacing={3}>
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

          {/* Right Column - Preview */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Card elevation={3}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                  Tag Preview
                </Typography>

                {/* Tag Preview */}
                <Box sx={{ mt: 4 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Tag Preview:
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
                    <Chip
                      label={name || 'Tag Name'}
                      sx={{
                        backgroundColor: color,
                        color: 'white',
                        fontSize: '1rem',
                        fontWeight: 600,
                        height: 40,
                        px: 2,
                        mb: 2,
                        boxShadow:
                          theme.palette.mode === 'dark'
                            ? '0 4px 12px rgba(0,0,0,0.3)'
                            : '0 4px 12px rgba(0,0,0,0.2)',
                      }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        minHeight: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                      }}
                    >
                      {description || 'Tag description will appear here'}
                    </Typography>
                    <Chip
                      label={status}
                      color={status === 'active' ? 'success' : 'error'}
                      size="small"
                      sx={{
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
                    {loading ? 'Adding...' : 'Add Tag'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/tags/list')}
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

export default AddTag;
