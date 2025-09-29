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
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  LocalShipping as LocalShippingIcon,
  Cancel as CancelIcon,
  ShoppingCart as ShoppingCartIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as AttachMoneyIcon,
  Inventory as InventoryIcon,
  Store as StoreIcon,
} from '@mui/icons-material';
import PageContainer from 'src/components/container/PageContainer.jsx';
import {
  getAllPurchases,
  updatePurchaseStatus,
  deletePurchaseOrder,
  createPurchaseOrder,
  getAllSuppliers,
  getAllInventory,
  getWarehouseStats,
} from '../../../../api/warehouse/warehouseService.js';

const Purchases = () => {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Create Purchase Form States
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedDelivery, setExpectedDelivery] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([]);
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unitCost, setUnitCost] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [purchases, searchTerm, statusFilter, supplierFilter, sortBy]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [purchasesData, suppliersData, inventoryData, statsData] = await Promise.all([
        getAllPurchases(),
        getAllSuppliers(),
        getAllInventory(),
        getWarehouseStats(),
      ]);
      setPurchases(purchasesData);
      setSuppliers(suppliersData);
      setInventory(inventoryData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...purchases];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (purchase) =>
          purchase.purchaseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          purchase.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          purchase.items.some((item) =>
            item.productName.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((purchase) => purchase.status === statusFilter);
    }

    // Supplier filter
    if (supplierFilter !== 'all') {
      filtered = filtered.filter((purchase) => purchase.supplierId === supplierFilter);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
        break;
      case 'amount-high':
        filtered.sort((a, b) => b.total - a.total);
        break;
      case 'amount-low':
        filtered.sort((a, b) => a.total - b.total);
        break;
      case 'supplier':
        filtered.sort((a, b) => a.supplierName.localeCompare(b.supplierName));
        break;
      default:
        break;
    }

    setFilteredPurchases(filtered);
    setCurrentPage(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <PendingIcon />;
      case 'delivered':
        return <CheckCircleIcon />;
      case 'cancelled':
        return <CancelIcon />;
      default:
        return <LocalShippingIcon />;
    }
  };

  const handleViewDetails = (purchase) => {
    setSelectedPurchase(purchase);
    setDetailsOpen(true);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const deliveredDate =
        newStatus === 'delivered' ? new Date().toISOString().split('T')[0] : null;
      await updatePurchaseStatus(id, newStatus, deliveredDate);
      await loadData();
      setSuccess(`Purchase order ${newStatus} successfully!`);
      setDetailsOpen(false);
    } catch (error) {
      console.error('Error updating purchase status:', error);
      setError('Failed to update purchase status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this purchase order?')) return;

    try {
      await deletePurchaseOrder(id);
      await loadData();
      setSuccess('Purchase order deleted successfully!');
    } catch (error) {
      console.error('Error deleting purchase order:', error);
      setError('Failed to delete purchase order');
    }
  };

  // Create Purchase Functions
  const handleAddItem = () => {
    if (!selectedProduct || quantity <= 0 || unitCost <= 0) {
      setError('Please fill all item fields');
      return;
    }

    const product = inventory.find((p) => p.id === selectedProduct);
    if (!product) {
      setError('Product not found');
      return;
    }

    // Check if item already exists
    const existingItem = items.find((item) => item.productId === selectedProduct);
    if (existingItem) {
      setError('Product already added to the order');
      return;
    }

    const newItem = {
      id: `item-${Date.now()}`,
      productId: product.id,
      productName: product.productName,
      sku: product.sku,
      quantity: parseInt(quantity),
      unitCost: parseFloat(unitCost),
      totalCost: parseInt(quantity) * parseFloat(unitCost),
    };

    setItems([...items, newItem]);
    setSelectedProduct('');
    setQuantity(1);
    setUnitCost(0);
    setAddItemOpen(false);
    setError('');
  };

  const handleRemoveItem = (itemId) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const handleUpdateItem = (itemId, field, value) => {
    setItems(
      items.map((item) => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitCost') {
            updatedItem.totalCost = updatedItem.quantity * updatedItem.unitCost;
          }
          return updatedItem;
        }
        return item;
      }),
    );
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.totalCost, 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const handleCreatePurchase = async () => {
    if (!selectedSupplier || !expectedDelivery || items.length === 0) {
      setError('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const supplier = suppliers.find((s) => s.id === selectedSupplier);
      const { subtotal, tax, total } = calculateTotals();

      const purchaseData = {
        supplierId: selectedSupplier,
        supplierName: supplier.name,
        orderDate,
        expectedDelivery,
        status: 'pending',
        items,
        subtotal,
        tax,
        total,
        notes: notes.trim(),
      };

      const newPurchase = await createPurchaseOrder(purchaseData);

      if (newPurchase) {
        setSuccess('Purchase order created successfully!');
        setCreateOpen(false);
        setItems([]);
        setSelectedSupplier('');
        setExpectedDelivery('');
        setNotes('');
        await loadData();
      } else {
        setError('Failed to create purchase order');
      }
    } catch (err) {
      setError(err.message || 'Failed to create purchase order');
      console.error('Error creating purchase order:', err);
    } finally {
      setLoading(false);
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPurchases = filteredPurchases.slice(startIndex, endIndex);

  const { subtotal, tax, total } = calculateTotals();

  return (
    <PageContainer title="Purchases Management">
      <Box>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Purchases Management
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => navigate('/main-store/warehouse/purchases/create')}
          >
            New Purchase Order
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
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'warning.main' }}>
                    <PendingIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {purchases.filter((p) => p.status === 'pending').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending Orders
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
                  <Avatar sx={{ bgcolor: 'success.main' }}>
                    <CheckCircleIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {purchases.filter((p) => p.status === 'delivered').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Delivered Orders
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
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <ShoppingCartIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{purchases.length}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Orders
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
                  <Avatar sx={{ bgcolor: 'info.main' }}>
                    <AttachMoneyIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      ${purchases.reduce((sum, p) => sum + p.total, 0).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Value
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
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Search purchases..."
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
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="delivered">Delivered</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
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
              <Grid size={{ xs: 12, md: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    label="Sort By"
                  >
                    <MenuItem value="newest">Newest First</MenuItem>
                    <MenuItem value="oldest">Oldest First</MenuItem>
                    <MenuItem value="amount-high">Amount (High to Low)</MenuItem>
                    <MenuItem value="amount-low">Amount (Low to High)</MenuItem>
                    <MenuItem value="supplier">Supplier Name</MenuItem>
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
                      <TableCell>Purchase #</TableCell>
                      <TableCell>Supplier</TableCell>
                      <TableCell>Order Date</TableCell>
                      <TableCell>Expected Delivery</TableCell>
                      <TableCell>Items</TableCell>
                      <TableCell>Total Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedPurchases.map((purchase) => (
                      <TableRow key={purchase.id} hover>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {purchase.purchaseNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{purchase.supplierName}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(purchase.orderDate).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(purchase.expectedDelivery).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            <strong>{purchase.items.length}</strong> items
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight="bold">
                            ${purchase.total.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(purchase.status)}
                            label={
                              purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)
                            }
                            color={getStatusColor(purchase.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={() => handleViewDetails(purchase)}
                                color="info"
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(purchase.id)}
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
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
          <DialogTitle>Purchase Order Details - {selectedPurchase?.purchaseNumber}</DialogTitle>
          <DialogContent>
            {selectedPurchase && (
              <Box>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Supplier
                    </Typography>
                    <Typography variant="body1">{selectedPurchase.supplierName}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Order Date
                    </Typography>
                    <Typography variant="body1">
                      {new Date(selectedPurchase.orderDate).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Expected Delivery
                    </Typography>
                    <Typography variant="body1">
                      {new Date(selectedPurchase.expectedDelivery).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      icon={getStatusIcon(selectedPurchase.status)}
                      label={
                        selectedPurchase.status.charAt(0).toUpperCase() +
                        selectedPurchase.status.slice(1)
                      }
                      color={getStatusColor(selectedPurchase.status)}
                    />
                  </Grid>
                </Grid>

                <Typography variant="h6" gutterBottom>
                  Items
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>SKU</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Unit Cost</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedPurchase.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell>{item.sku}</TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">${item.unitCost}</TableCell>
                          <TableCell align="right">${item.totalCost.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box sx={{ mt: 2, textAlign: 'right' }}>
                  <Typography variant="body2" color="text.secondary">
                    Subtotal: ${selectedPurchase.subtotal.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tax: ${selectedPurchase.tax.toLocaleString()}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    Total: ${selectedPurchase.total.toLocaleString()}
                  </Typography>
                </Box>

                {selectedPurchase.notes && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Notes
                    </Typography>
                    <Typography variant="body2">{selectedPurchase.notes}</Typography>
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailsOpen(false)}>Close</Button>
            {selectedPurchase?.status === 'pending' && (
              <>
                <Button
                  onClick={() => handleUpdateStatus(selectedPurchase.id, 'delivered')}
                  color="success"
                  startIcon={<CheckCircleIcon />}
                >
                  Mark as Delivered
                </Button>
                <Button
                  onClick={() => handleUpdateStatus(selectedPurchase.id, 'cancelled')}
                  color="error"
                  startIcon={<CancelIcon />}
                >
                  Cancel Order
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>

        {/* Create Purchase Dialog */}
        <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="lg" fullWidth>
          <DialogTitle>Create New Purchase Order</DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth required>
                  <InputLabel>Supplier</InputLabel>
                  <Select
                    value={selectedSupplier}
                    onChange={(e) => setSelectedSupplier(e.target.value)}
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
                <TextField
                  fullWidth
                  label="Order Date"
                  type="date"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Expected Delivery"
                  type="date"
                  value={expectedDelivery}
                  onChange={(e) => setExpectedDelivery(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  multiline
                  rows={2}
                  placeholder="Additional notes..."
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Order Items</Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setAddItemOpen(true)}
                >
                  Add Item
                </Button>
              </Box>

              {items.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <Typography variant="body2" color="text.secondary">
                    No items added yet. Click "Add Item" to start.
                  </Typography>
                </Box>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>SKU</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Unit Cost</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Typography variant="subtitle2">{item.productName}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={item.sku} size="small" variant="outlined" />
                          </TableCell>
                          <TableCell align="right">
                            <TextField
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                handleUpdateItem(item.id, 'quantity', parseInt(e.target.value) || 0)
                              }
                              size="small"
                              sx={{ width: 80 }}
                              inputProps={{ min: 1 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <TextField
                              type="number"
                              value={item.unitCost}
                              onChange={(e) =>
                                handleUpdateItem(
                                  item.id,
                                  'unitCost',
                                  parseFloat(e.target.value) || 0,
                                )
                              }
                              size="small"
                              sx={{ width: 100 }}
                              inputProps={{ min: 0, step: 0.01 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="subtitle2" fontWeight="bold">
                              ${item.totalCost.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveItem(item.id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              <Box sx={{ mt: 2, textAlign: 'right' }}>
                <Typography variant="body2" color="text.secondary">
                  Subtotal: ${subtotal.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tax (10%): ${tax.toLocaleString()}
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  Total: ${total.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button
              onClick={handleCreatePurchase}
              variant="contained"
              disabled={loading || items.length === 0}
            >
              {loading ? 'Creating...' : 'Create Purchase Order'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Item Dialog */}
        <Dialog open={addItemOpen} onClose={() => setAddItemOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Item to Order</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <FormControl fullWidth required>
                <InputLabel>Product</InputLabel>
                <Select
                  value={selectedProduct}
                  onChange={(e) => {
                    setSelectedProduct(e.target.value);
                    const product = inventory.find((p) => p.id === e.target.value);
                    if (product) {
                      setUnitCost(product.unitCost);
                    }
                  }}
                  label="Product"
                >
                  {inventory
                    .filter((product) => !items.some((item) => item.productId === product.id))
                    .map((product) => (
                      <MenuItem key={product.id} value={product.id}>
                        <Box>
                          <Typography variant="subtitle2">{product.productName}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            SKU: {product.sku} | Stock: {product.currentStock}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                inputProps={{ min: 1 }}
                required
              />

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
              />

              {quantity > 0 && unitCost > 0 && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Cost: ${(quantity * unitCost).toLocaleString()}
                  </Typography>
                </Box>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddItemOpen(false)}>Cancel</Button>
            <Button onClick={handleAddItem} variant="contained">
              Add Item
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PageContainer>
  );
};

export default Purchases;
