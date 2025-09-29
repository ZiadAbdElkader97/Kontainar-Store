import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  IconButton,
  Stack,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  TextField,
  InputAdornment,
  Grid,
  Badge,
  Snackbar,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  AccessTime as AccessTimeIcon,
  Payment as PaymentIcon,
  LocalShipping as ShippingIcon,
} from '@mui/icons-material';

const getOrderStatusColor = (orderStatus) => {
  switch (orderStatus) {
    case 'Draft':
      return 'default';
    case 'Packaging':
      return 'info';
    case 'Completed':
      return 'success';
    case 'Canceled':
      return 'error';
    case 'Pending':
      return 'warning';
    default:
      return 'default';
  }
};

const getPaymentStatusColor = (paymentStatus) => {
  switch (paymentStatus) {
    case 'Paid':
      return 'success';
    case 'Pending':
      return 'warning';
    case 'Failed':
      return 'error';
    case 'Refunded':
      return 'info';
    default:
      return 'default';
  }
};
import PageContainer from 'src/components/container/PageContainer';
import {
  getPendingOrders,
  processOrder,
  cancelOrder,
  getOrdersStats,
} from '../../../api/orders/ordersService';

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'processing':
      return 'info';
    case 'shipped':
      return 'primary';
    case 'delivered':
      return 'success';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'processing':
      return 'Processing';
    case 'shipped':
      return 'Shipped';
    case 'delivered':
      return 'Delivered';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
};

