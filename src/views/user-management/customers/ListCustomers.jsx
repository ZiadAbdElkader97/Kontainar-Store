import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
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
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  Stack,
  Grid,
  Alert,
  LinearProgress,
  Pagination,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Person as PersonIcon,
  Restore as RestoreIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  AttachMoney as MoneyIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer.jsx';
import {
  getAllCustomers,
  getActiveCustomers,
  getInactiveCustomers,
  deleteCustomer,
  restoreCustomer,
  permanentDeleteCustomer,
  searchCustomers,
  getCustomerStats,
  getAllCities,
  getAllTags,
} from '../../../api/user-management/CustomersData.js';

const ListCustomers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    deleted: 0,
    premium: 0,
    regular: 0,
    new: 0,
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    cities: 0,
    cityStats: {},
  });

  const statusOptions = [
    { value: 'all', label: 'All Customers' },
    { value: 'active', label: 'Active Customers' },
    { value: 'inactive', label: 'Inactive Customers' },
    { value: 'deleted', label: 'Deleted Customers' },
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'premium', label: 'Premium' },
    { value: 'regular', label: 'Regular' },
    { value: 'new', label: 'New' },
  ];

  const [cities, setCities] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    loadCustomers();
    loadStats();
    loadCities();
    loadTags();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchQuery, statusFilter, typeFilter, cityFilter]);

  const loadCustomers = () => {
    try {
      const allCustomers = getAllCustomers();
      setCustomers(allCustomers);
    } catch (err) {
      setError('Failed to load customers');
    }
  };

  const loadStats = () => {
    try {
      const customerStats = getCustomerStats();
      setStats(customerStats);
    } catch (err) {
      setError('Failed to load statistics');
    }
  };

  const loadCities = () => {
    try {
      const allCities = getAllCities();
      setCities(allCities);
    } catch (err) {
      setError('Failed to load cities');
    }
  };

  const loadTags = () => {
    try {
      const allTags = getAllTags();
      setTags(allTags);
    } catch (err) {
      setError('Failed to load tags');
    }
  };

  const filterCustomers = () => {
    let filtered = [...customers];

    // Search filter
    if (searchQuery) {
      filtered = searchCustomers(searchQuery);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((customer) => customer.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter((customer) => customer.customerType === typeFilter);
    }

    // City filter
    if (cityFilter !== 'all') {
      filtered = filtered.filter((customer) => customer.address.city === cityFilter);
    }

    setFilteredCustomers(filtered);
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedCustomer(null);
  };

  const handleEditCustomer = (customer) => {
    navigate(`/user-manage/customers/edit/${customer.id}`);
  };

  const handleDelete = async (customer) => {
    // Soft delete - always soft delete first
    if (window.confirm(`Are you sure you want to delete the customer "${customer.firstName} ${customer.lastName}"?`)) {
      setLoading(true);
      setError('');
      setSuccess('');

      try {
        await deleteCustomer(customer.id);
        setSuccess('Customer deleted successfully');
        loadCustomers();
        loadStats();
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSuccess('');
        }, 5000);
      } catch (err) {
        setError(err.message || 'Failed to delete customer');
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePermanentDelete = async (customer) => {
    // Permanent delete
    if (window.confirm(`Are you sure you want to permanently delete the customer "${customer.firstName} ${customer.lastName}"? This action cannot be undone!`)) {
      setLoading(true);
      setError('');
      setSuccess('');

      try {
        await permanentDeleteCustomer(customer.id);
        setSuccess('Customer permanently deleted');
        loadCustomers();
        loadStats();
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSuccess('');
        }, 5000);
      } catch (err) {
        setError(err.message || 'Failed to permanently delete customer');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRestore = async (customer) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await restoreCustomer(customer.id);
      setSuccess('Customer restored successfully');
      loadCustomers();
      loadStats();
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccess('');
      }, 5000);
    } catch (err) {
      setError(err.message || 'Failed to restore customer');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': 'success',
      'inactive': 'warning',
      'deleted': 'error',
    };
    return colors[status] || 'default';
  };

  const getTypeColor = (type) => {
    const colors = {
      'premium': 'error',
      'regular': 'primary',
      'new': 'success',
    };
    return colors[type] || 'default';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency: 'EGP',
    }).format(amount);
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <PageContainer title="Customers Management" description="Manage customer accounts and information">
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" gutterBottom>
                Customers Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage customer accounts, orders, and information
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/user-manage/customers/create')}
            >
              Add New Customer
            </Button>
          </Stack>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{stats.total}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Customers
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'success.main' }}>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{stats.active}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'error.main' }}>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{stats.premium}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Premium
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'info.main' }}>
                    <MoneyIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{formatCurrency(stats.totalRevenue)}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Revenue
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'warning.main' }}>
                    <CartIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{stats.totalOrders}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Orders
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
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={typeFilter}
                    label="Type"
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    {typeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>City</InputLabel>
                  <Select
                    value={cityFilter}
                    label="City"
                    onChange={(e) => setCityFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Cities</MenuItem>
                    {cities.map((city) => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

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

        {/* Loading */}
        {loading && <LinearProgress sx={{ mb: 2 }} />}

        {/* Customers Table */}
        <Card>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Customer</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Orders</TableCell>
                    <TableCell>Total Spent</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedCustomers.map((customer) => (
                    <TableRow key={customer.id} hover>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar
                            sx={{
                              bgcolor: 'primary.main',
                              width: 40,
                              height: 40,
                              opacity: customer.status === 'deleted' ? 0.5 : 1,
                            }}
                          >
                            {getInitials(customer.firstName, customer.lastName)}
                          </Avatar>
                          <Box>
                            <Typography 
                              variant="subtitle2"
                              sx={{ 
                                textDecoration: customer.status === 'deleted' ? 'line-through' : 'none',
                                opacity: customer.status === 'deleted' ? 0.6 : 1,
                              }}
                            >
                              {customer.firstName} {customer.lastName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {customer.id}
                            </Typography>
                            {customer.status === 'deleted' && (
                              <Typography variant="caption" color="error" display="block">
                                Deleted
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <EmailIcon fontSize="small" color="action" />
                            <Typography variant="body2">{customer.email}</Typography>
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <PhoneIcon fontSize="small" color="action" />
                            <Typography variant="body2">{customer.phone}</Typography>
                          </Stack>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <LocationIcon fontSize="small" color="action" />
                          <Typography variant="body2">{customer.address.city}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={customer.customerType}
                          size="small"
                          color={getTypeColor(customer.customerType)}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {customer.totalOrders || 0} orders
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="success.main" fontWeight="medium">
                          {formatCurrency(customer.totalSpent || 0)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={customer.status}
                          size="small"
                          color={getStatusColor(customer.status)}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleViewCustomer(customer)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          {customer.status !== 'deleted' && (
                            <Tooltip title="Edit Customer">
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditCustomer(customer)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                          )}
                          {customer.status === 'deleted' ? (
                            <>
                              <Tooltip title="Restore Customer">
                                <IconButton
                                  size="small"
                                  onClick={() => handleRestore(customer)}
                                  color="success"
                                >
                                  <RestoreIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Forever">
                                <span>
                                  <IconButton
                                    size="small"
                                    onClick={() => handlePermanentDelete(customer)}
                                    color="error"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </>
                          ) : (
                            <Tooltip title="Delete Customer">
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDelete(customer)}
                                  color="error"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}

            {/* No data message */}
            {filteredCustomers.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No customers found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your search or filter criteria
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* View Customer Dialog */}
        <Dialog
          open={viewDialogOpen}
          onClose={handleCloseViewDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                {selectedCustomer && getInitials(selectedCustomer.firstName, selectedCustomer.lastName)}
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {selectedCustomer?.firstName} {selectedCustomer?.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Customer Details
                </Typography>
              </Box>
            </Stack>
          </DialogTitle>
          <DialogContent>
            {selectedCustomer && (
              <Box>
                {/* Basic Information */}
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Full Name
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedCustomer.firstName} {selectedCustomer.lastName}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Date of Birth
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedCustomer.dateOfBirth ? new Date(selectedCustomer.dateOfBirth).toLocaleDateString() : 'Not provided'}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Gender
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedCustomer.gender || 'Not specified'}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Customer ID
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedCustomer.id}
                    </Typography>
                  </Grid>
                </Grid>

                {/* Contact Information */}
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Contact Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedCustomer.email}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedCustomer.phone}
                    </Typography>
                  </Grid>
                </Grid>

                {/* Address */}
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Address
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Street Address
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedCustomer.address.street}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      City
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedCustomer.address.city}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      State
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedCustomer.address.state}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Zip Code
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedCustomer.address.zipCode}
                    </Typography>
                  </Grid>
                </Grid>

                {/* Customer Stats */}
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Customer Statistics
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Customer Type
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      <Chip
                        label={selectedCustomer.customerType}
                        size="small"
                        color={getTypeColor(selectedCustomer.customerType)}
                        variant="outlined"
                      />
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Orders
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedCustomer.totalOrders || 0}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Spent
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }} color="success.main" fontWeight="medium">
                      {formatCurrency(selectedCustomer.totalSpent || 0)}
                    </Typography>
                  </Grid>
                </Grid>

                {/* Tags */}
                {selectedCustomer.tags && selectedCustomer.tags.length > 0 && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                      Tags
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {selectedCustomer.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  </>
                )}

                {/* Notes */}
                {selectedCustomer.notes && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                      Notes
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedCustomer.notes}
                    </Typography>
                  </>
                )}

                {/* Timestamps */}
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Timestamps
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Registration Date
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {new Date(selectedCustomer.registrationDate).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Last Login
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedCustomer.lastLogin ? new Date(selectedCustomer.lastLogin).toLocaleString() : 'Never'}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseViewDialog} color="primary">
              Close
            </Button>
            {selectedCustomer && selectedCustomer.status !== 'deleted' && (
              <Button
                onClick={() => {
                  handleCloseViewDialog();
                  handleEditCustomer(selectedCustomer);
                }}
                variant="contained"
                color="primary"
              >
                Edit Customer
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    </PageContainer>
  );
};

export default ListCustomers;
