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
  Rating,
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
  Store as StoreIcon,
  Business as BusinessIcon,
  Verified as VerifiedIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer.jsx';
import {
  getAllSellers,
  getActiveSellers,
  getPendingSellers,
  getSuspendedSellers,
  deleteSeller,
  restoreSeller,
  permanentDeleteSeller,
  searchSellers,
  getSellerStats,
  getAllBusinessTypes,
  getAllTags,
} from '../../../api/user-management/SellersData.js';

const ListSellers = () => {
  const navigate = useNavigate();
  const [sellers, setSellers] = useState([]);
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [businessTypeFilter, setBusinessTypeFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    suspended: 0,
    deleted: 0,
    verified: 0,
    businessTypes: 0,
    businessTypeStats: {},
    totalSales: 0,
    totalOrders: 0,
    averageRating: 0,
  });

  const statusOptions = [
    { value: 'all', label: 'All Sellers' },
    { value: 'active', label: 'Active Sellers' },
    { value: 'pending', label: 'Pending Sellers' },
    { value: 'suspended', label: 'Suspended Sellers' },
    { value: 'deleted', label: 'Deleted Sellers' },
  ];

  const verificationOptions = [
    { value: 'all', label: 'All Verification' },
    { value: 'verified', label: 'Verified' },
    { value: 'pending', label: 'Pending Verification' },
  ];

  const [businessTypes, setBusinessTypes] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    loadSellers();
    loadStats();
    loadBusinessTypes();
    loadTags();
  }, []);

  useEffect(() => {
    filterSellers();
  }, [sellers, searchQuery, statusFilter, businessTypeFilter, verificationFilter]);

  const loadSellers = () => {
    try {
      const allSellers = getAllSellers();
      setSellers(allSellers);
    } catch (err) {
      setError('Failed to load sellers');
    }
  };

  const loadStats = () => {
    try {
      const sellerStats = getSellerStats();
      setStats(sellerStats);
    } catch (err) {
      setError('Failed to load statistics');
    }
  };

  const loadBusinessTypes = () => {
    try {
      const allBusinessTypes = getAllBusinessTypes();
      setBusinessTypes(allBusinessTypes);
    } catch (err) {
      setError('Failed to load business types');
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

  const filterSellers = () => {
    let filtered = [...sellers];

    // Search filter
    if (searchQuery) {
      filtered = searchSellers(searchQuery);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((seller) => seller.status === statusFilter);
    }

    // Business type filter
    if (businessTypeFilter !== 'all') {
      filtered = filtered.filter((seller) => seller.businessType === businessTypeFilter);
    }

    // Verification filter
    if (verificationFilter !== 'all') {
      filtered = filtered.filter((seller) => seller.verificationStatus === verificationFilter);
    }

    setFilteredSellers(filtered);
  };

  const handleViewSeller = (seller) => {
    setSelectedSeller(seller);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedSeller(null);
  };

  const handleEditSeller = (seller) => {
    navigate(`/user-manage/sellers/edit/${seller.id}`);
  };

  const handleDelete = async (seller) => {
    // Soft delete - always soft delete first
    if (
      window.confirm(
        `Are you sure you want to delete the seller "${seller.firstName} ${seller.lastName}"?`,
      )
    ) {
      setLoading(true);
      setError('');
      setSuccess('');

      try {
        await deleteSeller(seller.id);
        setSuccess('Seller deleted successfully');
        loadSellers();
        loadStats();

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSuccess('');
        }, 5000);
      } catch (err) {
        setError(err.message || 'Failed to delete seller');
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePermanentDelete = async (seller) => {
    // Permanent delete
    if (
      window.confirm(
        `Are you sure you want to permanently delete the seller "${seller.firstName} ${seller.lastName}"? This action cannot be undone!`,
      )
    ) {
      setLoading(true);
      setError('');
      setSuccess('');

      try {
        await permanentDeleteSeller(seller.id);
        setSuccess('Seller permanently deleted');
        loadSellers();
        loadStats();

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSuccess('');
        }, 5000);
      } catch (err) {
        setError(err.message || 'Failed to permanently delete seller');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRestore = async (seller) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await restoreSeller(seller.id);
      setSuccess('Seller restored successfully');
      loadSellers();
      loadStats();

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccess('');
      }, 5000);
    } catch (err) {
      setError(err.message || 'Failed to restore seller');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'success',
      pending: 'warning',
      suspended: 'error',
      deleted: 'error',
    };
    return colors[status] || 'default';
  };

  const getVerificationColor = (status) => {
    const colors = {
      verified: 'success',
      pending: 'warning',
    };
    return colors[status] || 'default';
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
  const totalPages = Math.ceil(filteredSellers.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedSellers = filteredSellers.slice(startIndex, endIndex);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <PageContainer title="Sellers Management" description="Manage sellers and vendors">
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" gutterBottom>
                Sellers Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage sellers, vendors, and marketplace participants
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/user-manage/sellers/create')}
            >
              Add New Seller
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
                    <StoreIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{stats.total}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Sellers
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
                    <StoreIcon />
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
                  <Avatar sx={{ bgcolor: 'info.main' }}>
                    <VerifiedIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{stats.verified}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Verified
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
                    <MoneyIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{formatCurrency(stats.totalSales)}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Sales
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
                    <StarIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{stats.averageRating.toFixed(1)}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Avg Rating
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
                  placeholder="Search sellers..."
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
                  <InputLabel>Business Type</InputLabel>
                  <Select
                    value={businessTypeFilter}
                    label="Business Type"
                    onChange={(e) => setBusinessTypeFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    {businessTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Verification</InputLabel>
                  <Select
                    value={verificationFilter}
                    label="Verification"
                    onChange={(e) => setVerificationFilter(e.target.value)}
                  >
                    {verificationOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
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

        {/* Sellers Table */}
        <Card>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Seller</TableCell>
                    <TableCell>Business</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Sales</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Verification</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedSellers.map((seller) => (
                    <TableRow key={seller.id} hover>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar
                            sx={{
                              bgcolor: 'primary.main',
                              width: 40,
                              height: 40,
                              opacity: seller.status === 'deleted' ? 0.5 : 1,
                            }}
                          >
                            {getInitials(seller.firstName, seller.lastName)}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                textDecoration:
                                  seller.status === 'deleted' ? 'line-through' : 'none',
                                opacity: seller.status === 'deleted' ? 0.6 : 1,
                              }}
                            >
                              {seller.firstName} {seller.lastName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {seller.sellerId}
                            </Typography>
                            {seller.status === 'deleted' && (
                              <Typography variant="caption" color="error" display="block">
                                Deleted
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {seller.businessName}
                          </Typography>
                          <Chip
                            label={seller.businessType}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <EmailIcon fontSize="small" color="action" />
                            <Typography variant="body2">{seller.email}</Typography>
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <PhoneIcon fontSize="small" color="action" />
                            <Typography variant="body2">{seller.phone}</Typography>
                          </Stack>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" color="success.main" fontWeight="medium">
                            {formatCurrency(seller.totalSales || 0)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {seller.totalOrders || 0} orders
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Rating
                            value={seller.rating || 0}
                            precision={0.1}
                            size="small"
                            readOnly
                          />
                          <Typography variant="caption" color="text.secondary">
                            ({seller.totalReviews || 0})
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={seller.status}
                          size="small"
                          color={getStatusColor(seller.status)}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={seller.verificationStatus}
                          size="small"
                          color={getVerificationColor(seller.verificationStatus)}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="View Details">
                            <IconButton size="small" onClick={() => handleViewSeller(seller)}>
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          {seller.status !== 'deleted' && (
                            <Tooltip title="Edit Seller">
                              <span>
                                <IconButton size="small" onClick={() => handleEditSeller(seller)}>
                                  <EditIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                          )}
                          {seller.status === 'deleted' ? (
                            <>
                              <Tooltip title="Restore Seller">
                                <IconButton
                                  size="small"
                                  onClick={() => handleRestore(seller)}
                                  color="success"
                                >
                                  <RestoreIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Forever">
                                <span>
                                  <IconButton
                                    size="small"
                                    onClick={() => handlePermanentDelete(seller)}
                                    color="error"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </>
                          ) : (
                            <Tooltip title="Delete Seller">
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDelete(seller)}
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
            {filteredSellers.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No sellers found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your search or filter criteria
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* View Seller Dialog */}
        <Dialog open={viewDialogOpen} onClose={handleCloseViewDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                {selectedSeller && getInitials(selectedSeller.firstName, selectedSeller.lastName)}
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {selectedSeller?.firstName} {selectedSeller?.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Seller Details
                </Typography>
              </Box>
            </Stack>
          </DialogTitle>
          <DialogContent>
            {selectedSeller && (
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
                      {selectedSeller.firstName} {selectedSeller.lastName}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Seller ID
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedSeller.sellerId}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Date of Birth
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedSeller.dateOfBirth
                        ? new Date(selectedSeller.dateOfBirth).toLocaleDateString()
                        : 'Not provided'}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Gender
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedSeller.gender || 'Not specified'}
                    </Typography>
                  </Grid>
                </Grid>

                {/* Business Information */}
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Business Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Business Name
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedSeller.businessName}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Business Type
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      <Chip
                        label={selectedSeller.businessType}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Business License
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedSeller.businessLicense}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Tax ID
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedSeller.taxId}
                    </Typography>
                  </Grid>
                </Grid>

                {/* Sales Statistics */}
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Sales Statistics
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Sales
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ mb: 2 }}
                      color="success.main"
                      fontWeight="medium"
                    >
                      {formatCurrency(selectedSeller.totalSales || 0)}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Orders
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedSeller.totalOrders || 0}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Commission Rate
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedSeller.commissionRate}%
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Rating
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                      <Rating
                        value={selectedSeller.rating || 0}
                        precision={0.1}
                        size="small"
                        readOnly
                      />
                      <Typography variant="body2" color="text.secondary">
                        ({selectedSeller.totalReviews || 0} reviews)
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Join Date
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {new Date(selectedSeller.joinDate).toLocaleDateString()}
                    </Typography>
                  </Grid>
                </Grid>

                {/* Store Settings */}
                {selectedSeller.storeSettings && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                      Store Settings
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Store Name
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {selectedSeller.storeSettings.storeName}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Store Description
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {selectedSeller.storeSettings.storeDescription}
                        </Typography>
                      </Grid>
                      {selectedSeller.storeSettings.storeCategories &&
                        selectedSeller.storeSettings.storeCategories.length > 0 && (
                          <Grid size={{ xs: 12 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Store Categories
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                              {selectedSeller.storeSettings.storeCategories.map((category) => (
                                <Chip
                                  key={category}
                                  label={category}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              ))}
                            </Stack>
                          </Grid>
                        )}
                    </Grid>
                  </>
                )}

                {/* Tags */}
                {selectedSeller.tags && selectedSeller.tags.length > 0 && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                      Tags
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {selectedSeller.tags.map((tag) => (
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
                {selectedSeller.notes && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                      Notes
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedSeller.notes}
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
                      Join Date
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {new Date(selectedSeller.joinDate).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Last Login
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedSeller.lastLogin
                        ? new Date(selectedSeller.lastLogin).toLocaleString()
                        : 'Never'}
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
            {selectedSeller && selectedSeller.status !== 'deleted' && (
              <Button
                onClick={() => {
                  handleCloseViewDialog();
                  handleEditSeller(selectedSeller);
                }}
                variant="contained"
                color="primary"
              >
                Edit Seller
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    </PageContainer>
  );
};

export default ListSellers;
