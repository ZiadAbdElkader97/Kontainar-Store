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
  Autocomplete,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Store as StoreIcon,
  Business as BusinessIcon,
  AccountBalance as AccountBalanceIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer.jsx';
import {
  createSeller,
  getSellerByEmail,
  getSellerBySellerId,
  getAllBusinessTypes,
  getAllTags,
} from '../../../api/user-management/SellersData.js';

const AddNewSeller = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [businessTypes, setBusinessTypes] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: 'Egypt',
      zipCode: '',
    },
    sellerId: '',
    businessName: '',
    businessType: '',
    businessLicense: '',
    taxId: '',
    commissionRate: 10,
    status: 'pending',
    verificationStatus: 'pending',
    bankAccount: {
      bankName: '',
      accountNumber: '',
      accountHolderName: '',
    },
    paymentMethod: 'bank_transfer',
    storeSettings: {
      storeName: '',
      storeDescription: '',
      storeCategories: [],
    },
    socialMedia: {
      website: '',
      facebook: '',
      instagram: '',
      twitter: '',
    },
    tags: [],
    notes: '',
  });

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  const businessTypeOptions = [
    'electronics',
    'fashion',
    'beauty',
    'home_garden',
    'sports',
    'books',
    'toys',
    'automotive',
    'health',
    'food',
    'jewelry',
    'art',
    'music',
    'office_supplies',
    'pet_supplies',
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'suspended', label: 'Suspended' },
  ];

  const verificationOptions = [
    { value: 'verified', label: 'Verified' },
    { value: 'pending', label: 'Pending Verification' },
  ];

  const paymentMethodOptions = [
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'stripe', label: 'Stripe' },
    { value: 'cash', label: 'Cash' },
  ];

  const predefinedTags = [
    'Electronics',
    'Fashion',
    'Beauty',
    'Home & Garden',
    'Sports',
    'Books',
    'Toys',
    'Automotive',
    'Health',
    'Food',
    'Jewelry',
    'Art',
    'Music',
    'Office Supplies',
    'Pet Supplies',
    'Verified',
    'Top Seller',
    'New Seller',
    'Premium',
    'Local',
  ];

  const storeCategoryOptions = [
    'Electronics',
    'Fashion',
    'Beauty',
    'Home & Garden',
    'Sports',
    'Books',
    'Toys',
    'Automotive',
    'Health',
    'Food',
    'Jewelry',
    'Art',
    'Music',
    'Office Supplies',
    'Pet Supplies',
    'Accessories',
    'Shoes',
    'Furniture',
    'Gadgets',
    'Outdoor',
  ];

  useEffect(() => {
    loadBusinessTypes();
    loadTags();
  }, []);

  const loadBusinessTypes = () => {
    try {
      const allBusinessTypes = getAllBusinessTypes();
      const allBusinessTypesList = [...new Set([...businessTypeOptions, ...allBusinessTypes])];
      setBusinessTypes(allBusinessTypesList.sort());
    } catch (err) {
      setError('Failed to load business types');
    }
  };

  const loadTags = () => {
    try {
      const existingTags = getAllTags();
      const allTags = [...new Set([...predefinedTags, ...existingTags])];
      setAvailableTags(allTags.sort());
    } catch (err) {
      setError('Failed to load tags');
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleTagsChange = (event, newTags) => {
    setFormData((prev) => ({
      ...prev,
      tags: newTags,
    }));
  };

  const handleStoreCategoriesChange = (event, newCategories) => {
    setFormData((prev) => ({
      ...prev,
      storeSettings: {
        ...prev.storeSettings,
        storeCategories: newCategories,
      },
    }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (!formData.sellerId.trim()) {
      setError('Seller ID is required');
      return false;
    }
    if (!formData.businessName.trim()) {
      setError('Business name is required');
      return false;
    }
    if (!formData.businessType.trim()) {
      setError('Business type is required');
      return false;
    }
    if (!formData.businessLicense.trim()) {
      setError('Business license is required');
      return false;
    }
    if (!formData.taxId.trim()) {
      setError('Tax ID is required');
      return false;
    }
    if (!formData.commissionRate || formData.commissionRate <= 0) {
      setError('Valid commission rate is required');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Phone validation (basic)
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Please enter a valid phone number');
      return false;
    }

    // Check if email already exists
    const existingSeller = getSellerByEmail(formData.email);
    if (existingSeller) {
      setError('Seller with this email already exists');
      return false;
    }

    // Check if seller ID already exists
    const existingSellerId = getSellerBySellerId(formData.sellerId);
    if (existingSellerId) {
      setError('Seller with this seller ID already exists');
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
      // Convert commission rate to number
      const sellerData = {
        ...formData,
        commissionRate: parseFloat(formData.commissionRate),
      };

      await createSeller(sellerData);
      setSuccess('Seller created successfully');

      // Auto-hide success message after 3 seconds and navigate
      setTimeout(() => {
        setSuccess('');
        navigate('/user-manage/sellers/list');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to create seller');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/user-manage/sellers/list');
  };

  return (
    <PageContainer title="Add New Seller" description="Create a new seller account">
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={handleCancel} variant="outlined">
              Back to Sellers
            </Button>
          </Stack>
          <Typography variant="h4" gutterBottom>
            Add New Seller
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create a new seller account with business and personal information
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
                {/* Personal Information */}
                <Grid size={{ xs: 12 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <PersonIcon />
                    Personal Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter first name"
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter last name"
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="seller@company.com"
                    required
                    helperText="This will be used for login and notifications"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+201234567890"
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={formData.gender}
                      label="Gender"
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                    >
                      {genderOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Business Information */}
                <Grid size={{ xs: 12 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <StoreIcon />
                    Business Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Seller ID"
                    value={formData.sellerId}
                    onChange={(e) => handleInputChange('sellerId', e.target.value)}
                    placeholder="SELL001"
                    required
                    helperText="Unique seller identifier"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Business Name"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    placeholder="e.g., ABC Electronics"
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth required>
                    <InputLabel>Business Type</InputLabel>
                    <Select
                      value={formData.businessType}
                      label="Business Type"
                      onChange={(e) => handleInputChange('businessType', e.target.value)}
                    >
                      {businessTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type.replace('_', ' ').toUpperCase()}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Business License"
                    value={formData.businessLicense}
                    onChange={(e) => handleInputChange('businessLicense', e.target.value)}
                    placeholder="BL123456"
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Tax ID"
                    value={formData.taxId}
                    onChange={(e) => handleInputChange('taxId', e.target.value)}
                    placeholder="TAX123456789"
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Commission Rate (%)"
                    type="number"
                    value={formData.commissionRate}
                    onChange={(e) => handleInputChange('commissionRate', e.target.value)}
                    placeholder="10"
                    required
                    helperText="Percentage commission for each sale"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status}
                      label="Status"
                      onChange={(e) => handleInputChange('status', e.target.value)}
                    >
                      {statusOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Verification Status</InputLabel>
                    <Select
                      value={formData.verificationStatus}
                      label="Verification Status"
                      onChange={(e) => handleInputChange('verificationStatus', e.target.value)}
                    >
                      {verificationOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Bank Account Information */}
                <Grid size={{ xs: 12 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <AccountBalanceIcon />
                    Bank Account Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Bank Name"
                    value={formData.bankAccount.bankName}
                    onChange={(e) => handleInputChange('bankAccount.bankName', e.target.value)}
                    placeholder="National Bank of Egypt"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Account Number"
                    value={formData.bankAccount.accountNumber}
                    onChange={(e) => handleInputChange('bankAccount.accountNumber', e.target.value)}
                    placeholder="1234567890"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Account Holder Name"
                    value={formData.bankAccount.accountHolderName}
                    onChange={(e) =>
                      handleInputChange('bankAccount.accountHolderName', e.target.value)
                    }
                    placeholder="Account holder name"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      value={formData.paymentMethod}
                      label="Payment Method"
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    >
                      {paymentMethodOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Store Settings */}
                <Grid size={{ xs: 12 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <BusinessIcon />
                    Store Settings
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Store Name"
                    value={formData.storeSettings.storeName}
                    onChange={(e) => handleInputChange('storeSettings.storeName', e.target.value)}
                    placeholder="e.g., ABC Electronics Store"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Autocomplete
                    multiple
                    options={storeCategoryOptions}
                    value={formData.storeSettings.storeCategories}
                    onChange={handleStoreCategoriesChange}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          variant="outlined"
                          label={option}
                          {...getTagProps({ index })}
                          key={option}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Store Categories"
                        placeholder="Select store categories"
                        helperText="Select relevant categories for the store"
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Store Description"
                    value={formData.storeSettings.storeDescription}
                    onChange={(e) =>
                      handleInputChange('storeSettings.storeDescription', e.target.value)
                    }
                    placeholder="Describe your store and products"
                    multiline
                    rows={3}
                  />
                </Grid>

                {/* Social Media */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Social Media Links
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Website"
                    value={formData.socialMedia.website}
                    onChange={(e) => handleInputChange('socialMedia.website', e.target.value)}
                    placeholder="https://example.com"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Facebook"
                    value={formData.socialMedia.facebook}
                    onChange={(e) => handleInputChange('socialMedia.facebook', e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Instagram"
                    value={formData.socialMedia.instagram}
                    onChange={(e) => handleInputChange('socialMedia.instagram', e.target.value)}
                    placeholder="https://instagram.com/yourpage"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Twitter"
                    value={formData.socialMedia.twitter}
                    onChange={(e) => handleInputChange('socialMedia.twitter', e.target.value)}
                    placeholder="https://twitter.com/yourpage"
                  />
                </Grid>

                {/* Tags */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Tags
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Autocomplete
                    multiple
                    options={availableTags}
                    value={formData.tags}
                    onChange={handleTagsChange}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          variant="outlined"
                          label={option}
                          {...getTagProps({ index })}
                          key={option}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tags"
                        placeholder="Select or add tags"
                        helperText="Add tags to categorize the seller"
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Additional notes about the seller"
                    multiline
                    rows={3}
                    helperText="Optional notes about the seller"
                  />
                </Grid>

                {/* Form Actions */}
                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 2 }} />
                  <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button variant="outlined" onClick={handleCancel} disabled={loading}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<SaveIcon />}
                      disabled={loading}
                    >
                      {loading ? 'Creating...' : 'Create Seller'}
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

export default AddNewSeller;
