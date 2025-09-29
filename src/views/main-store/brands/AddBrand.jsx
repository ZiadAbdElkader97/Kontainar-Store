import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Alert,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import PageContainer from 'src/components/container/PageContainer.jsx';
import { createBrand } from '../../../api/brands/BrandsData.js';

const AddBrand = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
    website: '',
    country: '',
    foundedYear: '',
    status: 'active',
  });

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error('Brand name is required');
      }

      // Create brand
      const newBrand = await createBrand(formData);
      setSuccess('Brand created successfully!');

      // Reset form
      setFormData({
        name: '',
        description: '',
        logo: '',
        website: '',
        country: '',
        foundedYear: '',
        status: 'active',
      });

      // Navigate to brands list after a short delay
      setTimeout(() => {
        navigate('/main-store/brands/list');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to create brand');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer title="Add New Brand" description="Create a new brand">
      <Box>
        {/* Header */}
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/main-store/brands/list')}
          >
            Back to Brands
          </Button>
          <Typography variant="h4" component="h1">
            Add New Brand
          </Typography>
        </Box>

        {/* Form */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <BusinessIcon color="primary" />
                  <Typography variant="h6">Brand Information</Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    {/* Brand Name */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Brand Name"
                        value={formData.name}
                        onChange={handleChange('name')}
                        required
                        placeholder="Enter brand name"
                      />
                    </Grid>

                    {/* Country */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Country"
                        value={formData.country}
                        onChange={handleChange('country')}
                        placeholder="Enter country"
                      />
                    </Grid>

                    {/* Website */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Website"
                        value={formData.website}
                        onChange={handleChange('website')}
                        placeholder="https://www.example.com"
                        type="url"
                      />
                    </Grid>

                    {/* Founded Year */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Founded Year"
                        value={formData.foundedYear}
                        onChange={handleChange('foundedYear')}
                        placeholder="e.g., 1976"
                        type="number"
                        inputProps={{ min: 1800, max: new Date().getFullYear() }}
                      />
                    </Grid>

                    {/* Logo URL */}
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Logo URL"
                        value={formData.logo}
                        onChange={handleChange('logo')}
                        placeholder="https://example.com/logo.png"
                        type="url"
                      />
                    </Grid>

                    {/* Description */}
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Description"
                        value={formData.description}
                        onChange={handleChange('description')}
                        multiline
                        rows={4}
                        placeholder="Enter brand description"
                      />
                    </Grid>

                    {/* Status */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={formData.status}
                          onChange={handleChange('status')}
                          label="Status"
                        >
                          {statusOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  {/* Submit Button */}
                  <Box mt={4}>
                    <Stack direction="row" spacing={2}>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={<SaveIcon />}
                        disabled={loading}
                        size="large"
                      >
                        {loading ? 'Creating...' : 'Create Brand'}
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => navigate('/main-store/brands/list')}
                        disabled={loading}
                        size="large"
                      >
                        Cancel
                      </Button>
                    </Stack>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Grid>

          {/* Preview Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Brand Preview
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box textAlign="center">
                  {formData.logo ? (
                    <Box
                      component="img"
                      src={formData.logo}
                      alt={formData.name || 'Brand Logo'}
                      sx={{
                        width: 100,
                        height: 100,
                        objectFit: 'contain',
                        mb: 2,
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 100,
                        height: 100,
                        border: '2px dashed #e0e0e0',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        mx: 'auto',
                      }}
                    >
                      <BusinessIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                    </Box>
                  )}

                  <Typography variant="h6" gutterBottom>
                    {formData.name || 'Brand Name'}
                  </Typography>

                  {formData.country && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {formData.country}
                    </Typography>
                  )}

                  {formData.foundedYear && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Founded: {formData.foundedYear}
                    </Typography>
                  )}

                  {formData.description && (
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      {formData.description}
                    </Typography>
                  )}

                  {formData.website && (
                    <Typography variant="body2" color="primary" sx={{ mt: 2 }}>
                      {formData.website}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Success/Error Messages */}
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </PageContainer>
  );
};

export default AddBrand;
