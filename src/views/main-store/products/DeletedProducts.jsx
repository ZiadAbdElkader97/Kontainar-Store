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
  Restore as RestoreIcon,
  DeleteForever as DeleteForeverIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  ShoppingCart as ShoppingCartIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';
import PageContainer from 'src/components/container/PageContainer';
import {
  getDeletedProducts,
  restoreProduct,
  permanentDeleteProduct,
  getProductsStats,
  getCategories,
  getBrands,
} from '../../../api/products/productsService';

const DeletedProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalDeleted: 0,
    totalCategories: 0,
    totalBrands: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [restoreDialog, setRestoreDialog] = useState({ open: false, product: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, product: null });

  const categories = getCategories();
  const brands = getBrands();

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, categoryFilter, brandFilter]);

  const loadProducts = () => {
    const deletedProducts = getDeletedProducts();
    setProducts(deletedProducts);

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

    setFilteredProducts(filtered);
  };

  const handleRestoreProduct = (product) => {
    setRestoreDialog({ open: true, product });
  };

  const handlePermanentDelete = (product) => {
    setDeleteDialog({ open: true, product });
  };

  const confirmRestore = () => {
    if (restoreDialog.product) {
      const success = restoreProduct(restoreDialog.product.id);
      if (success) {
        setSnackbar({
          open: true,
          message: 'Product restored successfully!',
          severity: 'success',
        });
        loadProducts();
      } else {
        setSnackbar({
          open: true,
          message: 'Error restoring product!',
          severity: 'error',
        });
      }
    }
    setRestoreDialog({ open: false, product: null });
  };

  const confirmPermanentDelete = () => {
    if (deleteDialog.product) {
      const success = permanentDeleteProduct(deleteDialog.product.id);
      if (success) {
        setSnackbar({
          open: true,
          message: 'Product permanently deleted!',
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

  return (
    <PageContainer title="Deleted Products" description="Manage deleted products">
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h3" fontWeight={700} sx={{ mb: 2 }}>
            Deleted Products
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Manage products that have been deleted from your store
          </Typography>
        </Box>

        {/* Statistics */}
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <ShoppingCartIcon color="error" sx={{ fontSize: 40 }} />
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        {stats.totalDeleted}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Deleted Products
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
                    <ShoppingCartIcon color="primary" sx={{ fontSize: 40 }} />
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        {stats.totalProducts}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Products
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
          </Grid>
        </Box>

        <Alert severity="warning" sx={{ m: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="body2">
            <strong>{stats.totalDeleted}</strong> products have been deleted. You can restore them
            or permanently delete them.
          </Typography>
        </Alert>

        {/* Filters */}
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Search Deleted Products"
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
            <Grid size={{ xs: 12, md: 3 }}>
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
            <Grid size={{ xs: 12, md: 3 }}>
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
                    <strong>Deleted Date</strong>
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
                          <Avatar
                            src={product.images?.[0]}
                            sx={{ width: 40, height: 40, opacity: 0.6 }}
                          />
                          <Box>
                            <Typography variant="body2" fontWeight={600} sx={{ opacity: 0.7 }}>
                              {product.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {product.id}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={product.category}
                          size="small"
                          variant="outlined"
                          sx={{ opacity: 0.7 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ opacity: 0.7 }}>
                          {product.brand}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack>
                          <Typography variant="body2" fontWeight={600} sx={{ opacity: 0.7 }}>
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
                        <Typography variant="body2" fontWeight={600} sx={{ opacity: 0.7 }}>
                          {product.stock} items
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          {renderStars(Math.floor(product.rating))}
                          <Typography variant="caption" sx={{ ml: 1, opacity: 0.7 }}>
                            ({product.rating.toFixed(1)})
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ opacity: 0.7 }}>
                          {formatDate(product.updatedAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton color="primary" size="small" title="View Details">
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton
                            color="success"
                            size="small"
                            title="Restore Product"
                            onClick={() => handleRestoreProduct(product)}
                          >
                            <RestoreIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            title="Permanent Delete"
                            onClick={() => handlePermanentDelete(product)}
                          >
                            <DeleteForeverIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Typography variant="body1" color="text.secondary">
                        No deleted products found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Restore Confirmation Dialog */}
        <Dialog
          open={restoreDialog.open}
          onClose={() => setRestoreDialog({ open: false, product: null })}
        >
          <DialogTitle>Restore Product</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to restore "{restoreDialog.product?.title}"? The product will
              become active again.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRestoreDialog({ open: false, product: null })}>Cancel</Button>
            <Button onClick={confirmRestore} color="success" variant="contained">
              Restore
            </Button>
          </DialogActions>
        </Dialog>

        {/* Permanent Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, product: null })}
          disableEnforceFocus
        >
          <DialogTitle>Permanent Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to permanently delete "{deleteDialog.product?.title}"? This
              action cannot be undone and the product will be removed forever.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog({ open: false, product: null })}>Cancel</Button>
            <Button onClick={confirmPermanentDelete} color="error" variant="contained">
              Delete Forever
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

export default DeletedProducts;


