import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  Grid,
  Stack,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  Breadcrumbs,
  Link,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteImageIcon,
} from '@mui/icons-material';
import PageContainer from 'src/components/container/PageContainer';
import { getProductById, updateProduct, deleteProduct } from '../../../services/productsService';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, product: null });

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    discount: 0,
    salesPrice: 0,
    category: '',
    subcategory: '',
    gender: 'Unisex',
    brand: '',
    colors: [],
    sizes: [],
    stock: 0,
    isActive: true,
    rating: 0,
    reviews: 0,
    images: [],
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

  // Available options
  const categories = ['Electronics', 'Fashion', 'Home', 'Sports', 'Books', 'Beauty'];
  const genders = ['Men', 'Women', 'Kids', 'Unisex'];
  const brands = [
    'Apple',
    'Samsung',
    'Nike',
    'Adidas',
    'Sony',
    "Levi's",
    'Zara',
    'H&M Kids',
    'Nike Kids',
  ];
  const availableColors = [
    '#000000',
    '#FFFFFF',
    '#FFD700',
    '#C0C0C0',
    '#696969',
    '#FF0000',
    '#0000FF',
    '#00FF00',
    '#FFFF00',
    '#FF69B4',
    '#00FFFF',
    '#000080',
    '#808080',
    '#87CEEB',
  ];
  const availableSizes = [
    'XS',
    'S',
    'M',
    'L',
    'XL',
    'XXL',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '28',
    '30',
    '32',
    '34',
    '36',
    '38',
    '40',
    '128GB',
    '256GB',
    '512GB',
    '1TB',
    '2TB',
    '4TB',
    'One Size',
    '1Y',
    '2Y',
    '3Y',
    '4Y',
    '5Y',
    '6Y',
    '7Y',
    '8Y',
    '10C',
    '11C',
    '12C',
    '13C',
    '3Y-Kids',
  ];

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const productData = getProductById(id);
      if (productData) {
        setProduct(productData);
        setFormData({
          title: productData.title || '',
          description: productData.description || '',
          price: productData.price || 0,
          discount: productData.discount || 0,
          salesPrice: productData.salesPrice || 0,
          category: productData.category || '',
          subcategory: productData.subcategory || '',
          gender: productData.gender || 'Unisex',
          brand: productData.brand || '',
          colors: productData.colors || [],
          sizes: productData.sizes || [],
          stock: productData.stock || 0,
          isActive: productData.isActive !== undefined ? productData.isActive : true,
          rating: productData.rating || 0,
          reviews: productData.reviews || 0,
          images: productData.images || [],
          tags: productData.tags || [],
          specifications: productData.specifications || {
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
      } else {
        setSnackbar({
          open: true,
          message: 'Product not found',
          severity: 'error',
        });
        navigate('/main-store/products/list');
      }
    } catch (error) {
      console.error('Error loading product:', error);
      setSnackbar({
        open: true,
        message: 'Error loading product',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-calculate sales price when price or discount changes
    if (field === 'price' || field === 'discount') {
      const price = field === 'price' ? value : formData.price;
      const discount = field === 'discount' ? value : formData.discount;
      const salesPrice = price * (1 - discount / 100);
      setFormData((prev) => ({
        ...prev,
        salesPrice: Math.round(salesPrice * 100) / 100,
      }));
    }
  };

  const handleSpecificationChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [field]: value,
      },
    }));
  };

  const handleColorToggle = (color) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  };

  const handleSizeToggle = (size) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleTagAdd = (tag) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag.trim()],
      }));
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  };

  const handleImageRemove = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const updatedProduct = {
        ...product,
        ...formData,
        updatedAt: new Date().toISOString(),
      };

      updateProduct(id, updatedProduct);

      setSnackbar({
        open: true,
        message: 'Product updated successfully',
        severity: 'success',
      });

      // Navigate back to list after a short delay
      setTimeout(() => {
        navigate('/main-store/products/list');
      }, 1500);
    } catch (error) {
      console.error('Error updating product:', error);
      setSnackbar({
        open: true,
        message: 'Error updating product',
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      deleteProduct(id);
      setSnackbar({
        open: true,
        message: 'Product deleted successfully',
        severity: 'success',
      });
      setDeleteDialog({ open: false, product: null });

      setTimeout(() => {
        navigate('/main-store/products/list');
      }, 1500);
    } catch (error) {
      console.error('Error deleting product:', error);
      setSnackbar({
        open: true,
        message: 'Error deleting product',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <PageContainer title="Edit Product" description="Edit product details">
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography>Loading product...</Typography>
        </Box>
      </PageContainer>
    );
  }

  if (!product) {
    return (
      <PageContainer title="Edit Product" description="Edit product details">
        <Alert severity="error">Product not found</Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Edit Product" description="Edit product details">
      <Box sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Breadcrumb */}
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Breadcrumbs sx={{ mb: 2 }}>
            <Link
              color="inherit"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate('/main-store/products/list');
              }}
            >
              Products
            </Link>
            <Typography color="text.primary">Edit Product</Typography>
          </Breadcrumbs>
          <Typography variant="h3" fontWeight={700} sx={{ mb: 2 }}>
            Edit Product: {product.title}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Update product information and settings
          </Typography>
        </Box>

        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <Grid container spacing={3}>
              <Grid size={{ lg: 8 }}>
                <Stack spacing={3}>
                  {/* Basic Information */}
                  <Card>
                    <CardHeader title="Basic Information" />
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            fullWidth
                            label="Product Title"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            required
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            fullWidth
                            label="Brand"
                            value={formData.brand}
                            onChange={(e) => handleInputChange('brand', e.target.value)}
                            select
                            SelectProps={{ native: true }}
                          >
                            <option value="">Select Brand</option>
                            {brands.map((brand) => (
                              <option key={brand} value={brand}>
                                {brand}
                              </option>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid size={12}>
                          <TextField
                            fullWidth
                            label="Description"
                            multiline
                            rows={4}
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>

                  {/* Pricing */}
                  <Card>
                    <CardHeader title="Pricing" />
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <TextField
                            fullWidth
                            label="Price"
                            type="number"
                            value={formData.price}
                            onChange={(e) =>
                              handleInputChange('price', parseFloat(e.target.value) || 0)
                            }
                            InputProps={{ startAdornment: '$' }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <TextField
                            fullWidth
                            label="Discount (%)"
                            type="number"
                            value={formData.discount}
                            onChange={(e) =>
                              handleInputChange('discount', parseFloat(e.target.value) || 0)
                            }
                            InputProps={{ endAdornment: '%' }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <TextField
                            fullWidth
                            label="Sales Price"
                            type="number"
                            value={formData.salesPrice}
                            disabled
                            InputProps={{ startAdornment: '$' }}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>

                  {/* Category & Classification */}
                  <Card>
                    <CardHeader title="Category & Classification" />
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            fullWidth
                            label="Category"
                            value={formData.category}
                            onChange={(e) => handleInputChange('category', e.target.value)}
                            select
                            SelectProps={{ native: true }}
                          >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            fullWidth
                            label="Gender"
                            value={formData.gender}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            select
                            SelectProps={{ native: true }}
                          >
                            {genders.map((gender) => (
                              <option key={gender} value={gender}>
                                {gender}
                              </option>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            fullWidth
                            label="Subcategory"
                            value={formData.subcategory}
                            onChange={(e) => handleInputChange('subcategory', e.target.value)}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            fullWidth
                            label="Stock"
                            type="number"
                            value={formData.stock}
                            onChange={(e) =>
                              handleInputChange('stock', parseInt(e.target.value) || 0)
                            }
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>

                  {/* Colors */}
                  <Card>
                    <CardHeader title="Colors" />
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ mb: 2 }}>
                        Available Colors
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {availableColors.map((color) => (
                          <Box
                            key={color}
                            onClick={() => handleColorToggle(color)}
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              backgroundColor: color,
                              border: formData.colors.includes(color)
                                ? '3px solid #1976d2'
                                : '1px solid #ccc',
                              cursor: 'pointer',
                              '&:hover': {
                                transform: 'scale(1.1)',
                              },
                            }}
                          />
                        ))}
                      </Stack>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1, display: 'block' }}
                      >
                        Selected: {formData.colors.length} colors
                      </Typography>
                    </CardContent>
                  </Card>

                  {/* Sizes */}
                  <Card>
                    <CardHeader title="Sizes" />
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ mb: 2 }}>
                        Available Sizes
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {availableSizes.map((size) => (
                          <Chip
                            key={size}
                            label={size}
                            onClick={() => handleSizeToggle(size)}
                            color={formData.sizes.includes(size) ? 'primary' : 'default'}
                            variant={formData.sizes.includes(size) ? 'filled' : 'outlined'}
                            sx={{ mb: 1 }}
                          />
                        ))}
                      </Stack>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1, display: 'block' }}
                      >
                        Selected: {formData.sizes.length} sizes
                      </Typography>
                    </CardContent>
                  </Card>

                  {/* Images */}
                  <Card>
                    <CardHeader title="Product Images" />
                    <CardContent>
                      <Stack spacing={2}>
                        {/* Current Images */}
                        {formData.images.length > 0 && (
                          <Box>
                            <Typography variant="subtitle2" sx={{ mb: 2 }}>
                              Current Images ({formData.images.length})
                            </Typography>
                            <Grid container spacing={2}>
                              {formData.images.map((image, index) => (
                                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
                                  <Box sx={{ position: 'relative' }}>
                                    <Box
                                      component="img"
                                      src={image}
                                      alt={`Product ${index + 1}`}
                                      sx={{
                                        width: '100%',
                                        height: 150,
                                        objectFit: 'cover',
                                        borderRadius: 1,
                                        border: '1px solid #e0e0e0',
                                      }}
                                    />
                                    <IconButton
                                      size="small"
                                      sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                        color: 'white',
                                        '&:hover': {
                                          backgroundColor: 'rgba(0,0,0,0.7)',
                                        },
                                      }}
                                      onClick={() => handleImageRemove(index)}
                                    >
                                      <DeleteImageIcon fontSize="small" />
                                    </IconButton>
                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        )}

                        {/* Upload New Images */}
                        <Box>
                          <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="image-upload"
                            multiple
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
                              Upload New Images
                            </Button>
                          </label>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mt: 1, display: 'block' }}
                          >
                            You can select multiple images at once
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>

                  {/* Tags */}
                  <Card>
                    <CardHeader title="Tags" />
                    <CardContent>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                        {formData.tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            onDelete={() => handleTagRemove(tag)}
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Stack>
                      <TextField
                        fullWidth
                        label="Add Tag"
                        placeholder="Enter tag and press Enter"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleTagAdd(e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                    </CardContent>
                  </Card>

                  {/* Specifications */}
                  <Card>
                    <CardHeader title="Specifications" />
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            fullWidth
                            label="Display"
                            value={formData.specifications.display}
                            onChange={(e) => handleSpecificationChange('display', e.target.value)}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            fullWidth
                            label="Processor"
                            value={formData.specifications.processor}
                            onChange={(e) => handleSpecificationChange('processor', e.target.value)}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            fullWidth
                            label="Camera"
                            value={formData.specifications.camera}
                            onChange={(e) => handleSpecificationChange('camera', e.target.value)}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            fullWidth
                            label="Battery"
                            value={formData.specifications.battery}
                            onChange={(e) => handleSpecificationChange('battery', e.target.value)}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            fullWidth
                            label="Storage"
                            value={formData.specifications.storage}
                            onChange={(e) => handleSpecificationChange('storage', e.target.value)}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            fullWidth
                            label="Material"
                            value={formData.specifications.material}
                            onChange={(e) => handleSpecificationChange('material', e.target.value)}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            fullWidth
                            label="Weight"
                            value={formData.specifications.weight}
                            onChange={(e) => handleSpecificationChange('weight', e.target.value)}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <TextField
                            fullWidth
                            label="Features"
                            value={formData.specifications.features}
                            onChange={(e) => handleSpecificationChange('features', e.target.value)}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Stack>
              </Grid>

              <Grid size={{ lg: 4 }}>
                <Stack spacing={3}>
                  {/* Status */}
                  <Card>
                    <CardHeader title="Status" />
                    <CardContent>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.isActive}
                            onChange={(e) => handleInputChange('isActive', e.target.checked)}
                          />
                        }
                        label="Active Product"
                      />
                    </CardContent>
                  </Card>

                  {/* Actions */}
                  <Card>
                    <CardHeader title="Actions" />
                    <CardContent>
                      <Stack spacing={2}>
                        <Button
                          type="submit"
                          variant="contained"
                          startIcon={<SaveIcon />}
                          fullWidth
                          disabled={saving}
                        >
                          {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          fullWidth
                          onClick={() => navigate('/main-store/products/list')}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          fullWidth
                          onClick={() => setDeleteDialog({ open: true, product })}
                        >
                          Delete Product
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </Box>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, product: null })}
          disableEnforceFocus
        >
          <DialogTitle>Delete Product</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{deleteDialog.product?.title}"? This action cannot be
              undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog({ open: false, product: null })}>Cancel</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

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

export default EditProduct;


