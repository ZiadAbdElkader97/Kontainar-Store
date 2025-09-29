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
  VisibilityOff as VisibilityOffIcon,
  Category as CategoryIcon,
  TextFields as TextFieldsIcon,
  Numbers as NumbersIcon,
  List as ListIcon,
  CheckBox as CheckBoxIcon,
  CalendarToday as CalendarTodayIcon,
  Link as LinkIcon,
  Email as EmailIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
} from '@mui/icons-material';
import PageContainer from 'src/components/container/PageContainer.jsx';
import {
  getAllAttributes,
  deleteAttribute,
  searchAttributes,
  getAttributesByStatus,
  toggleAttributeStatus,
} from '../../../api/attributes/AttributesData.js';

const ListAttributes = () => {
  const navigate = useNavigate();
  const [attributes, setAttributes] = useState([]);
  const [filteredAttributes, setFilteredAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState(null);

  // Tab state
  const [tabValue, setTabValue] = useState(0);

  const attributeTypes = [
    { value: 'text', label: 'Text', icon: <TextFieldsIcon /> },
    { value: 'number', label: 'Number', icon: <NumbersIcon /> },
    { value: 'select', label: 'Select', icon: <ListIcon /> },
    { value: 'multiselect', label: 'Multi Select', icon: <CheckBoxIcon /> },
    { value: 'boolean', label: 'Boolean', icon: <ToggleOnIcon /> },
    { value: 'date', label: 'Date', icon: <CalendarTodayIcon /> },
    { value: 'url', label: 'URL', icon: <LinkIcon /> },
    { value: 'email', label: 'Email', icon: <EmailIcon /> },
  ];

  const getTypeIcon = (type) => {
    const typeInfo = attributeTypes.find((t) => t.value === type);
    return typeInfo ? typeInfo.icon : <CategoryIcon />;
  };

  const getTypeLabel = (type) => {
    const typeInfo = attributeTypes.find((t) => t.value === type);
    return typeInfo ? typeInfo.label : type;
  };

  // Load attributes
  const loadAttributes = async () => {
    try {
      setLoading(true);
      const data = getAllAttributes();
      setAttributes(data);
      setFilteredAttributes(data);
    } catch (err) {
      setError('Failed to load attributes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttributes();
  }, []);

  // Filter attributes
  useEffect(() => {
    let filtered = [...attributes];

    // Search filter
    if (searchQuery.trim()) {
      filtered = searchAttributes(searchQuery);
    }

    // Status filter
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active';
      filtered = filtered.filter((attr) => attr.isActive === isActive);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter((attr) => attr.type === typeFilter);
    }

    setFilteredAttributes(filtered);
    setCurrentPage(1);
  }, [searchQuery, statusFilter, typeFilter, attributes]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleStatusFilter = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleTypeFilter = (event) => {
    setTypeFilter(event.target.value);
  };

  const handleDelete = async () => {
    try {
      await deleteAttribute(selectedAttribute.id);
      setSuccess('Attribute deleted successfully!');
      setDeleteDialogOpen(false);
      setSelectedAttribute(null);
      loadAttributes();
    } catch (err) {
      setError('Failed to delete attribute');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleAttributeStatus(id);
      setSuccess('Attribute status updated successfully!');
      loadAttributes();
      // Auto-hide success message after 6 seconds
      setTimeout(() => {
        setSuccess('');
      }, 5000);
    } catch (err) {
      setError('Failed to update attribute status');
    }
  };

  const handleEdit = (id) => {
    navigate(`/main-store/attributes/edit/${id}`);
  };

  const handleView = (id) => {
    const attribute = attributes.find((attr) => attr.id === id);
    if (attribute) {
      setSelectedAttribute(attribute);
      setViewDialogOpen(true);
    }
  };

  const openDeleteDialog = (attribute) => {
    setSelectedAttribute(attribute);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedAttribute(null);
  };

  const closeViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedAttribute(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 0) {
      setStatusFilter('all');
    } else if (newValue === 1) {
      setStatusFilter('active');
    } else if (newValue === 2) {
      setStatusFilter('inactive');
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredAttributes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAttributes = filteredAttributes.slice(startIndex, endIndex);

  // Statistics
  const totalAttributes = attributes.length;
  const activeAttributes = attributes.filter((attr) => attr.isActive).length;
  const inactiveAttributes = totalAttributes - activeAttributes;
  const requiredAttributes = attributes.filter((attr) => attr.isRequired).length;

  return (
    <PageContainer title="Attributes Management">
      <Box>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Attributes Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/main-store/attributes/create')}
          >
            Add New Attribute
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
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <CategoryIcon />
                  </Avatar>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="h6">
                      Total Attributes
                    </Typography>
                    <Typography variant="h4">{totalAttributes}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                    <VisibilityIcon />
                  </Avatar>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="h6">
                      Active
                    </Typography>
                    <Typography variant="h4">{activeAttributes}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                    <VisibilityOffIcon />
                  </Avatar>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="h6">
                      Inactive
                    </Typography>
                    <Typography variant="h4">{inactiveAttributes}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                    <CheckBoxIcon />
                  </Avatar>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="h6">
                      Required
                    </Typography>
                    <Typography variant="h4">{requiredAttributes}</Typography>
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
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  placeholder="Search attributes..."
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

              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select value={statusFilter} onChange={handleStatusFilter} label="Status">
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select value={typeFilter} onChange={handleTypeFilter} label="Type">
                    <MenuItem value="all">All Types</MenuItem>
                    {attributeTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
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
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="attribute tabs">
            <Tab label={`All (${totalAttributes})`} />
            <Tab label={`Active (${activeAttributes})`} />
            <Tab label={`Inactive (${inactiveAttributes})`} />
          </Tabs>
        </Card>

        {/* Attributes Table */}
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
                        <TableCell>Name</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Options</TableCell>
                        <TableCell>Required</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedAttributes.map((attribute) => (
                        <TableRow key={attribute.id} hover>
                          <TableCell>
                            <Typography variant="subtitle2" fontWeight="600">
                              {attribute.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={getTypeIcon(attribute.type)}
                              label={getTypeLabel(attribute.type)}
                              color="primary"
                              variant="outlined"
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="textSecondary">
                              {attribute.description || 'No description'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {attribute.options && attribute.options.length > 0 ? (
                              <Box>
                                <Typography variant="body2" color="textSecondary">
                                  {attribute.options.length} options
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  {attribute.options.slice(0, 2).join(', ')}
                                  {attribute.options.length > 2 && '...'}
                                </Typography>
                              </Box>
                            ) : (
                              <Typography variant="body2" color="textSecondary">
                                No options
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={attribute.isRequired ? 'Required' : 'Optional'}
                              color={attribute.isRequired ? 'error' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={attribute.isActive ? 'Active' : 'Inactive'}
                              color={attribute.isActive ? 'success' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="textSecondary">
                              {new Date(attribute.createdAt).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Stack direction="row" spacing={1} justifyContent="center">
                              <Tooltip title="View Details">
                                <IconButton
                                  size="small"
                                  onClick={() => handleView(attribute.id)}
                                  color="info"
                                >
                                  <VisibilityIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  onClick={() => handleEdit(attribute.id)}
                                  color="primary"
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={attribute.isActive ? 'Deactivate' : 'Activate'}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleToggleStatus(attribute.id)}
                                  color={attribute.isActive ? 'warning' : 'success'}
                                >
                                  {attribute.isActive ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  onClick={() => openDeleteDialog(attribute)}
                                  color="error"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
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
              {selectedAttribute && getTypeIcon(selectedAttribute.type)}
              <Typography variant="h6">{selectedAttribute?.name} - Details</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedAttribute && (
              <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Basic Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Attribute Name
                  </Typography>
                  <Typography variant="body1" fontWeight="600">
                    {selectedAttribute.name}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Type
                  </Typography>
                  <Chip
                    icon={getTypeIcon(selectedAttribute.type)}
                    label={getTypeLabel(selectedAttribute.type)}
                    color="primary"
                    variant="outlined"
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body1">
                    {selectedAttribute.description || 'No description provided'}
                  </Typography>
                </Grid>

                {/* Unit for Number type */}
                {selectedAttribute.type === 'number' && selectedAttribute.unit && (
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Unit
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      {selectedAttribute.unit}
                    </Typography>
                  </Grid>
                )}

                {/* Settings */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Settings
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Required
                  </Typography>
                  <Chip
                    label={selectedAttribute.isRequired ? 'Required' : 'Optional'}
                    color={selectedAttribute.isRequired ? 'error' : 'default'}
                    variant="outlined"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Status
                  </Typography>
                  <Chip
                    label={selectedAttribute.isActive ? 'Active' : 'Inactive'}
                    color={selectedAttribute.isActive ? 'success' : 'default'}
                    variant="outlined"
                  />
                </Grid>

                {/* Options for Select/MultiSelect */}
                {(selectedAttribute.type === 'select' ||
                  selectedAttribute.type === 'multiselect') && (
                  <>
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="h6" gutterBottom color="primary">
                        Options
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                        Available Options ({selectedAttribute.options?.length || 0})
                      </Typography>
                      {selectedAttribute.options && selectedAttribute.options.length > 0 ? (
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {selectedAttribute.options.map((option, index) => (
                            <Chip
                              key={index}
                              label={option}
                              color="primary"
                              variant="outlined"
                              size="small"
                            />
                          ))}
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          No options defined
                        </Typography>
                      )}
                    </Grid>
                  </>
                )}

                {/* Timestamps */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Timestamps
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Created At
                  </Typography>
                  <Typography variant="body1">
                    {new Date(selectedAttribute.createdAt).toLocaleString()}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Last Updated
                  </Typography>
                  <Typography variant="body1">
                    {new Date(selectedAttribute.updatedAt).toLocaleString()}
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
                handleEdit(selectedAttribute.id);
              }}
              variant="contained"
              startIcon={<EditIcon />}
            >
              Edit Attribute
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
          <DialogTitle>Delete Attribute</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the attribute "{selectedAttribute?.name}"? This action
              cannot be undone.
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

export default ListAttributes;
