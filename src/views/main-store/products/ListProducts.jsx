import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Stack,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  ShoppingCart as ShoppingCartIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';
import PageContainer from 'src/components/container/PageContainer';
import {
  getAllProductsAdmin,
  deleteProduct,
  getProductsStats,
  getCategories,
  getBrands,
} from '../../../api/products/productsService';

const ListProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalBrands: 0,
    totalRevenue: 0,
    averageRating: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, product: null });
  const [detailsDialog, setDetailsDialog] = useState({ open: false, product: null });

  const categories = getCategories();
  const brands = getBrands();

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, categoryFilter, brandFilter, statusFilter]);

  const loadProducts = () => {
    const allProducts = getAllProductsAdmin();
    setProducts(allProducts);

    const productStats = getProductsStats();
    setStats(productStats);
  };

  const filterProducts = () => {
    let filtered = [...products];

    // فلتر حسب البحث
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // فلتر حسب الفئة
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((product) => product.category === categoryFilter);
    }

    // فلتر حسب العلامة التجارية
    if (brandFilter !== 'all') {
      filtered = filtered.filter((product) => product.brand === brandFilter);
    }

    // فلتر حسب الحالة
    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        filtered = filtered.filter((product) => product.isActive && !product.isDeleted);
      } else if (statusFilter === 'inactive') {
        filtered = filtered.filter((product) => !product.isActive && !product.isDeleted);
      } else if (statusFilter === 'deleted') {
        filtered = filtered.filter((product) => product.isDeleted);
      }
    }

    setFilteredProducts(filtered);
  };

  const handleDeleteProduct = (product) => {
    setDeleteDialog({ open: true, product });
  };

  const handleViewDetails = (product) => {
    setDetailsDialog({ open: true, product });
  };

  const confirmDelete = () => {
    if (deleteDialog.product) {
      const success = deleteProduct(deleteDialog.product.id);
      if (success) {
        setSnackbar({
          open: true,
          message: 'Product deleted successfully!',
          severity: 'success',
        });
        loadProducts();
      } else {
        setSnackbar({
          open: true,
          message: 'Error deleting product!',
          severity: 'error',
        });
      }
    }
    setDeleteDialog({ open: false, product: null });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <StarIcon key={i} color="warning" fontSize="small" />
        ) : (
          <StarBorderIcon key={i} color="action" fontSize="small" />
        ),
      );
    }
    return stars;
  };

  const getStatusColor = (product) => {
    if (product.isDeleted) return 'error';
    if (!product.isActive) return 'warning';
    return 'success';
  };

  const getStatusText = (product) => {
    if (product.isDeleted) return 'Deleted';
    if (!product.isActive) return 'Inactive';
    return 'Active';
  };

  return (
    <PageContainer title="Products List" description="Manage your products">
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h3" fontWeight={700}>
              Products Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/main-store/products/create')}
            >
              Add New Product
            </Button>
          </Stack>
          <Typography variant="h6" color="text.secondary">
            Manage and organize your product catalog
          </Typography>
        </Box>

        {/* Statistics */}
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <ShoppingCartIcon color="primary" sx={{ fontSize: 40 }} />
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        {stats.totalProducts}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Products
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <ShoppingCartIcon color="secondary" sx={{ fontSize: 40 }} />
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        {stats.totalCategories}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Categories
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <ShoppingCartIcon color="success" sx={{ fontSize: 40 }} />
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        {stats.totalBrands}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Brands
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <StarIcon color="warning" sx={{ fontSize: 40 }} />
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        {stats.averageRating.toFixed(1)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Avg Rating
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Filters */}
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Search Products"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Category"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Brand</InputLabel>
                <Select
                  value={brandFilter}
                  label="Brand"
                  onChange={(e) => setBrandFilter(e.target.value)}
                >
                  <MenuItem value="all">All Brands</MenuItem>
                  {brands.map((brand) => (
                    <MenuItem key={brand} value={brand}>
                      {brand}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="deleted">Deleted</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={loadProducts}
                fullWidth
              >
                Refresh
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Products Table */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <TableContainer sx={{ height: '100%', width: '100%' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Product</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Category</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Brand</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Price</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Stock</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Rating</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Created</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id} hover>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar src={product.images?.[0]} sx={{ width: 40, height: 40 }} />
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {product.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {product.id}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip label={product.category} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{product.brand}</Typography>
                      </TableCell>
                      <TableCell>
                        <Stack>
                          <Typography variant="body2" fontWeight={600}>
                            {formatPrice(product.salesPrice)}
                          </Typography>
                          {product.discount > 0 && (
                            <Typography variant="caption" color="text.secondary">
                              <s>{formatPrice(product.price)}</s> (-{product.discount}%)
                            </Typography>
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {product.stock} items
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          {renderStars(Math.floor(product.rating))}
                          <Typography variant="caption" sx={{ ml: 1 }}>
                            ({product.rating.toFixed(1)})
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusText(product)}
                          color={getStatusColor(product)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{formatDate(product.createdAt)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton
                            color="primary"
                            size="small"
                            title="View Details"
                            onClick={() => handleViewDetails(product)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton
                            color="secondary"
                            size="small"
                            title="Edit Product"
                            onClick={() => navigate(`/main-store/products/edit/${product.id}`)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            title="Delete Product"
                            onClick={() => handleDeleteProduct(product)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Typography variant="body1" color="text.secondary">
                        No products found matching your criteria
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Product Details Dialog */}
        <Dialog
          open={detailsDialog.open}
          onClose={() => setDetailsDialog({ open: false, product: null })}
          maxWidth="md"
          fullWidth
          disableEnforceFocus
        >
          {detailsDialog.product && (
            <>
              <DialogTitle>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar src={detailsDialog.product.images?.[0]} sx={{ width: 40, height: 40 }} />
                  <Box>
                    <Typography variant="h6">{detailsDialog.product.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {detailsDialog.product.id}
                    </Typography>
                  </Box>
                </Stack>
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={3}>
                  <Grid size={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                        Basic Information
                      </Typography>
                      <Stack spacing={1}>
                        <Typography>
                          <strong>Brand:</strong> {detailsDialog.product.brand}
                        </Typography>
                        <Typography>
                          <strong>Category:</strong> {detailsDialog.product.category}
                        </Typography>
                        <Typography>
                          <strong>Subcategory:</strong> {detailsDialog.product.subcategory || 'N/A'}
                        </Typography>
                        <Typography>
                          <strong>Gender:</strong> {detailsDialog.product.gender}
                        </Typography>
                      </Stack>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                        Pricing
                      </Typography>
                      <Stack spacing={1}>
                        <Typography>
                          <strong>Price:</strong> {formatPrice(detailsDialog.product.price)}
                        </Typography>
                        <Typography>
                          <strong>Discount:</strong> {detailsDialog.product.discount}%
                        </Typography>
                        <Typography>
                          <strong>Sale Price:</strong>{' '}
                          {formatPrice(detailsDialog.product.salesPrice)}
                        </Typography>
                      </Stack>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                        Inventory
                      </Typography>
                      <Stack spacing={1}>
                        <Typography>
                          <strong>Stock:</strong> {detailsDialog.product.stock} items
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="body2">
                            <strong>Status:</strong>
                          </Typography>
                          <Chip
                            label={getStatusText(detailsDialog.product)}
                            color={getStatusColor(detailsDialog.product)}
                            size="small"
                          />
                        </Stack>
                      </Stack>
                    </Box>
                  </Grid>

                  <Grid size={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                        Description
                      </Typography>
                      <Typography variant="body2">{detailsDialog.product.description}</Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                        Colors Available
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {detailsDialog.product.colors.map((color, index) => (
                          <Box
                            key={index}
                            sx={{
                              width: 30,
                              height: 30,
                              borderRadius: '50%',
                              backgroundColor: color,
                              border: '1px solid #ccc',
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                        Sizes Available
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {detailsDialog.product.sizes.map((size, index) => (
                          <Chip key={index} label={size} size="small" />
                        ))}
                      </Stack>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                        Tags
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {detailsDialog.product.tags.map((tag, index) => (
                          <Chip key={index} label={tag} size="small" color="secondary" />
                        ))}
                      </Stack>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                        Rating & Reviews
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        {renderStars(Math.floor(detailsDialog.product.rating))}
                        <Typography variant="body2">
                          {detailsDialog.product.rating.toFixed(1)} ({detailsDialog.product.reviews}{' '}
                          reviews)
                        </Typography>
                      </Stack>
                    </Box>
                  </Grid>

                  {detailsDialog.product.specifications && (
                    <Grid size={12}>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                        Specifications
                      </Typography>
                      <Grid container spacing={2}>
                        {Object.entries(detailsDialog.product.specifications).map(
                          ([key, value]) =>
                            value && (
                              <Grid size={12} md={6} key={key}>
                                <Typography variant="body2">
                                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{' '}
                                  {value}
                                </Typography>
                              </Grid>
                            ),
                        )}
                      </Grid>
                    </Grid>
                  )}

                  <Grid size={12}>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                      Dates
                    </Typography>
                    <Stack spacing={1}>
                      <Typography>
                        <strong>Created:</strong> {formatDate(detailsDialog.product.createdAt)}
                      </Typography>
                      <Typography>
                        <strong>Last Updated:</strong> {formatDate(detailsDialog.product.updatedAt)}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDetailsDialog({ open: false, product: null })}>
                  Close
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    setDetailsDialog({ open: false, product: null });
                    navigate(`/main-store/products/edit/${detailsDialog.product.id}`);
                  }}
                >
                  Edit Product
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, product: null })}
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
            <Button onClick={confirmDelete} color="error" variant="contained">
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

export default ListProducts;


