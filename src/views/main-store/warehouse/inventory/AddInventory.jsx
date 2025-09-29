import React, { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  InputAdornment,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import PageContainer from 'src/components/container/PageContainer.jsx';
import { createInventoryItem, getAllSuppliers } from '../../../../api/warehouse/warehouseService.js';

const AddInventory = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [productName, setProductName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [currentStock, setCurrentStock] = useState(0);
  const [minStock, setMinStock] = useState(0);
  const [maxStock, setMaxStock] = useState(100);
  const [unitCost, setUnitCost] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [location, setLocation] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [status, setStatus] = useState('active');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categories = [
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Sports',
    'Books',
    'Toys',
    'Health & Beauty',
    'Automotive',
    'Food & Beverage',
    'Other'
  ];

  const locations = [
    'A-01-01', 'A-01-02', 'A-01-03', 'A-02-01', 'A-02-02', 'A-02-03',
    'B-01-01', 'B-01-02', 'B-01-03', 'B-02-01', 'B-02-02', 'B-02-03',
    'C-01-01', 'C-01-02', 'C-01-03', 'C-02-01', 'C-02-02', 'C-02-03'
  ];

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const suppliersData = await getAllSuppliers();
      setSuppliers(suppliersData);
    } catch (error) {
      console.error('Error loading suppliers:', error);
      setError('Failed to load suppliers');
    }
  };

  const generateSKU = () => {
    if (productName && category) {
      const categoryPrefix = category.substring(0, 3).toUpperCase();
      const productPrefix = productName.substring(0, 3).toUpperCase().replace(/\s/g, '');
      const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      setSku(`${categoryPrefix}-${productPrefix}-${randomSuffix}`);
    }
  };

  useEffect(() => {
    generateSKU();
  }, [productName, category]);

  const validateForm = () => {
    if (!productName.trim()) {
      setError('Product name is required');
      return false;
    }
    if (!sku.trim()) {
      setError('SKU is required');
      return false;
    }
    if (!category) {
      setError('Category is required');
      return false;
    }
    if (!location) {
      setError('Location is required');
      return false;
    }
    if (!supplierId) {
      setError('Supplier is required');
      return false;
    }
    if (minStock < 0) {
      setError('Minimum stock cannot be negative');
      return false;
    }
    if (maxStock <= minStock) {
      setError('Maximum stock must be greater than minimum stock');
      return false;
    }
    if (currentStock < 0) {
      setError('Current stock cannot be negative');
      return false;
    }
    if (unitCost < 0) {
      setError('Unit cost cannot be negative');
      return false;
    }
    if (sellingPrice < 0) {
      setError('Selling price cannot be negative');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const inventoryData = {
        productName: productName.trim(),
        sku: sku.trim().toUpperCase(),
        category,
        currentStock: parseInt(currentStock),
        minStock: parseInt(minStock),
        maxStock: parseInt(maxStock),
        unitCost: parseFloat(unitCost),
        sellingPrice: parseFloat(sellingPrice),
        location,
        supplierId,
        status,
      };

      const newItem = await createInventoryItem(inventoryData);
      
      if (newItem) {
        setSuccess('Inventory item created successfully!');
        setTimeout(() => {
          navigate('/main-store/warehouse/inventory/list');
        }, 1500);
      } else {
        setError('Failed to create inventory item');
      }
    } catch (err) {
      setError(err.message || 'Failed to create inventory item');
      console.error('Error creating inventory item:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setError('');
    setSuccess('');
  };

  const calculateTotalValue = () => {
    return currentStock * unitCost;
  };

  return (
    <PageContainer title="Add Inventory Item">
      <Box>
        {/* Header */}
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton
            onClick={() => navigate('/main-store/warehouse/inventory/list')}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            Add Inventory Item
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

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Product Information */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Product Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Product Name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                        placeholder="Enter product name"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="SKU"
                        value={sku}
                        onChange={(e) => setSku(e.target.value.toUpperCase())}
                        required
                        placeholder="Auto-generated or enter manually"
                        helperText="Stock Keeping Unit - unique identifier"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControl fullWidth required>
                        <InputLabel>Category</InputLabel>
                        <Select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          label="Category"
                        >
                          {categories.map((cat) => (
                            <MenuItem key={cat} value={cat}>
                              {cat}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControl fullWidth required>
                        <InputLabel>Location</InputLabel>
                        <Select
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          label="Location"
                        >
                          {locations.map((loc) => (
                            <MenuItem key={loc} value={loc}>
                              {loc}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControl fullWidth required>
                        <InputLabel>Supplier</InputLabel>
                        <Select
                          value={supplierId}
                          onChange={(e) => setSupplierId(e.target.value)}
                          label="Supplier"
                        >
                          {suppliers.map((supplier) => (
                            <MenuItem key={supplier.id} value={supplier.id}>
                              {supplier.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControl fullWidth>
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
                </CardContent>
              </Card>

              {/* Stock Information */}
              <Card sx={{ mt: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Stock Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        fullWidth
                        label="Current Stock"
                        type="number"
                        value={currentStock}
                        onChange={(e) => setCurrentStock(parseInt(e.target.value) || 0)}
                        inputProps={{ min: 0 }}
                        required
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        fullWidth
                        label="Minimum Stock"
                        type="number"
                        value={minStock}
                        onChange={(e) => setMinStock(parseInt(e.target.value) || 0)}
                        inputProps={{ min: 0 }}
                        required
                        helperText="Alert when stock falls below this level"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        fullWidth
                        label="Maximum Stock"
                        type="number"
                        value={maxStock}
                        onChange={(e) => setMaxStock(parseInt(e.target.value) || 100)}
                        inputProps={{ min: 1 }}
                        required
                        helperText="Maximum capacity for this item"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Pricing Information */}
              <Card sx={{ mt: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Pricing Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Unit Cost"
                        type="number"
                        value={unitCost}
                        onChange={(e) => setUnitCost(parseFloat(e.target.value) || 0)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        inputProps={{ min: 0, step: 0.01 }}
                        required
                        helperText="Cost to purchase this item"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Selling Price"
                        type="number"
                        value={sellingPrice}
                        onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        inputProps={{ min: 0, step: 0.01 }}
                        required
                        helperText="Price to sell this item"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Summary */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Inventory Summary
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Stack spacing={2}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">Product:</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {productName || 'Not specified'}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">SKU:</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {sku || 'Not specified'}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">Category:</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {category || 'Not specified'}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">Location:</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {location || 'Not specified'}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">Current Stock:</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {currentStock}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">Stock Range:</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {minStock} - {maxStock}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">Unit Cost:</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        ${unitCost.toFixed(2)}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">Selling Price:</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        ${sellingPrice.toFixed(2)}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">Profit Margin:</Typography>
                      <Typography 
                        variant="body2" 
                        fontWeight="bold"
                        color={sellingPrice > unitCost ? 'success.main' : 'error.main'}
                      >
                        {unitCost > 0 ? 
                          `${(((sellingPrice - unitCost) / unitCost) * 100).toFixed(1)}%` : 
                          'N/A'
                        }
                      </Typography>
                    </Box>
                    <Divider />
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="h6">Total Value:</Typography>
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        ${calculateTotalValue().toLocaleString()}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack spacing={2} sx={{ mt: 3 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      startIcon={loading ? <Box sx={{ width: 20, height: 20 }} /> : <SaveIcon />}
                      disabled={loading}
                    >
                      {loading ? 'Creating...' : 'Create Inventory Item'}
                    </Button>
                    
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => navigate('/main-store/warehouse/inventory/list')}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </form>
      </Box>
    </PageContainer>
  );
};

export default AddInventory;
