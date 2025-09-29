import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Stack,
  Alert,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import PageContainer from 'src/components/container/PageContainer.jsx';
import { createInvoice, generateInvoiceNumber } from '../../../api/invoices/InvoicesData.js';

const AddInvoice = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    invoiceNumber: generateInvoiceNumber(),
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    items: [],
    subtotal: 0,
    taxRate: 8.5,
    taxAmount: 0,
    discount: 0,
    total: 0,
    status: 'draft',
    paymentMethod: '',
    dueDate: '',
    issueDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
  });

  const [editingItem, setEditingItem] = useState(null);

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'check', label: 'Check' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'other', label: 'Other' },
  ];

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleItemChange = (field) => (event) => {
    const value = event.target.value;
    setNewItem((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addItem = () => {
    if (newItem.name.trim() && newItem.quantity > 0 && newItem.unitPrice >= 0) {
      const item = {
        id: Date.now(),
        name: newItem.name.trim(),
        description: newItem.description.trim(),
        quantity: parseFloat(newItem.quantity),
        unitPrice: parseFloat(newItem.unitPrice),
        total: parseFloat(newItem.quantity) * parseFloat(newItem.unitPrice),
      };

      setFormData((prev) => ({
        ...prev,
        items: [...prev.items, item],
      }));

      setNewItem({
        name: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
      });

      calculateTotals([...formData.items, item]);
    }
  };

  const removeItem = (itemId) => {
    const updatedItems = formData.items.filter((item) => item.id !== itemId);
    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
    calculateTotals(updatedItems);
  };

  const startEditItem = (item) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    });
  };

  const cancelEditItem = () => {
    setEditingItem(null);
    setNewItem({
      name: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
    });
  };

  const updateItem = () => {
    if (newItem.name.trim() && newItem.quantity > 0 && newItem.unitPrice >= 0) {
      const updatedItems = formData.items.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              name: newItem.name.trim(),
              description: newItem.description.trim(),
              quantity: parseFloat(newItem.quantity),
              unitPrice: parseFloat(newItem.unitPrice),
              total: parseFloat(newItem.quantity) * parseFloat(newItem.unitPrice),
            }
          : item,
      );

      setFormData((prev) => ({
        ...prev,
        items: updatedItems,
      }));

      calculateTotals(updatedItems);
      cancelEditItem();
    }
  };

  const calculateTotals = (items) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = (subtotal * formData.taxRate) / 100;
    const total = subtotal + taxAmount - formData.discount;

    setFormData((prev) => ({
      ...prev,
      subtotal: subtotal,
      taxAmount: taxAmount,
      total: Math.max(0, total),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validation
      if (!formData.customerName.trim()) {
        throw new Error('Customer name is required');
      }

      if (formData.items.length === 0) {
        throw new Error('At least one item is required');
      }

      if (!formData.dueDate) {
        throw new Error('Due date is required');
      }

      const invoiceData = {
        invoiceNumber: formData.invoiceNumber,
        customerName: formData.customerName.trim(),
        customerEmail: formData.customerEmail.trim(),
        customerPhone: formData.customerPhone.trim(),
        customerAddress: formData.customerAddress.trim(),
        items: formData.items,
        subtotal: formData.subtotal,
        taxRate: formData.taxRate,
        taxAmount: formData.taxAmount,
        discount: formData.discount,
        total: formData.total,
        status: formData.status,
        paymentMethod: formData.paymentMethod,
        dueDate: new Date(formData.dueDate).toISOString(),
        issueDate: new Date(formData.issueDate).toISOString(),
        notes: formData.notes.trim(),
      };

      await createInvoice(invoiceData);
      setSuccess('Invoice created successfully!');

      // Reset form
      setFormData({
        invoiceNumber: generateInvoiceNumber(),
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        customerAddress: '',
        items: [],
        subtotal: 0,
        taxRate: 8.5,
        taxAmount: 0,
        discount: 0,
        total: 0,
        status: 'draft',
        paymentMethod: '',
        dueDate: '',
        issueDate: new Date().toISOString().split('T')[0],
        notes: '',
      });

      // Navigate back after 2 seconds
      setTimeout(() => {
        navigate('/main-store/invoices/list');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/main-store/invoices/list');
  };

  return (
    <PageContainer title="Create New Invoice">
      <Box>
        {/* Header */}
        <Box display="flex" alignItems="center" mb={3}>
          <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mr: 2 }}>
            Back
          </Button>
          <ReceiptIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Create New Invoice
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

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Invoice Information */}
            <Grid size={{ xs: 12 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Invoice Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Invoice Number"
                        value={formData.invoiceNumber}
                        onChange={handleInputChange('invoiceNumber')}
                        required
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                      <TextField
                        fullWidth
                        label="Issue Date"
                        type="date"
                        value={formData.issueDate}
                        onChange={handleInputChange('issueDate')}
                        InputLabelProps={{ shrink: true }}
                        required
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                      <TextField
                        fullWidth
                        label="Due Date"
                        type="date"
                        value={formData.dueDate}
                        onChange={handleInputChange('dueDate')}
                        InputLabelProps={{ shrink: true }}
                        required
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Customer Information */}
            <Grid size={{ xs: 12 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Customer Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Customer Name"
                        value={formData.customerName}
                        onChange={handleInputChange('customerName')}
                        required
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={formData.customerEmail}
                        onChange={handleInputChange('customerEmail')}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Phone"
                        value={formData.customerPhone}
                        onChange={handleInputChange('customerPhone')}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControl fullWidth>
                        <InputLabel>Payment Method</InputLabel>
                        <Select
                          value={formData.paymentMethod}
                          onChange={handleInputChange('paymentMethod')}
                          label="Payment Method"
                        >
                          {paymentMethods.map((method) => (
                            <MenuItem key={method.value} value={method.value}>
                              {method.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Address"
                        value={formData.customerAddress}
                        onChange={handleInputChange('customerAddress')}
                        multiline
                        rows={2}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Items */}
            <Grid size={{ xs: 12 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Invoice Items
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  {/* Add Item Form */}
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <Grid container spacing={2} alignItems="end">
                      <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                          fullWidth
                          label="Item Name"
                          value={newItem.name}
                          onChange={handleItemChange('name')}
                          required={formData.items.length === 0}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                          fullWidth
                          label="Description"
                          value={newItem.description}
                          onChange={handleItemChange('description')}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 2 }}>
                        <TextField
                          fullWidth
                          label="Quantity"
                          type="number"
                          value={newItem.quantity}
                          onChange={handleItemChange('quantity')}
                          inputProps={{ min: 1 }}
                          required={formData.items.length === 0}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 2 }}>
                        <TextField
                          fullWidth
                          label="Unit Price"
                          type="number"
                          value={newItem.unitPrice}
                          onChange={handleItemChange('unitPrice')}
                          inputProps={{ min: 0, step: 0.01 }}
                          required={formData.items.length === 0}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 2 }}>
                        <Stack direction="row" spacing={1}>
                          <Button
                            fullWidth
                            variant="contained"
                            startIcon={editingItem ? <SaveIcon /> : <AddIcon />}
                            onClick={editingItem ? updateItem : addItem}
                            disabled={!newItem.name.trim() || newItem.quantity <= 0}
                          >
                            {editingItem ? 'Update' : 'Add Item'}
                          </Button>
                          {editingItem && (
                            <Button variant="outlined" onClick={cancelEditItem} size="small">
                              Cancel
                            </Button>
                          )}
                        </Stack>
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* Items Table */}
                  {formData.items.length > 0 && (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Item</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell align="center">Quantity</TableCell>
                            <TableCell align="right">Unit Price</TableCell>
                            <TableCell align="right">Total</TableCell>
                            <TableCell align="center">Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {formData.items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{item.description}</TableCell>
                              <TableCell align="center">{item.quantity}</TableCell>
                              <TableCell align="right">${item.unitPrice.toFixed(2)}</TableCell>
                              <TableCell align="right">${item.total.toFixed(2)}</TableCell>
                              <TableCell align="center">
                                <Stack direction="row" spacing={1} justifyContent="center">
                                  <IconButton
                                    onClick={() => startEditItem(item)}
                                    color="primary"
                                    size="small"
                                  >
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton
                                    onClick={() => removeItem(item.id)}
                                    color="error"
                                    size="small"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Stack>
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

            {/* Totals */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Invoice Totals
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Stack spacing={2}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Subtotal:</Typography>
                      <Typography>${formData.subtotal.toFixed(2)}</Typography>
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <TextField
                        label="Tax Rate (%)"
                        type="number"
                        value={formData.taxRate}
                        onChange={handleInputChange('taxRate')}
                        size="small"
                        sx={{ width: 120 }}
                        inputProps={{ min: 0, max: 100, step: 0.1 }}
                      />
                      <Typography>${formData.taxAmount.toFixed(2)}</Typography>
                    </Box>

                    <Box display="flex" justifyContent="space-between">
                      <TextField
                        label="Discount"
                        type="number"
                        value={formData.discount}
                        onChange={handleInputChange('discount')}
                        size="small"
                        sx={{ width: 120 }}
                        inputProps={{ min: 0, step: 0.01 }}
                      />
                      <Typography>-${formData.discount.toFixed(2)}</Typography>
                    </Box>

                    <Divider />

                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="h6">Total:</Typography>
                      <Typography variant="h6">${formData.total.toFixed(2)}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Status and Notes */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Status & Notes
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Stack spacing={2}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={formData.status}
                        onChange={handleInputChange('status')}
                        label="Status"
                      >
                        {statusOptions.map((status) => (
                          <MenuItem key={status.value} value={status.value}>
                            {status.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      fullWidth
                      label="Notes"
                      value={formData.notes}
                      onChange={handleInputChange('notes')}
                      multiline
                      rows={4}
                      placeholder="Additional notes or terms..."
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Submit Button */}
            <Grid size={{ xs: 12 }}>
              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button variant="outlined" onClick={handleBack} disabled={loading}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Invoice'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </PageContainer>
  );
};

export default AddInvoice;
