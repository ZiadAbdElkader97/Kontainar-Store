import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  CircularProgress,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import PageContainer from 'src/components/container/PageContainer.jsx';
import { getTagById, updateTag } from '../../../api/tags/TagsData.js';

const EditTag = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#1976d2');
  const [status, setStatus] = useState('active');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tag, setTag] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // الألوان المتاحة
  const availableColors = [
    '#1976d2',
    '#dc004e',
    '#4caf50',
    '#ff9800',
    '#9c27b0',
    '#f44336',
    '#00bcd4',
    '#795548',
    '#607d8b',
    '#e91e63',
    '#3f51b5',
    '#009688',
    '#ff5722',
    '#673ab7',
    '#ffc107',
  ];

  // تحميل بيانات التاج
  useEffect(() => {
    const loadTag = async () => {
      try {
        setInitialLoading(true);
        const tagData = await getTagById(id);
        if (tagData) {
          setTag(tagData);
          setName(tagData.name);
          setDescription(tagData.description || '');
          setColor(tagData.color || '#1976d2');
          setStatus(tagData.status || 'active');
        } else {
          setError('Tag not found');
        }
      } catch (err) {
        setError('Error loading tag');
        console.error('Error loading tag:', err);
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) {
      loadTag();
    }
  }, [id]);

  // معاينة التاج
  const tagPreview = {
    name: name || 'Tag name',
    color: color,
    status: status,
  };

  // التحقق من صحة البيانات
  const validateForm = () => {
    if (!name.trim()) {
      setError('Tag name is required');
      return false;
    }
    if (name.trim().length < 2) {
      setError('Tag name must be at least 2 characters');
      return false;
    }
    return true;
  };

  // حفظ التاج
  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const tagData = {
        name: name.trim(),
        description: description.trim(),
        color: color,
        status: status,
      };

      const updatedTag = await updateTag(id, tagData);

      if (updatedTag) {
        setSuccess('Tag updated successfully');
        setTimeout(() => {
          navigate('/main-store/tags/list');
        }, 1500);
      } else {
        setError('Error updating tag');
      }
    } catch (err) {
      setError(err.message || 'Error updating tag');
      console.error('Error updating tag:', err);
    } finally {
      setLoading(false);
    }
  };

  // إغلاق التنبيهات
  const handleCloseAlert = () => {
    setError('');
    setSuccess('');
  };

  if (initialLoading) {
    return (
      <PageContainer title="Edit Tag">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  if (!tag) {
    return (
      <PageContainer title="Edit Tag">
        <Alert severity="error" sx={{ mb: 2 }}>
          Tag not found
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/main-store/tags/list')}
        >
          Return to list
        </Button>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Edit Tag">
      <Box>
        {/* Header */}
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton onClick={() => navigate('/main-store/tags/list')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            Edit Tag: {tag.name}
          </Typography>
        </Box>

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={handleCloseAlert}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={handleCloseAlert}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Form */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tag Data
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Stack spacing={3}>
                  {/* اسم التاج */}
                  <TextField
                    fullWidth
                    label="Tag Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    error={!name.trim() && name !== ''}
                    helperText={!name.trim() && name !== '' ? 'Tag name is required' : ''}
                  />

                  {/* وصف التاج */}
                  <TextField
                    fullWidth
                    label="Tag Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    rows={3}
                    placeholder="Optional tag description..."
                  />

                  {/* لون التاج */}
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Tag Color
                    </Typography>
                    <Grid container spacing={1}>
                      {availableColors.map((colorOption) => (
                        <Grid item key={colorOption}>
                          <IconButton
                            onClick={() => setColor(colorOption)}
                            sx={{
                              width: 40,
                              height: 40,
                              backgroundColor: colorOption,
                              border:
                                color === colorOption
                                  ? `3px solid ${theme.palette.primary.main}`
                                  : '2px solid transparent',
                              '&:hover': {
                                transform: 'scale(1.1)',
                              },
                            }}
                          >
                            {color === colorOption && (
                              <Box
                                sx={{
                                  width: 20,
                                  height: 20,
                                  backgroundColor: 'white',
                                  borderRadius: '50%',
                                }}
                              />
                            )}
                          </IconButton>
                        </Grid>
                      ))}
                    </Grid>
                    <TextField
                      fullWidth
                      label="Color Code"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      sx={{ mt: 2 }}
                      placeholder="#1976d2"
                    />
                  </Box>

                  {/* حالة التاج */}
                  <FormControl fullWidth>
                    <InputLabel>Tag Status</InputLabel>
                    <Select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      label="Tag Status"
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Preview */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tag Preview
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box textAlign="center">
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      backgroundColor: tagPreview.color,
                      fontSize: '2rem',
                      mb: 2,
                      mx: 'auto',
                    }}
                  >
                    {tagPreview.name.charAt(0).toUpperCase()}
                  </Avatar>

                  <Typography variant="h6" gutterBottom>
                    {tagPreview.name}
                  </Typography>

                  <Chip
                    label={tagPreview.status === 'active' ? 'Active' : 'Inactive'}
                    color={tagPreview.status === 'active' ? 'success' : 'default'}
                    sx={{ mb: 2 }}
                  />

                  {description && (
                    <Typography variant="body2" color="text.secondary">
                      {description}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                    onClick={handleSave}
                    disabled={loading || !name.trim()}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>

                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate('/main-store/tags/list')}
                    disabled={loading}
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

export default EditTag;
