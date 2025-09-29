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
  Avatar,
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
  Business as BusinessIcon,
  Language as WebsiteIcon,
  Public as CountryIcon,
  CalendarToday as FoundedIcon,
  ToggleOn as ActiveIcon,
  ToggleOff as InactiveIcon,
} from '@mui/icons-material';
import PageContainer from 'src/components/container/PageContainer.jsx';
import {
  getAllBrands,
  deleteBrand,
  permanentDeleteBrand,
  restoreBrand,
  searchBrands,
  getBrandsByStatus,
  toggleBrandStatus,
  getBrandsStats,
} from '../../../api/brands/BrandsData.js';

const ListBrands = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, deleted: 0 });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // View dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const statusOptions = [
    { value: 'all', label: 'All Brands' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'deleted', label: 'Deleted' },
  ];

  useEffect(() => {
    loadBrands();
    loadStats();
  }, []);

  const loadBrands = () => {
    try {
      const allBrands = getAllBrands();
      setBrands(allBrands);
    } catch (err) {
      setError('Failed to load brands');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = () => {
    try {
      const brandStats = getBrandsStats();
      setStats(brandStats);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = searchBrands(query);
      setBrands(results);
    } else {
      loadBrands();
    }
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    if (status === 'all') {
      loadBrands();
    } else {
      const filteredBrands = getBrandsByStatus(status);
      setBrands(filteredBrands);
    }
  };

  const handleDelete = (id) => {
    const brand = brands.find((b) => b.id === id);

    if (brand.status === 'deleted') {
      // Second delete - permanent deletion
      if (
        window.confirm(
          'This brand is already deleted. Are you sure you want to permanently remove it? This action cannot be undone.',
        )
      ) {
        try {
          permanentDeleteBrand(id);
          setSuccess('Brand permanently deleted!');
          loadBrands();
          loadStats();

          // Auto-hide success message after 6 seconds
          setTimeout(() => {
            setSuccess('');
          }, 6000);
        } catch (err) {
          setError('Failed to permanently delete brand');
        }
      }
    } else {
      // First delete - soft delete
      if (
        window.confirm(
          'Are you sure you want to delete this brand? You can restore it later or permanently delete it.',
        )
      ) {
        try {
          deleteBrand(id);
          setSuccess('Brand deleted successfully! You can restore it or permanently delete it.');
          loadBrands();
          loadStats();

          // Auto-hide success message after 6 seconds
          setTimeout(() => {
            setSuccess('');
          }, 6000);
        } catch (err) {
          setError('Failed to delete brand');
        }
      }
    }
  };

  const handleToggleStatus = (id) => {
    try {
      toggleBrandStatus(id);
      setSuccess('Brand status updated successfully!');
      loadBrands();
      loadStats();

      // Auto-hide success message after 6 seconds
      setTimeout(() => {
        setSuccess('');
      }, 6000);
    } catch (err) {
      setError('Failed to update brand status');
    }
  };

  const handleRestore = (id) => {
    if (window.confirm('Are you sure you want to restore this brand?')) {
      try {
        restoreBrand(id);
        setSuccess('Brand restored successfully!');
        loadBrands();
        loadStats();

        // Auto-hide success message after 6 seconds
        setTimeout(() => {
          setSuccess('');
        }, 6000);
      } catch (err) {
        setError('Failed to restore brand');
      }
    }
  };

  const handleView = (id) => {
    const brand = brands.find((b) => b.id === id);
    if (brand) {
      setSelectedBrand(brand);
      setViewDialogOpen(true);
    }
  };

  const closeViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedBrand(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <ActiveIcon color="success" />;
      case 'inactive':
        return <InactiveIcon color="error" />;
      default:
        return <BusinessIcon />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredBrands = brands.filter((brand) => {
    if (statusFilter !== 'all' && brand.status !== statusFilter) {
      return false;
    }
    return true;
  });

  return (
    <PageContainer title="Brands" description="Manage your brands">
      <Box>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Brands Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/main-store/brands/create')}
          >
            Add New Brand
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
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <BusinessIcon color="primary" />
                  <Box>
                    <Typography variant="h6">{stats.total}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Brands
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <ActiveIcon color="success" />
                  <Box>
                    <Typography variant="h6">{stats.active}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Brands
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <InactiveIcon color="error" />
                  <Box>
                    <Typography variant="h6">{stats.inactive}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Inactive Brands
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <DeleteIcon color="warning" />
                  <Box>
                    <Typography variant="h6">{stats.deleted}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Deleted Brands
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
                  placeholder="Search brands..."
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
                <Stack direction="row" spacing={1}>
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

        {/* Brands Table */}
        <Card>
          <CardContent>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Brand</TableCell>
                    <TableCell>Country</TableCell>
                    <TableCell>Founded</TableCell>
                    <TableCell>Website</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredBrands.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="body2" color="text.secondary">
                          No brands found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBrands.map((brand) => (
                      <TableRow key={brand.id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar
                              src={brand.logo}
                              alt={brand.name}
                              sx={{ width: 40, height: 40 }}
                            >
                              <BusinessIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" fontWeight="bold">
                                {brand.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {brand.description}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <CountryIcon fontSize="small" color="action" />
                            <Typography variant="body2">{brand.country || 'N/A'}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <FoundedIcon fontSize="small" color="action" />
                            <Typography variant="body2">{brand.foundedYear || 'N/A'}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {brand.website ? (
                            <Box display="flex" alignItems="center" gap={1}>
                              <WebsiteIcon fontSize="small" color="action" />
                              <Typography
                                variant="body2"
                                color="primary"
                                sx={{ cursor: 'pointer' }}
                                onClick={() => window.open(brand.website, '_blank')}
                              >
                                Visit Website
                              </Typography>
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              N/A
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(brand.status)}
                            label={brand.status}
                            color={getStatusColor(brand.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <Tooltip title="View Details">
                              <IconButton
                                onClick={() => handleView(brand.id)}
                                color="info"
                                size="small"
                              >
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>

                            {brand.status !== 'deleted' && (
                              <>
                                <Tooltip title="Edit Brand">
                                  <IconButton
                                    onClick={() => navigate(`/main-store/brands/edit/${brand.id}`)}
                                    color="primary"
                                    size="small"
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Toggle Status">
                                  <IconButton
                                    onClick={() => handleToggleStatus(brand.id)}
                                    color={brand.status === 'active' ? 'warning' : 'success'}
                                    size="small"
                                  >
                                    {brand.status === 'active' ? <InactiveIcon /> : <ActiveIcon />}
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}

                            {brand.status === 'deleted' && (
                              <Tooltip title="Restore Brand">
                                <IconButton
                                  onClick={() => handleRestore(brand.id)}
                                  color="success"
                                  size="small"
                                >
                                  <RestoreIcon />
                                </IconButton>
                              </Tooltip>
                            )}

                            <Tooltip
                              title={
                                brand.status === 'deleted'
                                  ? 'Permanently Delete Brand'
                                  : 'Delete Brand'
                              }
                            >
                              <IconButton
                                onClick={() => handleDelete(brand.id)}
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
              <BusinessIcon color="primary" />
              <Typography variant="h6">{selectedBrand?.name} - Details</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedBrand && (
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
                    Brand Name
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedBrand.name}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    icon={getStatusIcon(selectedBrand.status)}
                    label={selectedBrand.status}
                    color={getStatusColor(selectedBrand.status)}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Country
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedBrand.country || 'N/A'}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Founded Year
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedBrand.foundedYear || 'N/A'}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Website
                  </Typography>
                  {selectedBrand.website ? (
                    <Typography
                      variant="body1"
                      color="primary"
                      sx={{ cursor: 'pointer' }}
                      onClick={() => window.open(selectedBrand.website, '_blank')}
                    >
                      {selectedBrand.website}
                    </Typography>
                  ) : (
                    <Typography variant="body1">N/A</Typography>
                  )}
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Description
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedBrand.description || 'No description available'}
                  </Typography>
                </Grid>

                {/* Logo */}
                {selectedBrand.logo && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Logo
                    </Typography>
                    <Box
                      component="img"
                      src={selectedBrand.logo}
                      alt={selectedBrand.name}
                      sx={{
                        width: 150,
                        height: 150,
                        objectFit: 'contain',
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        mt: 1,
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </Grid>
                )}

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
                    {new Date(selectedBrand.createdAt).toLocaleString()}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {new Date(selectedBrand.updatedAt).toLocaleString()}
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
                navigate(`/main-store/brands/edit/${selectedBrand.id}`);
              }}
              variant="contained"
              startIcon={<EditIcon />}
            >
              Edit Brand
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PageContainer>
  );
};

export default ListBrands;
