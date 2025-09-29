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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Pagination,
  Avatar,
  Tooltip,
  Badge,
  Divider,
  Tabs,
  Tab,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Receipt as ReceiptIcon,
  AttachMoney as AttachMoneyIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarTodayIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Warning as WarningIcon,
  Cancel as CancelIcon,
  EditNote as DraftIcon,
} from '@mui/icons-material';
import PageContainer from 'src/components/container/PageContainer.jsx';
import {
  getAllInvoices,
  deleteInvoice,
  searchInvoices,
  getInvoicesByStatus,
  updateInvoiceStatus,
  getInvoiceStats,
} from '../../../api/invoices/InvoicesData.js';

const ListInvoices = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Tab state
  const [tabValue, setTabValue] = useState(0);

  // Statistics
  const [stats, setStats] = useState({
    totalInvoices: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    overdueInvoices: 0,
    draftInvoices: 0,
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
    overdueAmount: 0,
  });

  const statusOptions = [
    { value: 'draft', label: 'Draft', icon: <DraftIcon />, color: 'default' },
    { value: 'pending', label: 'Pending', icon: <PendingIcon />, color: 'warning' },
    { value: 'paid', label: 'Paid', icon: <CheckCircleIcon />, color: 'success' },
    { value: 'overdue', label: 'Overdue', icon: <WarningIcon />, color: 'error' },
    { value: 'cancelled', label: 'Cancelled', icon: <CancelIcon />, color: 'default' },
  ];

  const getStatusInfo = (status) => {
    return statusOptions.find((s) => s.value === status) || statusOptions[0];
  };

  // Load invoices
  const loadInvoices = async () => {
    try {
      setLoading(true);
      const data = getAllInvoices();
      const statistics = getInvoiceStats();
      setInvoices(data);
      setFilteredInvoices(data);
      setStats(statistics);
    } catch (err) {
      setError('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  // Filter invoices
  useEffect(() => {
    let filtered = [...invoices];

    // Search filter
    if (searchQuery.trim()) {
      filtered = searchInvoices(searchQuery);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((invoice) => invoice.status === statusFilter);
    }

    setFilteredInvoices(filtered);
    setCurrentPage(1);
  }, [searchQuery, statusFilter, invoices]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleStatusFilter = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleDelete = async () => {
    try {
      await deleteInvoice(selectedInvoice.id);
      setSuccess('Invoice deleted successfully!');
      setDeleteDialogOpen(false);
      setSelectedInvoice(null);
      loadInvoices();
    } catch (err) {
      setError('Failed to delete invoice');
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateInvoiceStatus(id, newStatus);
      setSuccess('Invoice status updated successfully!');
      loadInvoices();

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccess('');
      }, 5000);
    } catch (err) {
      setError('Failed to update invoice status');
    }
  };

  const handleEdit = (id) => {
    navigate(`/main-store/invoices/edit/${id}`);
  };

  const handleView = (id) => {
    const invoice = invoices.find((inv) => inv.id === id);
    if (invoice) {
      setSelectedInvoice(invoice);
      setViewDialogOpen(true);
    }
  };

  const openDeleteDialog = (invoice) => {
    setSelectedInvoice(invoice);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedInvoice(null);
  };

  const closeViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedInvoice(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 0) {
      setStatusFilter('all');
    } else if (newValue === 1) {
      setStatusFilter('paid');
    } else if (newValue === 2) {
      setStatusFilter('pending');
    } else if (newValue === 3) {
      setStatusFilter('overdue');
    } else if (newValue === 4) {
      setStatusFilter('draft');
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
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (dueDate, status) => {
    if (status === 'paid' || status === 'cancelled') return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <PageContainer title="Invoices Management">
      <Box>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Invoices Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/main-store/invoices/create')}
          >
            Create New Invoice
          </Button>
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

        {/* Statistics Dashboard */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <ReceiptIcon />
                  </Avatar>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="h6">
                      Total Invoices
                    </Typography>
                    <Typography variant="h4">{stats.totalInvoices}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                    <CheckCircleIcon />
                  </Avatar>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="h6">
                      Paid
                    </Typography>
                    <Typography variant="h4">{stats.paidInvoices}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {formatCurrency(stats.paidAmount)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                    <PendingIcon />
                  </Avatar>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="h6">
                      Pending
                    </Typography>
                    <Typography variant="h4">{stats.pendingInvoices}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {formatCurrency(stats.pendingAmount)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                    <WarningIcon />
                  </Avatar>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="h6">
                      Overdue
                    </Typography>
                    <Typography variant="h4">{stats.overdueInvoices}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {formatCurrency(stats.overdueAmount)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                    <DraftIcon />
                  </Avatar>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="h6">
                      Draft
                    </Typography>
                    <Typography variant="h4">{stats.draftInvoices}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters and Search */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  placeholder="Search invoices..."
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
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select value={statusFilter} onChange={handleStatusFilter} label="Status">
                    <MenuItem value="all">All Status</MenuItem>
                    {statusOptions.map((status) => (
                      <MenuItem key={status.value} value={status.value}>
                        {status.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Card sx={{ mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="invoice tabs">
            <Tab label={`All (${stats.totalInvoices})`} />
            <Tab label={`Paid (${stats.paidInvoices})`} />
            <Tab label={`Pending (${stats.pendingInvoices})`} />
            <Tab label={`Overdue (${stats.overdueInvoices})`} />
            <Tab label={`Draft (${stats.draftInvoices})`} />
          </Tabs>
        </Card>

        {/* Invoices Table */}
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
                        <TableCell>Due Date</TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedInvoices.map((invoice) => {
                        const statusInfo = getStatusInfo(invoice.status);
                        const overdue = isOverdue(invoice.dueDate, invoice.status);

                        return (
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
                                icon={statusInfo.icon}
                                label={statusInfo.label}
                                color={overdue ? 'error' : statusInfo.color}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                color={overdue ? 'error.main' : 'textSecondary'}
                                fontWeight={overdue ? 600 : 'normal'}
                              >
                                {formatDate(invoice.dueDate)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="textSecondary">
                                {formatDate(invoice.createdAt)}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Stack direction="row" spacing={1} justifyContent="center">
                                <Tooltip title="View Details">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleView(invoice.id)}
                                    color="info"
                                  >
                                    <VisibilityIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleEdit(invoice.id)}
                                    color="primary"
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton
                                    size="small"
                                    onClick={() => openDeleteDialog(invoice)}
                                    color="error"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>

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

        {/* View Details Dialog */}
        <Dialog open={viewDialogOpen} onClose={closeViewDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={2}>
              <ReceiptIcon color="primary" />
              <Typography variant="h6">{selectedInvoice?.invoiceNumber} - Details</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedInvoice && (
              <Grid container spacing={3}>
                {/* Invoice Information */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Invoice Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Invoice Number
                  </Typography>
                  <Typography variant="body1" fontWeight="600">
                    {selectedInvoice.invoiceNumber}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Status
                  </Typography>
                  <Chip
                    icon={getStatusInfo(selectedInvoice.status).icon}
                    label={getStatusInfo(selectedInvoice.status).label}
                    color={getStatusInfo(selectedInvoice.status).color}
                    variant="outlined"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Issue Date
                  </Typography>
                  <Typography variant="body1">{formatDate(selectedInvoice.issueDate)}</Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Due Date
                  </Typography>
                  <Typography variant="body1">{formatDate(selectedInvoice.dueDate)}</Typography>
                </Grid>

                {/* Customer Information */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Customer Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Customer Name
                  </Typography>
                  <Typography variant="body1" fontWeight="600">
                    {selectedInvoice.customerName}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Email
                  </Typography>
                  <Typography variant="body1">{selectedInvoice.customerEmail}</Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Phone
                  </Typography>
                  <Typography variant="body1">{selectedInvoice.customerPhone}</Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Payment Method
                  </Typography>
                  <Typography variant="body1">{selectedInvoice.paymentMethod}</Typography>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Address
                  </Typography>
                  <Typography variant="body1">{selectedInvoice.customerAddress}</Typography>
                </Grid>

                {/* Items */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Invoice Items
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Item</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell align="center">Qty</TableCell>
                          <TableCell align="right">Unit Price</TableCell>
                          <TableCell align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedInvoice.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.description}</TableCell>
                            <TableCell align="center">{item.quantity}</TableCell>
                            <TableCell align="right">{formatCurrency(item.unitPrice)}</TableCell>
                            <TableCell align="right">{formatCurrency(item.total)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                {/* Totals */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Invoice Totals
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Subtotal:</Typography>
                    <Typography>{formatCurrency(selectedInvoice.subtotal)}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Tax ({selectedInvoice.taxRate}%):</Typography>
                    <Typography>{formatCurrency(selectedInvoice.taxAmount)}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Discount:</Typography>
                    <Typography>-{formatCurrency(selectedInvoice.discount)}</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6">Total:</Typography>
                    <Typography variant="h6">{formatCurrency(selectedInvoice.total)}</Typography>
                  </Box>
                </Grid>

                {/* Notes */}
                {selectedInvoice.notes && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Notes
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body1">{selectedInvoice.notes}</Typography>
                  </Grid>
                )}
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={closeViewDialog}>Close</Button>
            <Button
              onClick={() => {
                closeViewDialog();
                handleEdit(selectedInvoice.id);
              }}
              variant="contained"
              startIcon={<EditIcon />}
            >
              Edit Invoice
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
          <DialogTitle>Delete Invoice</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the invoice "{selectedInvoice?.invoiceNumber}"? This
              action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDeleteDialog}>Cancel</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PageContainer>
  );
};

export default ListInvoices;
