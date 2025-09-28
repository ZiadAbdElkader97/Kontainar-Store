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
  LocalShipping as ShippingIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  AccessTime as AccessTimeIcon,
  Payment as PaymentIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
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
import { getReceivedOrders, completeOrder, getOrdersStats } from '../../../services/ordersService';

const getStatusColor = (status) => {
  switch (status) {
    case 'received':
      return 'success';
    case 'delivered':
      return 'primary';
    case 'completed':
      return 'success';
    default:
      return 'default';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'received':
      return 'Received';
    case 'delivered':
      return 'Delivered';
    case 'completed':
      return 'Completed';
    default:
      return status;
  }
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

export default function ReceivedOrders() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [stats, setStats] = useState({
    totalReceived: 0,
    totalRevenue: 0,
    averageRating: 0,
  });

  // تحميل البيانات عند بدء الصفحة
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const receivedOrders = getReceivedOrders();
    const ordersStats = getOrdersStats();
    setOrders(receivedOrders);
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

  const handleMarkAsCompleted = (orderId) => {
    const completed = completeOrder(orderId);
    if (completed) {
      loadOrders(); // إعادة تحميل البيانات
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
    <PageContainer title="Received Orders" description="View and manage received customer orders">
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h3" fontWeight={700} sx={{ mb: 2 }}>
            Received Orders
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Track and manage orders that have been successfully delivered to customers
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        {stats.totalReceived}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Received
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
                    <PaymentIcon color="primary" sx={{ fontSize: 40 }} />
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
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <ShippingIcon color="info" sx={{ fontSize: 40 }} />
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        {orders.filter((o) => o.status === 'received').length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pending Completion
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Alert severity="success" sx={{ m: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="body2">
            <strong>{stats.totalReceived}</strong> orders have been successfully received by
            customers. All orders are eligible for completion and feedback collection.
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
                <Badge
                  badgeContent={orders.filter((o) => o.status === 'received').length}
                  color="primary"
                >
                  <Chip
                    icon={<CheckCircleIcon />}
                    label="Received"
                    color="success"
                    variant="outlined"
                  />
                </Badge>
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
                          label={order.paymentStatus || 'Paid'}
                          color={getPaymentStatusColor(order.paymentStatus)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip label="Received" color="info" size="small" />
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
                          {order.status === 'received' && (
                            <IconButton
                              color="success"
                              onClick={() => handleMarkAsCompleted(order.id)}
                              size="small"
                              title="Mark as Completed"
                            >
                              <CheckCircleIcon />
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
                        No received orders found
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
                  <CheckCircleIcon color="success" />
                  <Box>
                    <Typography variant="h6">Order Details - {selectedOrder.id}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Received on {formatDate(selectedOrder.receivedDate)}
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

                  {/* Customer Review */}
                  <Grid size={12}>
                    <Typography variant="h6" gutterBottom>
                      Customer Review
                    </Typography>
                    <Paper sx={{ p: 2 }}>
                      <Stack spacing={2}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="body2">Rating:</Typography>
                          {renderStars(selectedOrder.rating)}
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            ({selectedOrder.rating}/5)
                          </Typography>
                        </Stack>
                        {selectedOrder.review && (
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Review:</strong> {selectedOrder.review}
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </Paper>
                  </Grid>

                  {/* Delivery Information */}
                  <Grid size={12}>
                    <Typography variant="h6" gutterBottom>
                      Delivery Information
                    </Typography>
                    <Paper sx={{ p: 2 }}>
                      <Stack spacing={2}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <LocationIcon color="action" />
                          <Typography variant="body2">{selectedOrder.shippingAddress}</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <AccessTimeIcon color="action" />
                          <Typography variant="body2">
                            Delivered: {formatDate(selectedOrder.deliveryDate)}
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <ShippingIcon color="action" />
                          <Typography variant="body2">
                            Tracking: {selectedOrder.trackingNumber}
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
                {selectedOrder.status === 'received' && (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => {
                      handleMarkAsCompleted(selectedOrder.id);
                      handleCloseDialog();
                    }}
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


