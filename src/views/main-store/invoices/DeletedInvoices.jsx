import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Stack,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Alert,
  Pagination,
  Avatar,
  Tooltip,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  Restore as RestoreIcon,
  DeleteForever as DeleteForeverIcon,
  Visibility as VisibilityIcon,
  Receipt as ReceiptIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarTodayIcon,
} from '@mui/icons-material';
import PageContainer from 'src/components/container/PageContainer.jsx';
import {
  getDeletedInvoices,
  restoreInvoice,
  permanentDeleteInvoice,
} from '../../../api/invoices/InvoicesData.js';

const DeletedInvoices = () => {
  const navigate = useNavigate();
  const [deletedInvoices, setDeletedInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Load deleted invoices
  const loadDeletedInvoices = async () => {
    try {
      setLoading(true);
      const data = getDeletedInvoices();
      setDeletedInvoices(data);
      setFilteredInvoices(data);
    } catch (err) {
      setError('Failed to load deleted invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeletedInvoices();
  }, []);

  // Filter invoices
  useEffect(() => {
    let filtered = [...deletedInvoices];

    // Search filter
    if (searchQuery.trim()) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(invoice => 
        invoice.invoiceNumber.toLowerCase().includes(lowercaseQuery) ||
        invoice.customerName.toLowerCase().includes(lowercaseQuery) ||
        invoice.customerEmail.toLowerCase().includes(lowercaseQuery)
      );
    }

    setFilteredInvoices(filtered);
    setCurrentPage(1);
  }, [searchQuery, deletedInvoices]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleRestore = async (id) => {
    try {
      await restoreInvoice(id);
      setSuccess('Invoice restored successfully!');
      loadDeletedInvoices();
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccess('');
      }, 5000);
    } catch (err) {
      setError('Failed to restore invoice');
    }
  };

  const handlePermanentDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this invoice? This action cannot be undone.')) {
      try {
        await permanentDeleteInvoice(id);
        setSuccess('Invoice permanently deleted!');
        loadDeletedInvoices();
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSuccess('');
        }, 5000);
      } catch (err) {
        setError('Failed to permanently delete invoice');
      }
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, endIndex);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <PageContainer title="Deleted Invoices">
      <Box>
        {/* Header */}
        <Box display="flex" alignItems="center" mb={3}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/main-store/invoices/list')}
            sx={{ mr: 2 }}
          >
            Back to Invoices
          </Button>
          <ReceiptIcon sx={{ mr: 1, color: 'error.main' }} />
          <Typography variant="h4" component="h1">
            Deleted Invoices
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

        {/* Statistics */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                    <ReceiptIcon />
                  </Avatar>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="h6">
                      Deleted Invoices
                    </Typography>
                    <Typography variant="h4">{deletedInvoices.length}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                    <CalendarTodayIcon />
                  </Avatar>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="h6">
                      Total Amount
                    </Typography>
                    <Typography variant="h4">
                      {formatCurrency(deletedInvoices.reduce((sum, invoice) => sum + invoice.total, 0))}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="h6">
                      Unique Customers
                    </Typography>
                    <Typography variant="h4">
                      {new Set(deletedInvoices.map(invoice => invoice.customerName)).size}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <TextField
              fullWidth
              placeholder="Search deleted invoices..."
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </CardContent>
        </Card>

        {/* Deleted Invoices Table */}
        <Card>
          <CardContent>
            {loading ? (
              <LinearProgress />
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Invoice #</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Deleted Date</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedInvoices.map((invoice) => (
                        <TableRow key={invoice.id} hover>
                          <TableCell>
                            <Typography variant="subtitle2" fontWeight="600">
                              {invoice.invoiceNumber}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="subtitle2" fontWeight="600">
                                {invoice.customerName}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {invoice.customerEmail}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle2" fontWeight="600">
                              {formatCurrency(invoice.total)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={invoice.status}
                              color="default"
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="textSecondary">
                              {formatDateTime(invoice.deletedAt)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Stack direction="row" spacing={1} justifyContent="center">
                              <Tooltip title="Restore Invoice">
                                <IconButton
                                  size="small"
                                  onClick={() => handleRestore(invoice.id)}
                                  color="success"
                                >
                                  <RestoreIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Permanently Delete">
                                <IconButton
                                  size="small"
                                  onClick={() => handlePermanentDelete(invoice.id)}
                                  color="error"
                                >
                                  <DeleteForeverIcon />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Empty State */}
                {filteredInvoices.length === 0 && !loading && (
                  <Box textAlign="center" py={4}>
                    <ReceiptIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                      No Deleted Invoices Found
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {searchQuery ? 'Try adjusting your search criteria.' : 'All invoices are currently active.'}
                    </Typography>
                  </Box>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box display="flex" justifyContent="center" mt={3}>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={(event, page) => setCurrentPage(page)}
                      color="primary"
                    />
                  </Box>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </PageContainer>
  );
};

export default DeletedInvoices;
