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
  FormControlLabel,
  Switch,
  Chip,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  LocalOffer as CouponIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import PageContainer from 'src/components/container/PageContainer.jsx';
import { createCoupon, generateCouponCode } from '../../../api/coupons/CouponsData.js';

const AddCoupon = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    type: 'percentage',
    value: '',
    minimumAmount: '',
    maximumDiscount: '',
    usageLimit: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    status: 'active',
    applicableProducts: [],
    applicableCategories: [],
  });

  const typeOptions = [
    { value: 'percentage', label: 'Percentage' },
    { value: 'fixed', label: 'Fixed Amount' },
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'scheduled', label: 'Scheduled' },
  ];

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleGenerateCode = () => {
    const generatedCode = generateCouponCode('COUPON', 8);
    setFormData((prev) => ({
      ...prev,
      code: generatedCode,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      if (!formData.code.trim()) {
        throw new Error('Coupon code is required');
      }
      if (!formData.name.trim()) {
        throw new Error('Coupon name is required');
      }
      if (!formData.value || formData.value <= 0) {
        throw new Error('Coupon value must be greater than 0');
      }
      if (!formData.endDate) {
        throw new Error('End date is required');
      }

      // Validate dates
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (endDate <= startDate) {
        throw new Error('End date must be after start date');
      }

      // Create coupon
      const newCoupon = await createCoupon(formData);
      setSuccess('Coupon created successfully!');

      // Reset form
      setFormData({
        code: '',
        name: '',
        description: '',
        type: 'percentage',
        value: '',
        minimumAmount: '',
        maximumDiscount: '',
        usageLimit: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        status: 'active',
        applicableProducts: [],
        applicableCategories: [],
      });

      // Navigate to coupons list after a short delay
      setTimeout(() => {
        navigate('/main-store/coupons/list');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to create coupon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer title="Add New Coupon" description="Create a new coupon">
      <Box>
        {/* Header */}
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/main-store/coupons/list')}
          >
            Back to Coupons
          </Button>
          <Typography variant="h4" component="h1">
            Add New Coupon
          </Typography>
        </Box>

        {/* Form */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <CouponIcon color="primary" />
                  <Typography variant="h6">Coupon Information</Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    {/* Coupon Code */}
                    <Grid size={{ xs: 12, md: 8 }}>
                      <TextField
                        fullWidth
                        label="Coupon Code"
                        value={formData.code}
                        onChange={handleChange('code')}
                        required
                        placeholder="Enter coupon code"
                        inputProps={{ style: { textTransform: 'uppercase' } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={handleGenerateCode}
                        sx={{ height: '56px' }}
                      >
                        Generate Code
                      </Button>
                    </Grid>

                    {/* Coupon Name */}
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Coupon Name"
                        value={formData.name}
                        onChange={handleChange('name')}
                        required
                        placeholder="Enter coupon name"
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
                        rows={3}
                        placeholder="Enter coupon description"
                      />
                    </Grid>

                    {/* Type and Value */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControl fullWidth>
                        <InputLabel>Discount Type</InputLabel>
                        <Select
                          value={formData.type}
                          onChange={handleChange('type')}
                          label="Discount Type"
                        >
                          {typeOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label={
                          formData.type === 'percentage' ? 'Percentage (%)' : 'Fixed Amount ($)'
                        }
                        value={formData.value}
                        onChange={handleChange('value')}
                        type="number"
                        required
                        inputProps={{ min: 0, step: formData.type === 'percentage' ? 1 : 0.01 }}
                      />
                    </Grid>

                    {/* Minimum Amount and Maximum Discount */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Minimum Order Amount ($)"
                        value={formData.minimumAmount}
                        onChange={handleChange('minimumAmount')}
                        type="number"
                        inputProps={{ min: 0, step: 0.01 }}
                        placeholder="0"
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Maximum Discount ($)"
                        value={formData.maximumDiscount}
                        onChange={handleChange('maximumDiscount')}
                        type="number"
                        inputProps={{ min: 0, step: 0.01 }}
                        placeholder="No limit"
                        disabled={formData.type === 'fixed'}
                      />
                    </Grid>

                    {/* Usage Limit */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Usage Limit"
                        value={formData.usageLimit}
                        onChange={handleChange('usageLimit')}
                        type="number"
                        inputProps={{ min: 1 }}
                        placeholder="Unlimited"
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

                    {/* Dates */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Start Date"
                        type="date"
                        value={formData.startDate}
                        onChange={handleChange('startDate')}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="End Date"
                        type="date"
                        value={formData.endDate}
                        onChange={handleChange('endDate')}
                        required
                        InputLabelProps={{ shrink: true }}
                      />
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
                        {loading ? 'Creating...' : 'Create Coupon'}
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => navigate('/main-store/coupons/list')}
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
                  Coupon Preview
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box textAlign="center">
                  <Chip
                    label={formData.code || 'COUPON_CODE'}
                    color="primary"
                    variant="outlined"
                    sx={{ fontSize: '1.1rem', fontWeight: 'bold', mb: 2 }}
                  />

                  <Typography variant="h6" gutterBottom>
                    {formData.name || 'Coupon Name'}
                  </Typography>

                  {formData.description && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {formData.description}
                    </Typography>
                  )}

                  <Box mt={2}>
                    <Typography variant="h5" color="primary" gutterBottom>
                      {formData.type === 'percentage'
                        ? `${formData.value || 0}% OFF`
                        : `$${formData.value || 0} OFF`}
                    </Typography>
                  </Box>

                  {formData.minimumAmount && (
                    <Typography variant="body2" color="text.secondary">
                      Min. order: ${formData.minimumAmount}
                    </Typography>
                  )}

                  {formData.maximumDiscount && formData.type === 'percentage' && (
                    <Typography variant="body2" color="text.secondary">
                      Max. discount: ${formData.maximumDiscount}
                    </Typography>
                  )}

                  {formData.usageLimit && (
                    <Typography variant="body2" color="text.secondary">
                      Usage limit: {formData.usageLimit}
                    </Typography>
                  )}

                  <Box mt={2}>
                    <Typography variant="body2" color="text.secondary">
                      Valid: {formData.startDate} to {formData.endDate || 'TBD'}
                    </Typography>
                  </Box>

                  <Box mt={2}>
                    <Chip
                      label={formData.status}
                      color={formData.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
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

export default AddCoupon;
