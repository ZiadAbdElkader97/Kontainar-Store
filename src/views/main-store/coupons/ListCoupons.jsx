import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Restore as RestoreIcon,
  Visibility as ViewIcon,
  LocalOffer as CouponIcon,
  CalendarToday as DateIcon,
  People as UsageIcon,
  AttachMoney as MoneyIcon,
  Percent as PercentIcon,
  ToggleOn as ActiveIcon,
  ToggleOff as InactiveIcon,
} from '@mui/icons-material';
import PageContainer from 'src/components/container/PageContainer.jsx';
import {
  getAllCoupons,
  deleteCoupon,
  permanentDeleteCoupon,
  restoreCoupon,
  searchCoupons,
  getCouponsByStatus,
  toggleCouponStatus,
  getCouponsStats,
} from '../../../api/coupons/CouponsData.js';

const ListCoupons = () => {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    scheduled: 0,
    expired: 0,
    deleted: 0,
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // View dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const statusOptions = [
    { value: 'all', label: 'All Coupons' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'expired', label: 'Expired' },
    { value: 'deleted', label: 'Deleted' },
  ];

  useEffect(() => {
    loadCoupons();
    loadStats();
  }, []);

  const loadCoupons = () => {
    try {
      const allCoupons = getAllCoupons();
      setCoupons(allCoupons);
    } catch (err) {
      setError('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = () => {
    try {
      const couponStats = getCouponsStats();
      setStats(couponStats);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = searchCoupons(query);
      setCoupons(results);
    } else {
      loadCoupons();
    }
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    if (status === 'all') {
      loadCoupons();
    } else {
      const filteredCoupons = getCouponsByStatus(status);
      setCoupons(filteredCoupons);
    }
  };

  const handleDelete = (id) => {
    const coupon = coupons.find((c) => c.id === id);

    if (coupon.status === 'deleted') {
      // Second delete - permanent deletion
      if (
        window.confirm(
          'This coupon is already deleted. Are you sure you want to permanently remove it? This action cannot be undone.',
        )
      ) {
        try {
          permanentDeleteCoupon(id);
          setSuccess('Coupon permanently deleted!');
          loadCoupons();
          loadStats();

          // Auto-hide success message after 6 seconds
          setTimeout(() => {
            setSuccess('');
          }, 6000);
        } catch (err) {
          setError('Failed to permanently delete coupon');
        }
      }
    } else {
      // First delete - soft delete
      if (
        window.confirm(
          'Are you sure you want to delete this coupon? You can restore it later or permanently delete it.',
        )
      ) {
        try {
          deleteCoupon(id);
          setSuccess('Coupon deleted successfully! You can restore it or permanently delete it.');
          loadCoupons();
          loadStats();

          // Auto-hide success message after 6 seconds
          setTimeout(() => {
            setSuccess('');
          }, 6000);
        } catch (err) {
          setError('Failed to delete coupon');
        }
      }
    }
  };

  const handleToggleStatus = (id) => {
    try {
      const coupon = coupons.find((c) => c.id === id);

      // Only show success message if the toggle will actually change the status
      if (coupon && (coupon.status === 'active' || coupon.status === 'inactive')) {
        toggleCouponStatus(id);
        setSuccess('Coupon status updated successfully!');

        // Auto-hide success message after 6 seconds
        setTimeout(() => {
          setSuccess('');
        }, 6000);
      } else {
        // For other statuses (scheduled, expired, deleted), just toggle without message
        toggleCouponStatus(id);
      }

      loadCoupons();
      loadStats();
    } catch (err) {
      setError('Failed to update coupon status');
    }
  };

  const handleRestore = (id) => {
    if (window.confirm('Are you sure you want to restore this coupon?')) {
      try {
        restoreCoupon(id);
        setSuccess('Coupon restored successfully!');
        loadCoupons();
        loadStats();

        // Auto-hide success message after 6 seconds
        setTimeout(() => {
          setSuccess('');
        }, 6000);
      } catch (err) {
        setError('Failed to restore coupon');
      }
    }
  };

  const handleView = (id) => {
    const coupon = coupons.find((c) => c.id === id);
    if (coupon) {
      setSelectedCoupon(coupon);
      setViewDialogOpen(true);
    }
  };

  const closeViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedCoupon(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <ActiveIcon color="success" />;
      case 'inactive':
        return <InactiveIcon color="warning" />;
      case 'scheduled':
        return <DateIcon color="info" />;
      case 'expired':
        return <DateIcon color="error" />;
      case 'deleted':
        return <DeleteIcon color="error" />;
      default:
        return <CouponIcon />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'scheduled':
        return 'info';
      case 'expired':
        return 'error';
      case 'deleted':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDiscount = (coupon) => {
    if (coupon.type === 'percentage') {
      return `${coupon.value}`;
    } else {
      return `${coupon.value}`;
    }
  };

  const filteredCoupons = coupons.filter((coupon) => {
    if (statusFilter !== 'all' && coupon.status !== statusFilter) {
      return false;
    }
    return true;
  });

  return (
    <PageContainer title="Coupons" description="Manage your coupons">
      <Box>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Coupons Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/main-store/coupons/create')}
          >
            Add New Coupon
          </Button>
        </Box>

        {/* Success/Error Messages */}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Statistics Cards */}
        <Grid container spacing={3} mb={3}>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <CouponIcon color="primary" />
                  <Box>
                    <Typography variant="h6">{stats.total}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Coupons
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <ActiveIcon color="success" />
                  <Box>
                    <Typography variant="h6">{stats.active}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Coupons
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <InactiveIcon color="warning" />
                  <Box>
                    <Typography variant="h6">{stats.inactive}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Inactive Coupons
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <DateIcon color="info" />
                  <Box>
                    <Typography variant="h6">{stats.scheduled}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Scheduled Coupons
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <DateIcon color="error" />
                  <Box>
                    <Typography variant="h6">{stats.expired}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Expired Coupons
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <DeleteIcon color="error" />
                  <Box>
                    <Typography variant="h6">{stats.deleted}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Deleted Coupons
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  placeholder="Search coupons..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
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
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {statusOptions.map((option) => (
                    <Chip
                      key={option.value}
                      label={option.label}
                      onClick={() => handleStatusFilter(option.value)}
                      color={statusFilter === option.value ? 'primary' : 'default'}
                      variant={statusFilter === option.value ? 'filled' : 'outlined'}
                    />
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Coupons Table */}
        <Card>
          <CardContent>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Coupon</TableCell>
                    <TableCell>Discount</TableCell>
                    <TableCell>Usage</TableCell>
                    <TableCell>Validity</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCoupons.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="body2" color="text.secondary">
                          No coupons found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCoupons.map((coupon) => (
                      <TableRow key={coupon.id} hover>
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {coupon.code}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {coupon.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            {coupon.type === 'percentage' ? (
                              <PercentIcon fontSize="small" color="action" />
                            ) : (
                              <MoneyIcon fontSize="small" color="action" />
                            )}
                            <Typography variant="body2" fontWeight="bold">
                              {formatDiscount(coupon)}
                            </Typography>
                          </Box>
                          {coupon.minimumAmount > 0 && (
                            <Typography variant="caption" color="text.secondary">
                              Min: ${coupon.minimumAmount}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {coupon.usedCount} / {coupon.usageLimit || '∞'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <DateIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              {new Date(coupon.endDate).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(coupon.status)}
                            label={coupon.status}
                            color={getStatusColor(coupon.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <Tooltip title="View Details">
                              <IconButton
                                onClick={() => handleView(coupon.id)}
                                color="info"
                                size="small"
                              >
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>

                            {coupon.status !== 'deleted' && (
                              <>
                                <Tooltip title="Edit Coupon">
                                  <IconButton
                                    onClick={() =>
                                      navigate(`/main-store/coupons/edit/${coupon.id}`)
                                    }
                                    color="primary"
                                    size="small"
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Toggle Status">
                                  <IconButton
                                    onClick={() => handleToggleStatus(coupon.id)}
                                    color={coupon.status === 'active' ? 'warning' : 'success'}
                                    size="small"
                                  >
                                    {coupon.status === 'active' ? <InactiveIcon /> : <ActiveIcon />}
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}

                            {coupon.status === 'deleted' && (
                              <Tooltip title="Restore Coupon">
                                <IconButton
                                  onClick={() => handleRestore(coupon.id)}
                                  color="success"
                                  size="small"
                                >
                                  <RestoreIcon />
                                </IconButton>
                              </Tooltip>
                            )}

                            <Tooltip
                              title={
                                coupon.status === 'deleted'
                                  ? 'Permanently Delete Coupon'
                                  : 'Delete Coupon'
                              }
                            >
                              <IconButton
                                onClick={() => handleDelete(coupon.id)}
                                color="error"
                                size="small"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* View Details Dialog */}
        <Dialog open={viewDialogOpen} onClose={closeViewDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={2}>
              <CouponIcon color="primary" />
              <Typography variant="h6">{selectedCoupon?.code} - Details</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedCoupon && (
              <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Basic Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Coupon Code
                  </Typography>
                  <Typography variant="body1" gutterBottom fontWeight="bold">
                    {selectedCoupon.code}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    icon={getStatusIcon(selectedCoupon.status)}
                    label={selectedCoupon.status}
                    color={getStatusColor(selectedCoupon.status)}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Coupon Name
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedCoupon.name}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Description
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedCoupon.description || 'No description available'}
                  </Typography>
                </Grid>

                {/* Discount Information */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                    Discount Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Discount Type
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedCoupon.type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Discount Value
                  </Typography>
                  <Typography variant="body1" gutterBottom fontWeight="bold">
                    {formatDiscount(selectedCoupon)}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Minimum Order Amount
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    ${selectedCoupon.minimumAmount || 'No minimum'}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Maximum Discount
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    ${selectedCoupon.maximumDiscount || 'No limit'}
                  </Typography>
                </Grid>

                {/* Usage Information */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                    Usage Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Usage Limit
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedCoupon.usageLimit || 'Unlimited'}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Used Count
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedCoupon.usedCount}
                  </Typography>
                </Grid>

                {/* Validity */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                    Validity
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Start Date
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {new Date(selectedCoupon.startDate).toLocaleDateString()}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    End Date
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {new Date(selectedCoupon.endDate).toLocaleDateString()}
                  </Typography>
                </Grid>

                {/* Timestamps */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                    Timestamps
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Created At
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {new Date(selectedCoupon.createdAt).toLocaleString()}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {new Date(selectedCoupon.updatedAt).toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={closeViewDialog}>Close</Button>
            <Button
              onClick={() => {
                closeViewDialog();
                navigate(`/main-store/coupons/edit/${selectedCoupon.id}`);
              }}
              variant="contained"
              startIcon={<EditIcon />}
            >
              Edit Coupon
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PageContainer>
  );
};

export default ListCoupons;
