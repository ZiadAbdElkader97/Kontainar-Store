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
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import PageContainer from 'src/components/container/PageContainer';
import {
  getAllOrders,
  getPendingOrders,
  getReceivedOrders,
  processOrder,
  cancelOrder,
  completeOrder,
  getOrdersStats,
} from '../../../api/orders/ordersService';

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'processing':
      return 'info';
    case 'received':
      return 'success';
    case 'completed':
      return 'primary';
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
    case 'received':
      return 'Received';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
};

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

const renderStars = (rating) => {
  if (!rating) return null;
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

export default function ListOrders() {
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [stats, setStats] = useState({
    totalPending: 0,
    totalReceived: 0,
    totalRevenue: 0,
    averageRating: 0,
  });
  const [currentTab, setCurrentTab] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  // تحميل البيانات عند بدء الصفحة
  useEffect(() => {
    loadOrders();
  }, []);

  // تطبيق الفلاتر عند تغيير أي قيمة
  useEffect(() => {
    applyFilters();
  }, [allOrders, searchTerm, statusFilter, paymentFilter, currentTab]);

  const loadOrders = () => {
    const orders = getAllOrders();
    const allOrdersList = [...orders.pending, ...orders.received];
    const ordersStats = getOrdersStats();
    setAllOrders(allOrdersList);
    setStats(ordersStats);
  };

  const applyFilters = () => {
    let filtered = [...allOrders];

    // فلتر حسب التاب
    if (currentTab === 1) {
      filtered = filtered.filter((order) => order.status === 'pending');
    } else if (currentTab === 2) {
      filtered = filtered.filter((order) => order.status === 'received');
    }

    // فلتر حسب الحالة
    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.orderStatus === statusFilter);
    }

    // فلتر حسب طريقة الدفع
    if (paymentFilter !== 'all') {
      filtered = filtered.filter((order) => order.paymentMethod === paymentFilter);
    }

    // فلتر حسب البحث
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredOrders(filtered);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handlePaymentFilterChange = (event) => {
    setPaymentFilter(event.target.value);
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
      loadOrders();
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
      loadOrders();
      setSnackbar({
        open: true,
        message: `Order ${orderId} has been cancelled!`,
        severity: 'info',
      });
    }
  };

  const handleCompleteOrder = (orderId) => {
    const completed = completeOrder(orderId);
    if (completed) {
      loadOrders();
      setSnackbar({
        open: true,
        message: `Order ${orderId} has been marked as completed!`,
        severity: 'success',
      });
      handleCloseDialog();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

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

  const getPaymentMethods = () => {
    const methods = [...new Set(allOrders.map((order) => order.paymentMethod))];
    return methods;
  };

  return (
    <PageContainer title="All Orders" description="Comprehensive view of all customer orders">
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h3" fontWeight={700} sx={{ mb: 2 }}>
            All Orders Management
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Comprehensive view and management of all customer orders across all statuses
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <ShoppingCartIcon color="primary" sx={{ fontSize: 40 }} />
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        {allOrders.length}
                      </Typography>
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
                    <CheckCircleIcon color="warning" sx={{ fontSize: 40 }} />
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        {stats.totalPending}
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
                    <PaymentIcon color="success" sx={{ fontSize: 40 }} />
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        ${stats.totalRevenue.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Revenue
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
                        Average Rating
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={handleTabChange} aria-label="orders tabs">
            <Tab label={`All Orders (${allOrders.length})`} />
            <Tab label={`Pending (${stats.totalPending})`} />
            <Tab label={`Received (${stats.totalReceived})`} />
          </Tabs>
        </Box>

        {/* Search and Filters */}
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
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
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Order Status Filter</InputLabel>
                <Select
                  value={statusFilter}
                  label="Order Status Filter"
                  onChange={handleStatusFilterChange}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="Draft">Draft</MenuItem>
                  <MenuItem value="Packaging">Packaging</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Canceled">Canceled</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={paymentFilter}
                  label="Payment Method"
                  onChange={handlePaymentFilterChange}
                >
                  <MenuItem value="all">All Methods</MenuItem>
                  {getPaymentMethods().map((method) => (
                    <MenuItem key={method} value={method}>
                      {method}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadOrders} fullWidth>
                Refresh
              </Button>
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
                    <strong>Rating</strong>
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
                          label={
                            order.status === 'received'
                              ? 'Received'
                              : order.orderStatus || 'Pending'
                          }
                          color={
                            order.status === 'received'
                              ? 'info'
                              : getOrderStatusColor(order.orderStatus)
                          }
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
                        {order.rating ? (
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            {renderStars(order.rating)}
                            <Typography variant="caption" sx={{ ml: 1 }}>
                              ({order.rating}/5)
                            </Typography>
                          </Stack>
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            No rating
                          </Typography>
                        )}
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
                          {order.status === 'pending' && (
                            <IconButton
                              color="success"
                              onClick={() => handleProcessOrder(order.id)}
                              size="small"
                              title="Process Order"
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          )}
                          {order.status === 'received' && (
                            <IconButton
                              color="primary"
                              onClick={() => handleCompleteOrder(order.id)}
                              size="small"
                              title="Mark as Completed"
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          )}
                          {order.status === 'pending' && (
                            <IconButton
                              color="error"
                              onClick={() => handleCancelOrder(order.id)}
                              size="small"
                              title="Cancel Order"
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={11} align="center">
                      <Typography variant="body1" color="text.secondary">
                        No orders found matching your criteria
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

                  {/* Additional Information */}
                  <Grid size={12}>
                    <Typography variant="h6" gutterBottom>
                      Additional Information
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
                            Status: {getStatusLabel(selectedOrder.status)}
                          </Typography>
                        </Stack>
                        {selectedOrder.receivedDate && (
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <CheckCircleIcon color="action" />
                            <Typography variant="body2">
                              Received: {formatDate(selectedOrder.receivedDate)}
                            </Typography>
                          </Stack>
                        )}
                        {selectedOrder.rating && (
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <StarIcon color="action" />
                            <Typography variant="body2">
                              Rating: {selectedOrder.rating}/5
                            </Typography>
                          </Stack>
                        )}
                        {selectedOrder.review && (
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Review:</strong> {selectedOrder.review}
                            </Typography>
                          </Box>
                        )}
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
                {selectedOrder.status === 'pending' && (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleProcessOrder(selectedOrder.id)}
                  >
                    Process Order
                  </Button>
                )}
                {selectedOrder.status === 'received' && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleCompleteOrder(selectedOrder.id)}
                  >
                    Mark as Completed
                  </Button>
                )}
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


