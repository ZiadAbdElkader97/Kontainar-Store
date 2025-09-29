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
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Pagination,
  Avatar,
  Tooltip,
  Badge,
  Divider,
  Tabs,
  Tab,
  LinearProgress,
  InputAdornment as MUIInputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  LocationOn as LocationOnIcon,
  Store as StoreIcon,
  AttachMoney as AttachMoneyIcon,
  ShoppingCart as ShoppingCartIcon,
  Category as CategoryIcon,
  LocalShipping as LocalShippingIcon,
} from '@mui/icons-material';
import PageContainer from 'src/components/container/PageContainer.jsx';
import {
  getAllInventory,
  deleteInventoryItem,
  updateStock,
  createInventoryItem,
  getAllSuppliers,
  getWarehouseStats,
} from '../../../../api/warehouse/warehouseService.js';

const Inventory = () => {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [stockUpdateOpen, setStockUpdateOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Stock Update States
  const [newStock, setNewStock] = useState(0);
  const [stockOperation, setStockOperation] = useState('set');

  // Create Item States
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
    'Other',
  ];

  const locations = [
    'A-01-01',
    'A-01-02',
    'A-01-03',
    'A-02-01',
    'A-02-02',
    'A-02-03',
    'B-01-01',
    'B-01-02',
    'B-01-03',
    'B-02-01',
    'B-02-02',
    'B-02-03',
    'C-01-01',
    'C-01-02',
    'C-01-03',
    'C-02-01',
    'C-02-02',
    'C-02-03',
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [inventory, searchTerm, categoryFilter, stockFilter, supplierFilter, sortBy]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [inventoryData, suppliersData, statsData] = await Promise.all([
        getAllInventory(),
        getAllSuppliers(),
        getWarehouseStats(),
      ]);
      setInventory(inventoryData);
      setSuppliers(suppliersData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...inventory];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.location.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    // Stock filter
    if (stockFilter !== 'all') {
      switch (stockFilter) {
        case 'low':
          filtered = filtered.filter((item) => item.currentStock <= item.minStock);
          break;
        case 'out':
          filtered = filtered.filter((item) => item.currentStock === 0);
          break;
        case 'high':
          filtered = filtered.filter((item) => item.currentStock >= item.maxStock * 0.8);
          break;
        default:
          break;
      }
    }

    // Supplier filter
    if (supplierFilter !== 'all') {
      filtered = filtered.filter((item) => item.supplierId === supplierFilter);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'name':
        filtered.sort((a, b) => a.productName.localeCompare(b.productName));
        break;
      case 'stock-low':
        filtered.sort((a, b) => a.currentStock - b.currentStock);
        break;
      case 'stock-high':
        filtered.sort((a, b) => b.currentStock - a.currentStock);
        break;
      case 'value-high':
        filtered.sort((a, b) => b.currentStock * b.unitCost - a.currentStock * a.unitCost);
        break;
      default:
        break;
    }

    setFilteredInventory(filtered);
    setCurrentPage(1);
  };

  const getStockStatus = (item) => {
    if (item.currentStock === 0) return { status: 'out', color: 'error', label: 'Out of Stock' };
    if (item.currentStock <= item.minStock)
      return { status: 'low', color: 'warning', label: 'Low Stock' };
    if (item.currentStock >= item.maxStock * 0.8)
      return { status: 'high', color: 'info', label: 'High Stock' };
    return { status: 'normal', color: 'success', label: 'In Stock' };
  };

  const getStockProgress = (item) => {
    return Math.min((item.currentStock / item.maxStock) * 100, 100);
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setDetailsOpen(true);
  };

  const handleUpdateStock = (item) => {
    setSelectedItem(item);
    setNewStock(item.currentStock);
    setStockUpdateOpen(true);
  };

  const handleStockUpdate = async () => {
    if (!selectedItem) return;

    try {
      await updateStock(selectedItem.id, newStock, stockOperation);
      await loadData();
      setSuccess('Stock updated successfully!');
      setStockUpdateOpen(false);
    } catch (error) {
      console.error('Error updating stock:', error);
      setError('Failed to update stock');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inventory item?')) return;

    try {
      await deleteInventoryItem(id);
      await loadData();
      setSuccess('Inventory item deleted successfully!');
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      setError('Failed to delete inventory item');
    }
  };

  // Create Item Functions
  const generateSKU = () => {
    if (productName && category) {
      const categoryPrefix = category.substring(0, 3).toUpperCase();
      const productPrefix = productName.substring(0, 3).toUpperCase().replace(/\s/g, '');
      const randomSuffix = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0');
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

  const handleCreateItem = async () => {
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
        setCreateOpen(false);
        // Reset form
        setProductName('');
        setSku('');
        setCategory('');
        setCurrentStock(0);
        setMinStock(0);
        setMaxStock(100);
        setUnitCost(0);
        setSellingPrice(0);
        setLocation('');
        setSupplierId('');
        setStatus('active');
        await loadData();
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

  // Get unique categories
  const categoriesList = [...new Set(inventory.map((item) => item.category))];

  // Calculate statistics
  const inventoryStats = {
    totalItems: inventory.length,
    totalValue: inventory.reduce((sum, item) => sum + item.currentStock * item.unitCost, 0),
    lowStockItems: inventory.filter((item) => item.currentStock <= item.minStock).length,
    outOfStockItems: inventory.filter((item) => item.currentStock === 0).length,
    totalCategories: categoriesList.length,
    totalSuppliers: suppliers.length,
  };

  // Pagination
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedInventory = filteredInventory.slice(startIndex, endIndex);

  const calculateTotalValue = () => {
    return currentStock * unitCost;
  };

  return (
    <PageContainer title="Inventory Management">
      <Box>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Inventory Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/main-store/warehouse/inventory/create')}
          >
            Add Inventory Item
          </Button>
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

        {/* Statistics Dashboard */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <InventoryIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{inventoryStats.totalItems}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Items
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'success.main' }}>
                    <AttachMoneyIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      ${inventoryStats.totalValue.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Value
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'warning.main' }}>
                    <WarningIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{inventoryStats.lowStockItems}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Low Stock
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'error.main' }}>
                    <TrendingDownIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{inventoryStats.outOfStockItems}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Out of Stock
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'info.main' }}>
                    <CategoryIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{inventoryStats.totalCategories}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Categories
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    <LocalShippingIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{inventoryStats.totalSuppliers}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Suppliers
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 2 }}>
                <TextField
                  fullWidth
                  placeholder="Search inventory..."
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
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    label="Category"
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    {categoriesList.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Stock Status</InputLabel>
                  <Select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                    label="Stock Status"
                  >
                    <MenuItem value="all">All Stock</MenuItem>
                    <MenuItem value="low">Low Stock</MenuItem>
                    <MenuItem value="out">Out of Stock</MenuItem>
                    <MenuItem value="high">High Stock</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Supplier</InputLabel>
                  <Select
                    value={supplierFilter}
                    onChange={(e) => setSupplierFilter(e.target.value)}
                    label="Supplier"
                  >
                    <MenuItem value="all">All Suppliers</MenuItem>
                    {suppliers.map((supplier) => (
                      <MenuItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    label="Sort By"
                  >
                    <MenuItem value="newest">Newest First</MenuItem>
                    <MenuItem value="oldest">Oldest First</MenuItem>
                    <MenuItem value="name">Product Name</MenuItem>
                    <MenuItem value="stock-low">Stock (Low to High)</MenuItem>
                    <MenuItem value="stock-high">Stock (High to Low)</MenuItem>
                    <MenuItem value="value-high">Value (High to Low)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent>
            {loading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <LinearProgress sx={{ width: '100%' }} />
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>SKU</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Current Stock</TableCell>
                      <TableCell>Stock Status</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Unit Cost</TableCell>
                      <TableCell>Total Value</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedInventory.map((item) => {
                      const stockStatus = getStockStatus(item);
                      const stockProgress = getStockProgress(item);

                      return (
                        <TableRow key={item.id} hover>
                          <TableCell>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {item.productName}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={item.sku} size="small" variant="outlined" />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={item.category}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {item.currentStock}
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={stockProgress}
                                color={stockStatus.color}
                                sx={{ height: 4, borderRadius: 2, mt: 0.5 }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                Min: {item.minStock} | Max: {item.maxStock}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={
                                stockStatus.status === 'low' ? (
                                  <WarningIcon />
                                ) : stockStatus.status === 'out' ? (
                                  <TrendingDownIcon />
                                ) : (
                                  <TrendingUpIcon />
                                )
                              }
                              label={stockStatus.label}
                              color={stockStatus.color}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <LocationOnIcon fontSize="small" color="action" />
                              <Typography variant="body2">{item.location}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">${item.unitCost}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle2" fontWeight="bold">
                              ${(item.currentStock * item.unitCost).toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Tooltip title="View Details">
                                <IconButton
                                  size="small"
                                  onClick={() => handleViewDetails(item)}
                                  color="info"
                                >
                                  <VisibilityIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Update Stock">
                                <IconButton
                                  size="small"
                                  onClick={() => handleUpdateStock(item)}
                                  color="primary"
                                >
                                  <InventoryIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDelete(item.id)}
                                  color="error"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={3}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(event, page) => setCurrentPage(page)}
                  color="primary"
                />
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Details Dialog */}
        <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Inventory Item Details - {selectedItem?.productName}</DialogTitle>
          <DialogContent>
            {selectedItem && (
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Product Name
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedItem.productName}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    SKU
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedItem.sku}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Category
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedItem.category}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Location
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedItem.location}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Current Stock
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {selectedItem.currentStock}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Stock Range
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Min: {selectedItem.minStock} | Max: {selectedItem.maxStock}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Unit Cost
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    ${selectedItem.unitCost}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Selling Price
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    ${selectedItem.sellingPrice}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Value
                  </Typography>
                  <Typography variant="h6" color="primary" gutterBottom>
                    ${(selectedItem.currentStock * selectedItem.unitCost).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {new Date(selectedItem.lastUpdated).toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailsOpen(false)}>Close</Button>
            <Button
              onClick={() => {
                setDetailsOpen(false);
                handleUpdateStock(selectedItem);
              }}
              variant="contained"
            >
              Update Stock
            </Button>
          </DialogActions>
        </Dialog>

        {/* Stock Update Dialog */}
        <Dialog
          open={stockUpdateOpen}
          onClose={() => setStockUpdateOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Update Stock - {selectedItem?.productName}</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Current Stock
                </Typography>
                <Typography variant="h6">{selectedItem?.currentStock}</Typography>
              </Box>

              <FormControl fullWidth>
                <InputLabel>Operation</InputLabel>
                <Select
                  value={stockOperation}
                  onChange={(e) => setStockOperation(e.target.value)}
                  label="Operation"
                >
                  <MenuItem value="set">Set to specific amount</MenuItem>
                  <MenuItem value="add">Add to current stock</MenuItem>
                  <MenuItem value="subtract">Subtract from current stock</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label={
                  stockOperation === 'set'
                    ? 'New Stock Amount'
                    : stockOperation === 'add'
                    ? 'Amount to Add'
                    : 'Amount to Subtract'
                }
                type="number"
                value={newStock}
                onChange={(e) => setNewStock(parseInt(e.target.value) || 0)}
                inputProps={{ min: 0 }}
              />

              {stockOperation !== 'set' && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Resulting Stock
                  </Typography>
                  <Typography variant="h6">
                    {stockOperation === 'add'
                      ? (selectedItem?.currentStock || 0) + newStock
                      : Math.max(0, (selectedItem?.currentStock || 0) - newStock)}
                  </Typography>
                </Box>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStockUpdateOpen(false)}>Cancel</Button>
            <Button onClick={handleStockUpdate} variant="contained">
              Update Stock
            </Button>
          </DialogActions>
        </Dialog>

        {/* Create Item Dialog */}
        <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="lg" fullWidth>
          <DialogTitle>Add New Inventory Item</DialogTitle>
          <DialogContent>
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
                  <Select value={status} onChange={(e) => setStatus(e.target.value)} label="Status">
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
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
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Unit Cost"
                  type="number"
                  value={unitCost}
                  onChange={(e) => setUnitCost(parseFloat(e.target.value) || 0)}
                  InputProps={{
                    startAdornment: <MUIInputAdornment position="start">$</MUIInputAdornment>,
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
                    startAdornment: <MUIInputAdornment position="start">$</MUIInputAdornment>,
                  }}
                  inputProps={{ min: 0, step: 0.01 }}
                  required
                  helperText="Price to sell this item"
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Item Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Value: ${calculateTotalValue().toLocaleString()}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Profit Margin:{' '}
                    {unitCost > 0
                      ? `${(((sellingPrice - unitCost) / unitCost) * 100).toFixed(1)}%`
                      : 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateItem} variant="contained" disabled={loading}>
              {loading ? 'Creating...' : 'Create Item'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PageContainer>
  );
};

export default Inventory;
