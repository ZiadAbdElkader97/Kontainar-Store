import React, { useState, useEffect } from 'react';
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
  Avatar,
  Rating,
  LinearProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Delete as DeleteIcon,
  Restore as RestoreIcon,
  Visibility as ViewIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  Pending as PendingIcon,
  Verified as VerifiedIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Star as StarIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  ShoppingBag as ProductIcon,
} from '@mui/icons-material';
import PageContainer from 'src/components/container/PageContainer.jsx';
import {
  getAllReviews,
  deleteReview,
  permanentDeleteReview,
  restoreReview,
  searchReviews,
  getReviewsByStatus,
  updateReviewStatus,
  toggleReviewVerification,
  getReviewsStats,
} from '../../../api/reviews/ReviewsData.js';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    deleted: 0,
    averageRating: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    verified: 0,
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // View dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const statusOptions = [
    { value: 'all', label: 'All Reviews' },
    { value: 'approved', label: 'Approved' },
    { value: 'pending', label: 'Pending' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'deleted', label: 'Deleted' },
  ];

  useEffect(() => {
    loadReviews();
    loadStats();
  }, []);

  const loadReviews = () => {
    try {
      const allReviews = getAllReviews();
      setReviews(allReviews);
    } catch (err) {
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = () => {
    try {
      const reviewStats = getReviewsStats();
      setStats(reviewStats);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = searchReviews(query);
      setReviews(results);
    } else {
      loadReviews();
    }
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    if (status === 'all') {
      loadReviews();
    } else {
      const filteredReviews = getReviewsByStatus(status);
      setReviews(filteredReviews);
    }
  };

  const handleDelete = (id) => {
    const review = reviews.find((r) => r.id === id);

    if (review.status === 'deleted') {
      // Second delete - permanent deletion
      if (
        window.confirm(
          'This review is already deleted. Are you sure you want to permanently remove it? This action cannot be undone.',
        )
      ) {
        try {
          permanentDeleteReview(id);
          setSuccess('Review permanently deleted!');
          loadReviews();
          loadStats();

          // Auto-hide success message after 6 seconds
          setTimeout(() => {
            setSuccess('');
          }, 6000);
        } catch (err) {
          setError('Failed to permanently delete review');
        }
      }
    } else {
      // First delete - soft delete
      if (
        window.confirm(
          'Are you sure you want to delete this review? You can restore it later or permanently delete it.',
        )
      ) {
        try {
          deleteReview(id);
          setSuccess('Review deleted successfully! You can restore it or permanently delete it.');
          loadReviews();
          loadStats();

          // Auto-hide success message after 6 seconds
          setTimeout(() => {
            setSuccess('');
          }, 6000);
        } catch (err) {
          setError('Failed to delete review');
        }
      }
    }
  };

  const handleRestore = (id) => {
    if (window.confirm('Are you sure you want to restore this review?')) {
      try {
        restoreReview(id);
        setSuccess('Review restored successfully!');
        loadReviews();
        loadStats();

        // Auto-hide success message after 6 seconds
        setTimeout(() => {
          setSuccess('');
        }, 6000);
      } catch (err) {
        setError('Failed to restore review');
      }
    }
  };

  const handleStatusChange = (id, newStatus) => {
    try {
      updateReviewStatus(id, newStatus);
      setSuccess(`Review ${newStatus} successfully!`);
      loadReviews();
      loadStats();

      // Auto-hide success message after 6 seconds
      setTimeout(() => {
        setSuccess('');
      }, 6000);
    } catch (err) {
      setError(`Failed to ${newStatus} review`);
    }
  };

  const handleToggleVerification = (id) => {
    try {
      toggleReviewVerification(id);
      setSuccess('Review verification updated successfully!');
      loadReviews();
      loadStats();

      // Auto-hide success message after 6 seconds
      setTimeout(() => {
        setSuccess('');
      }, 6000);
    } catch (err) {
      setError('Failed to update review verification');
    }
  };

  const handleView = (id) => {
    const review = reviews.find((r) => r.id === id);
    if (review) {
      setSelectedReview(review);
      setViewDialogOpen(true);
    }
  };

  const closeViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedReview(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <ApprovedIcon color="success" />;
      case 'pending':
        return <PendingIcon color="warning" />;
      case 'rejected':
        return <RejectedIcon color="error" />;
      case 'deleted':
        return <DeleteIcon color="error" />;
      default:
        return <StarIcon />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      case 'deleted':
        return 'error';
      default:
        return 'default';
    }
  };

  const renderStars = (rating) => {
    return (
      <Box display="flex" alignItems="center" gap={0.5}>
        <Rating value={rating} readOnly size="small" />
        <Typography variant="body2" color="text.secondary">
          ({rating}/5)
        </Typography>
      </Box>
    );
  };

  const filteredReviews = reviews.filter((review) => {
    if (statusFilter !== 'all' && review.status !== statusFilter) {
      return false;
    }
    return true;
  });

  return (
    <PageContainer title="Reviews" description="Manage customer reviews">
      <Box>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Customer Reviews
          </Typography>
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
                  <StarIcon color="primary" />
                  <Box>
                    <Typography variant="h6">{stats.total}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Reviews
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
                  <ApprovedIcon color="success" />
                  <Box>
                    <Typography variant="h6">{stats.approved}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Approved
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
                  <PendingIcon color="warning" />
                  <Box>
                    <Typography variant="h6">{stats.pending}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending
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
                  <RejectedIcon color="error" />
                  <Box>
                    <Typography variant="h6">{stats.rejected}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Rejected
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
                  <VerifiedIcon color="info" />
                  <Box>
                    <Typography variant="h6">{stats.verified}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Verified
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
                  <StarIcon color="primary" />
                  <Box>
                    <Typography variant="h6">{stats.averageRating}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Avg Rating
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Rating Distribution */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Rating Distribution
            </Typography>
            <Grid container spacing={2}>
              {[5, 4, 3, 2, 1].map((rating) => (
                <Grid size={{ xs: 12, sm: 6, md: 2.4 }} key={rating}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2">{rating}★</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(stats.ratingDistribution[rating] / stats.approved) * 100}
                      sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {stats.ratingDistribution[rating]}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  placeholder="Search reviews..."
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

        {/* Reviews Table */}
        <Card>
          <CardContent>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Customer</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Review</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredReviews.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography variant="body2" color="text.secondary">
                          No reviews found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredReviews.map((review) => (
                      <TableRow key={review.id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ width: 32, height: 32 }}>
                              {review.customerName.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" fontWeight="bold">
                                {review.customerName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {review.customerEmail}
                              </Typography>
                              {review.verified && (
                                <Chip
                                  icon={<VerifiedIcon />}
                                  label="Verified"
                                  size="small"
                                  color="success"
                                  sx={{ ml: 1, height: 16 }}
                                />
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <ProductIcon fontSize="small" color="action" />
                            <Typography variant="body2">{review.productName}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{renderStars(review.rating)}</TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {review.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {review.comment}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1} mt={1}>
                              <Tooltip title="Helpful">
                                <Box display="flex" alignItems="center" gap={0.5}>
                                  <ThumbUpIcon fontSize="small" color="action" />
                                  <Typography variant="caption">{review.helpful}</Typography>
                                </Box>
                              </Tooltip>
                              <Tooltip title="Not Helpful">
                                <Box display="flex" alignItems="center" gap={0.5}>
                                  <ThumbDownIcon fontSize="small" color="action" />
                                  <Typography variant="caption">{review.notHelpful}</Typography>
                                </Box>
                              </Tooltip>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(review.status)}
                            label={review.status}
                            color={getStatusColor(review.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <Tooltip title="View Details">
                              <IconButton
                                onClick={() => handleView(review.id)}
                                color="info"
                                size="small"
                              >
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>

                            {review.status !== 'deleted' && (
                              <>
                                {review.status === 'pending' && (
                                  <>
                                    <Tooltip title="Approve">
                                      <IconButton
                                        onClick={() => handleStatusChange(review.id, 'approved')}
                                        color="success"
                                        size="small"
                                      >
                                        <ApprovedIcon />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Reject">
                                      <IconButton
                                        onClick={() => handleStatusChange(review.id, 'rejected')}
                                        color="error"
                                        size="small"
                                      >
                                        <RejectedIcon />
                                      </IconButton>
                                    </Tooltip>
                                  </>
                                )}

                                {review.status === 'approved' && (
                                  <Tooltip title="Reject">
                                    <IconButton
                                      onClick={() => handleStatusChange(review.id, 'rejected')}
                                      color="error"
                                      size="small"
                                    >
                                      <RejectedIcon />
                                    </IconButton>
                                  </Tooltip>
                                )}

                                {review.status === 'rejected' && (
                                  <Tooltip title="Approve">
                                    <IconButton
                                      onClick={() => handleStatusChange(review.id, 'approved')}
                                      color="success"
                                      size="small"
                                    >
                                      <ApprovedIcon />
                                    </IconButton>
                                  </Tooltip>
                                )}

                                <Tooltip title={review.verified ? 'Unverify' : 'Verify'}>
                                  <IconButton
                                    onClick={() => handleToggleVerification(review.id)}
                                    color={review.verified ? 'warning' : 'info'}
                                    size="small"
                                  >
                                    <VerifiedIcon />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}

                            {review.status === 'deleted' && (
                              <Tooltip title="Restore Review">
                                <IconButton
                                  onClick={() => handleRestore(review.id)}
                                  color="success"
                                  size="small"
                                >
                                  <RestoreIcon />
                                </IconButton>
                              </Tooltip>
                            )}

                            <Tooltip
                              title={
                                review.status === 'deleted'
                                  ? 'Permanently Delete Review'
                                  : 'Delete Review'
                              }
                            >
                              <IconButton
                                onClick={() => handleDelete(review.id)}
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
              <StarIcon color="primary" />
              <Typography variant="h6">Review Details</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedReview && (
              <Grid container spacing={3}>
                {/* Customer Information */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Customer Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ width: 48, height: 48 }}>
                      {selectedReview.customerName.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{selectedReview.customerName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedReview.customerEmail}
                      </Typography>
                      {selectedReview.verified && (
                        <Chip
                          icon={<VerifiedIcon />}
                          label="Verified Customer"
                          color="success"
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      )}
                    </Box>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Review Date
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {new Date(selectedReview.createdAt).toLocaleString()}
                  </Typography>
                </Grid>

                {/* Product Information */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                    Product Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <ProductIcon color="primary" />
                    <Typography variant="h6">{selectedReview.productName}</Typography>
                  </Box>
                </Grid>

                {/* Review Content */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                    Review Content
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    {renderStars(selectedReview.rating)}
                    <Chip
                      icon={getStatusIcon(selectedReview.status)}
                      label={selectedReview.status}
                      color={getStatusColor(selectedReview.status)}
                      size="small"
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom>
                    {selectedReview.title}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {selectedReview.comment}
                  </Typography>
                </Grid>

                {/* Helpful Votes */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                    Customer Feedback
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <ThumbUpIcon color="success" />
                    <Typography variant="h6">{selectedReview.helpful}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Found this helpful
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <ThumbDownIcon color="error" />
                    <Typography variant="h6">{selectedReview.notHelpful}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Found this not helpful
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={closeViewDialog}>Close</Button>
            {selectedReview && selectedReview.status === 'pending' && (
              <>
                <Button
                  onClick={() => {
                    closeViewDialog();
                    handleStatusChange(selectedReview.id, 'approved');
                  }}
                  variant="contained"
                  color="success"
                  startIcon={<ApprovedIcon />}
                >
                  Approve
                </Button>
                <Button
                  onClick={() => {
                    closeViewDialog();
                    handleStatusChange(selectedReview.id, 'rejected');
                  }}
                  variant="contained"
                  color="error"
                  startIcon={<RejectedIcon />}
                >
                  Reject
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    </PageContainer>
  );
};

export default Reviews;
