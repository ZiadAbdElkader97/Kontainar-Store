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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import PageContainer from 'src/components/container/PageContainer.jsx';
import { createPurchaseOrder, getAllSuppliers, getAllInventory } from '../../../../api/warehouse/warehouseService.js';

const AddPurchase = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedDelivery, setExpectedDelivery] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unitCost, setUnitCost] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [suppliersData, inventoryData] = await Promise.all([
        getAllSuppliers(),
        getAllInventory()
      ]);
      setSuppliers(suppliersData);
      setInventory(inventoryData);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data');
    }
  };

  const handleAddItem = () => {
    if (!selectedProduct || quantity <= 0 || unitCost <= 0) {
      setError('Please fill all item fields');
      return;
    }

    const product = inventory.find(p => p.id === selectedProduct);
    if (!product) {
      setError('Product not found');
      return;
    }

    // Check if item already exists
    const existingItem = items.find(item => item.productId === selectedProduct);
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
    setItems(items.filter(item => item.id !== itemId));
  };

  const handleUpdateItem = (itemId, field, value) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitCost') {
          updatedItem.totalCost = updatedItem.quantity * updatedItem.unitCost;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.totalCost, 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const validateForm = () => {
    if (!selectedSupplier) {
      setError('Please select a supplier');
      return false;
    }
    if (!expectedDelivery) {
      setError('Please select expected delivery date');
      return false;
    }
    if (items.length === 0) {
      setError('Please add at least one item');
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

      const supplier = suppliers.find(s => s.id === selectedSupplier);
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
        setTimeout(() => {
          navigate('/main-store/warehouse/purchases/list');
        }, 1500);
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

  const handleCloseAlert = () => {
    setError('');
    setSuccess('');
  };

  const { subtotal, tax, total } = calculateTotals();

  return (
    <PageContainer title="Create Purchase Order">
      <Box>
        {/* Header */}
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton
            onClick={() => navigate('/main-store/warehouse/purchases/list')}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            Create Purchase Order
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
            {/* Purchase Details */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Purchase Order Details
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

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
                </CardContent>
              </Card>

              {/* Items */}
              <Card sx={{ mt: 3 }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">
                      Order Items
                    </Typography>
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
                                <Typography variant="subtitle2">
                                  {item.productName}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ 
                                  bgcolor: 'grey.100', 
                                  px: 1, 
                                  py: 0.5, 
                                  borderRadius: 1,
                                  fontSize: '0.75rem'
                                }}>
                                  {item.sku}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <TextField
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => handleUpdateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                  size="small"
                                  sx={{ width: 80 }}
                                  inputProps={{ min: 1 }}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <TextField
                                  type="number"
                                  value={item.unitCost}
                                  onChange={(e) => handleUpdateItem(item.id, 'unitCost', parseFloat(e.target.value) || 0)}
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
                </CardContent>
              </Card>
            </Grid>

            {/* Summary */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Order Summary
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Stack spacing={2}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">Items:</Typography>
                      <Typography variant="body2">{items.length}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">Subtotal:</Typography>
                      <Typography variant="body2">${subtotal.toLocaleString()}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">Tax (10%):</Typography>
                      <Typography variant="body2">${tax.toLocaleString()}</Typography>
                    </Box>
                    <Divider />
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="h6" fontWeight="bold">Total:</Typography>
                      <Typography variant="h6" fontWeight="bold">${total.toLocaleString()}</Typography>
                    </Box>
                  </Stack>

                  <Stack spacing={2} sx={{ mt: 3 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      startIcon={loading ? <Box sx={{ width: 20, height: 20 }} /> : <SaveIcon />}
                      disabled={loading || items.length === 0}
                    >
                      {loading ? 'Creating...' : 'Create Purchase Order'}
                    </Button>
                    
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => navigate('/main-store/warehouse/purchases/list')}
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
                    const product = inventory.find(p => p.id === e.target.value);
                    if (product) {
                      setUnitCost(product.unitCost);
                    }
                  }}
                  label="Product"
                >
                  {inventory
                    .filter(product => !items.some(item => item.productId === product.id))
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

export default AddPurchase;
