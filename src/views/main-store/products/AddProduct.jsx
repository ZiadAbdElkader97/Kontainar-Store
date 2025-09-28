import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  Typography,
  Stack,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  Divider,
  IconButton,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import PageContainer from 'src/components/container/PageContainer';
import { addNewProduct } from '../../../services/productsService';
import s1 from 'src/assets/images/products/s1.jpg';

const AddProduct = () => {
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);

  // بيانات المنتج
  const [productData, setProductData] = useState({
    title: '',
    description: '',
    price: '',
    discount: '',
    category: '',
    subcategory: '',
    gender: 'Unisex',
    brand: '',
    colors: [],
    sizes: [],
    stock: '',
    isActive: true,
    tags: [],
    specifications: {
      display: '',
      processor: '',
      camera: '',
      battery: '',
      storage: '',
      material: '',
      weight: '',
      features: '',
    },
  });

  // قوائم الخيارات
  const categories = ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Beauty'];
  const genders = ['Men', 'Women', 'Unisex'];
  const commonColors = [
    '#000000',
    '#FFFFFF',
    '#RED',
    '#BLUE',
    '#GREEN',
    '#YELLOW',
    '#PINK',
    '#PURPLE',
    '#ORANGE',
    '#GRAY',
    '#BROWN',
    '#GOLD',
    '#SILVER',
  ];
  const commonSizes = [
    'XS',
    'S',
    'M',
    'L',
    'XL',
    'XXL',
    '28',
    '30',
    '32',
    '34',
    '36',
    '38',
    '40',
    '42',
    '44',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '128GB',
    '256GB',
    '512GB',
    '1TB',
    '2TB',
    '4TB',
    'One Size',
  ];

  const handleInputChange = (field, value) => {
    setProductData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSpecificationChange = (field, value) => {
    setProductData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [field]: value,
      },
    }));
  };

  const handleAddColor = (color) => {
    if (!productData.colors.includes(color)) {
      setProductData((prev) => ({
        ...prev,
        colors: [...prev.colors, color],
      }));
    }
  };

  const handleRemoveColor = (color) => {
    setProductData((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c !== color),
    }));
  };

  const handleAddSize = (size) => {
    if (!productData.sizes.includes(size)) {
      setProductData((prev) => ({
        ...prev,
        sizes: [...prev.sizes, size],
      }));
    }
  };

  const handleRemoveSize = (size) => {
    setProductData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((s) => s !== size),
    }));
  };

  const handleAddTag = (tag) => {
    if (tag && !productData.tags.includes(tag.toLowerCase())) {
      setProductData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag.toLowerCase()],
      }));
    }
  };

  const handleRemoveTag = (tag) => {
    setProductData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // حساب السعر بعد الخصم
      const price = parseFloat(productData.price);
      const discount = parseFloat(productData.discount) || 0;
      const salesPrice = price - (price * discount) / 100;

      const newProduct = {
        ...productData,
        price,
        discount,
        salesPrice,
        stock: parseInt(productData.stock),
        images: [s1], // سيتم إضافة الصور لاحقاً
      };

      addNewProduct(newProduct);

      setSnackbar({
        open: true,
        message: 'Product added successfully!',
        severity: 'success',
      });

      // إعادة تعيين النموذج
      setProductData({
        title: '',
        description: '',
        price: '',
        discount: '',
        category: '',
        subcategory: '',
        gender: 'Unisex',
        brand: '',
        colors: [],
        sizes: [],
        stock: '',
        isActive: true,
        tags: [],
        specifications: {
          display: '',
          processor: '',
          camera: '',
          battery: '',
          storage: '',
          material: '',
          weight: '',
          features: '',
        },
      });

      // الانتقال إلى قائمة المنتجات بعد ثانيتين
      setTimeout(() => {
        navigate('/main-store/products/list');
      }, 2000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error adding product. Please try again.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <PageContainer title="Add New Product" description="Create a new product">
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <IconButton onClick={() => navigate('/main-store/products/list')}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h3" fontWeight={700}>
              Add New Product
            </Typography>
          </Stack>
          <Typography variant="h6" color="text.secondary">
            Create a new product for your store
          </Typography>
        </Box>

        {/* Form */}
        <Box sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid size={12}>
                <Card>
                  <CardHeader title="Basic Information" />
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Product Title"
                          value={productData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          required
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Brand"
                          value={productData.brand}
                          onChange={(e) => handleInputChange('brand', e.target.value)}
                          required
                        />
                      </Grid>
                      <Grid size={12}>
                        <TextField
                          fullWidth
                          label="Description"
                          multiline
                          rows={4}
                          value={productData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          required
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Pricing & Inventory */}
              <Grid size={12}>
                <Card>
                  <CardHeader title="Pricing & Inventory" />
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                          fullWidth
                          label="Price ($)"
                          type="number"
                          value={productData.price}
                          onChange={(e) => handleInputChange('price', e.target.value)}
                          required
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                          fullWidth
                          label="Discount (%)"
                          type="number"
                          value={productData.discount}
                          onChange={(e) => handleInputChange('discount', e.target.value)}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                          fullWidth
                          label="Stock Quantity"
                          type="number"
                          value={productData.stock}
                          onChange={(e) => handleInputChange('stock', e.target.value)}
                          required
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Category & Classification */}
              <Grid size={12}>
                <Card>
                  <CardHeader title="Category & Classification" />
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <FormControl fullWidth required>
                          <InputLabel>Category</InputLabel>
                          <Select
                            value={productData.category}
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
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                          fullWidth
                          label="Subcategory"
                          value={productData.subcategory}
                          onChange={(e) => handleInputChange('subcategory', e.target.value)}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <FormControl fullWidth>
                          <InputLabel>Gender</InputLabel>
                          <Select
                            value={productData.gender}
                            label="Gender"
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                          >
                            {genders.map((gender) => (
                              <MenuItem key={gender} value={gender}>
                                {gender}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Colors */}
              <Grid size={12}>
                <Card>
                  <CardHeader title="Colors" />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Select available colors for this product
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {commonColors.map((color) => (
                        <Chip
                          key={color}
                          label={color}
                          onClick={() => handleAddColor(color)}
                          variant={productData.colors.includes(color) ? 'filled' : 'outlined'}
                          color={productData.colors.includes(color) ? 'primary' : 'default'}
                        />
                      ))}
                    </Stack>
                    {productData.colors.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Selected Colors:
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {productData.colors.map((color) => (
                            <Chip
                              key={color}
                              label={color}
                              onDelete={() => handleRemoveColor(color)}
                              color="primary"
                            />
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Sizes */}
              <Grid size={12}>
                <Card>
                  <CardHeader title="Sizes" />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Select available sizes for this product
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {commonSizes.map((size) => (
                        <Chip
                          key={size}
                          label={size}
                          onClick={() => handleAddSize(size)}
                          variant={productData.sizes.includes(size) ? 'filled' : 'outlined'}
                          color={productData.sizes.includes(size) ? 'primary' : 'default'}
                        />
                      ))}
                    </Stack>
                    {productData.sizes.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Selected Sizes:
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {productData.sizes.map((size) => (
                            <Chip
                              key={size}
                              label={size}
                              onDelete={() => handleRemoveSize(size)}
                              color="primary"
                            />
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Tags */}
              <Grid size={12}>
                <Card>
                  <CardHeader title="Tags" />
                  <CardContent>
                    <TextField
                      fullWidth
                      label="Add Tag"
                      placeholder="Enter a tag and press Enter"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag(e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    {productData.tags.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Product Tags:
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {productData.tags.map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              onDelete={() => handleRemoveTag(tag)}
                              color="secondary"
                            />
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Specifications */}
              <Grid size={12}>
                <Card>
                  <CardHeader title="Specifications" />
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Display"
                          value={productData.specifications.display}
                          onChange={(e) => handleSpecificationChange('display', e.target.value)}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Processor"
                          value={productData.specifications.processor}
                          onChange={(e) => handleSpecificationChange('processor', e.target.value)}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Camera"
                          value={productData.specifications.camera}
                          onChange={(e) => handleSpecificationChange('camera', e.target.value)}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Battery"
                          value={productData.specifications.battery}
                          onChange={(e) => handleSpecificationChange('battery', e.target.value)}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Storage"
                          value={productData.specifications.storage}
                          onChange={(e) => handleSpecificationChange('storage', e.target.value)}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Material"
                          value={productData.specifications.material}
                          onChange={(e) => handleSpecificationChange('material', e.target.value)}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Weight"
                          value={productData.specifications.weight}
                          onChange={(e) => handleSpecificationChange('weight', e.target.value)}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Features"
                          value={productData.specifications.features}
                          onChange={(e) => handleSpecificationChange('features', e.target.value)}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Status */}
              <Grid size={12}>
                <Card>
                  <CardHeader title="Status" />
                  <CardContent>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={productData.isActive}
                          onChange={(e) => handleInputChange('isActive', e.target.checked)}
                        />
                      }
                      label="Product is Active"
                    />
                  </CardContent>
                </Card>
              </Grid>

              {/* Submit Button */}
              <Grid size={12}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button variant="outlined" onClick={() => navigate('/main-store/products/list')}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={loading}
                  >
                    {loading ? 'Adding...' : 'Add Product'}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </Box>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </PageContainer>
  );
};

export default AddProduct;