export default function PendingOrders() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [stats, setStats] = useState({ totalPending: 0, pendingRevenue: 0 });

  // تحميل البيانات عند بدء الصفحة
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const pendingOrders = getPendingOrders();
    const ordersStats = getOrdersStats();
    setOrders(pendingOrders);
    setStats(ordersStats);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedOrder(null);
  };

  const handleProcessOrder = (orderId) => {
    const processedOrder = processOrder(orderId);
    if (processedOrder) {
      loadOrders(); // إعادة تحميل البيانات
      setSnackbar({
        open: true,
        message: `Order ${orderId} has been processed and moved to received orders!`,
        severity: 'success',
      });
      handleCloseDialog();
    }
  };

  const handleCancelOrder = (orderId) => {
    const cancelled = cancelOrder(orderId);
    if (cancelled) {
      loadOrders(); // إعادة تحميل البيانات
      setSnackbar({
        open: true,
        message: `Order ${orderId} has been cancelled!`,
        severity: 'info',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderItemsDisplay = (items) => {
    if (!items || items.length === 0) return 'No items';

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
      <Typography variant="body2" fontWeight={600}>
        {totalItems} item{totalItems > 1 ? 's' : ''}
      </Typography>
    );
  };

  return (
    <PageContainer title="Pending Orders" description="Manage pending customer orders">
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h3" fontWeight={700} sx={{ mb: 2 }}>
            Pending Orders
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Manage and process customer orders that are awaiting fulfillment
          </Typography>
        </Box>

        <Alert severity="info" sx={{ m: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="body2">
            <strong>{stats.totalPending}</strong> orders are currently pending. Review and process
            them to move to the next stage.
          </Typography>
        </Alert>

        {/* Search and Filters */}
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Search Orders"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Badge badgeContent={stats.totalPending} color="primary">
                  <Chip
                    icon={<ShoppingCartIcon />}
                    label="Total Pending"
                    color="primary"
                    variant="outlined"
                  />
                </Badge>
                <Chip
                  icon={<PaymentIcon />}
                  label={`$${stats.pendingRevenue.toLocaleString()}`}
                  color="secondary"
                  variant="outlined"
                />
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* Orders Table */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <TableContainer
            sx={{
              height: '100%',
              width: '100%',
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Order ID</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Customer</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Items</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Total</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Payment Method</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Payment Status</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Order Status</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Created At</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Delivery Number</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {order.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Avatar sx={{ width: 24, height: 24 }}>
                            <PersonIcon fontSize="small" />
                          </Avatar>
                          <Typography variant="body2" fontWeight={600}>
                            {order.customer.name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{renderItemsDisplay(order.items)}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          ${order.total}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={order.paymentMethod}
                          size="small"
                          variant="outlined"
                          color="secondary"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={order.paymentStatus || 'Pending'}
                          color={getPaymentStatusColor(order.paymentStatus)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={order.orderStatus || 'Pending'}
                          color={getOrderStatusColor(order.orderStatus)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {order.createdDate
                            ? formatDate(order.createdDate)
                            : formatDate(order.orderDate)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600} color="primary">
                          {order.deliveryNumber || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton
                            color="primary"
                            onClick={() => handleViewOrder(order)}
                            size="small"
                            title="View Details"
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton
                            color="success"
                            onClick={() => handleProcessOrder(order.id)}
                            size="small"
                            title="Process Order"
                          >
                            <CheckCircleIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleCancelOrder(order.id)}
                            size="small"
                            title="Cancel Order"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      <Typography variant="body1" color="text.secondary">
                        No pending orders found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Order Details Dialog */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          {selectedOrder && (
            <>
              <DialogTitle>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <ShoppingCartIcon color="primary" />
                  <Box>
                    <Typography variant="h6">Order Details - {selectedOrder.id}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Placed on {formatDate(selectedOrder.orderDate)}
                    </Typography>
                  </Box>
                </Stack>
              </DialogTitle>

              <DialogContent>
                <Grid container spacing={3}>
                  {/* Customer Information */}
                  <Grid size={12}>
                    <Typography variant="h6" gutterBottom>
                      Customer Information
                    </Typography>
                    <Paper sx={{ p: 2 }}>
                      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                        <Avatar sx={{ width: 48, height: 48 }}>
                          <PersonIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h6">{selectedOrder.customer.name}</Typography>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <EmailIcon fontSize="small" color="action" />
                            <Typography variant="body2">{selectedOrder.customer.email}</Typography>
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <PhoneIcon fontSize="small" color="action" />
                            <Typography variant="body2">{selectedOrder.customer.phone}</Typography>
                          </Stack>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>

                  {/* Order Items */}
                  <Grid size={12}>
                    <Typography variant="h6" gutterBottom>
                      Order Items
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              <strong>Item</strong>
                            </TableCell>
                            <TableCell>
                              <strong>Quantity</strong>
                            </TableCell>
                            <TableCell>
                              <strong>Price</strong>
                            </TableCell>
                            <TableCell>
                              <strong>Total</strong>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedOrder.items.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>${item.price}</TableCell>
                              <TableCell>${item.price * item.quantity}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>

                  {/* Order Summary */}
                  <Grid size={12}>
                    <Typography variant="h6" gutterBottom>
                      Order Summary
                    </Typography>
                    <Paper sx={{ p: 2 }}>
                      <Stack spacing={2}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography>Subtotal:</Typography>
                          <Typography>${selectedOrder.total}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography>Shipping:</Typography>
                          <Typography>Free</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography>Tax:</Typography>
                          <Typography>$0.00</Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          sx={{ borderTop: 1, borderColor: 'divider', pt: 1 }}
                        >
                          <Typography variant="h6">Total:</Typography>
                          <Typography variant="h6">${selectedOrder.total}</Typography>
                        </Stack>
                      </Stack>
                    </Paper>
                  </Grid>

                  {/* Shipping Information */}
                  <Grid size={12}>
                    <Typography variant="h6" gutterBottom>
                      Shipping Information
                    </Typography>
                    <Paper sx={{ p: 2 }}>
                      <Stack spacing={2}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <LocationIcon color="action" />
                          <Typography variant="body2">{selectedOrder.shippingAddress}</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <PaymentIcon color="action" />
                          <Typography variant="body2">
                            Payment: {selectedOrder.paymentMethod}
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <AccessTimeIcon color="action" />
                          <Typography variant="body2">
                            Estimated Delivery: {formatDate(selectedOrder.estimatedDelivery)}
                          </Typography>
                        </Stack>
                        {selectedOrder.notes && (
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Notes:</strong> {selectedOrder.notes}
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </Paper>
                  </Grid>
                </Grid>
              </DialogContent>

              <DialogActions>
                <Button onClick={handleCloseDialog}>Close</Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleProcessOrder(selectedOrder.id)}
                >
                  Process Order
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Snackbar for notifications */}
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
}


