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
  Work as WorkIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer.jsx';
import {
  getAllStaff,
  getActiveStaff,
  getInactiveStaff,
  deleteStaff,
  restoreStaff,
  permanentDeleteStaff,
  searchStaff,
  getStaffStats,
  getAllDepartments,
  getAllPositions,
} from '../../../api/user-management/StaffData.js';

const ListStaff = () => {
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    deleted: 0,
    departments: 0,
    departmentStats: {},
    roles: 0,
    roleStats: {},
    totalSalary: 0,
    averageSalary: 0,
  });

  const statusOptions = [
    { value: 'all', label: 'All Staff' },
    { value: 'active', label: 'Active Staff' },
    { value: 'inactive', label: 'Inactive Staff' },
    { value: 'deleted', label: 'Deleted Staff' },
  ];

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'admin', label: 'Admin' },
    { value: 'hr', label: 'HR' },
    { value: 'finance', label: 'Finance' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'developer', label: 'Developer' },
    { value: 'manager', label: 'Manager' },
  ];

  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    loadStaff();
    loadStats();
    loadDepartments();
    loadPositions();
  }, []);

  useEffect(() => {
    filterStaff();
  }, [staff, searchQuery, statusFilter, departmentFilter, roleFilter]);

  const loadStaff = () => {
    try {
      const allStaff = getAllStaff();
      setStaff(allStaff);
    } catch (err) {
      setError('Failed to load staff');
    }
  };

  const loadStats = () => {
    try {
      const staffStats = getStaffStats();
      setStats(staffStats);
    } catch (err) {
      setError('Failed to load statistics');
    }
  };

  const loadDepartments = () => {
    try {
      const allDepartments = getAllDepartments();
      setDepartments(allDepartments);
    } catch (err) {
      setError('Failed to load departments');
    }
  };

  const loadPositions = () => {
    try {
      const allPositions = getAllPositions();
      setPositions(allPositions);
    } catch (err) {
      setError('Failed to load positions');
    }
  };

  const filterStaff = () => {
    let filtered = [...staff];

    // Search filter
    if (searchQuery) {
      filtered = searchStaff(searchQuery);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((member) => member.status === statusFilter);
    }

    // Department filter
    if (departmentFilter !== 'all') {
      filtered = filtered.filter((member) => member.department === departmentFilter);
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter((member) => member.role === roleFilter);
    }

    setFilteredStaff(filtered);
  };

  const handleViewStaff = (member) => {
    setSelectedStaff(member);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedStaff(null);
  };

  const handleEditStaff = (member) => {
    navigate(`/user-manage/staff/edit/${member.id}`);
  };

  const handleDelete = async (member) => {
    // Soft delete - always soft delete first
    if (window.confirm(`Are you sure you want to delete the staff member "${member.firstName} ${member.lastName}"?`)) {
      setLoading(true);
      setError('');
      setSuccess('');

      try {
        await deleteStaff(member.id);
        setSuccess('Staff member deleted successfully');
        loadStaff();
        loadStats();
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSuccess('');
        }, 5000);
      } catch (err) {
        setError(err.message || 'Failed to delete staff member');
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePermanentDelete = async (member) => {
    // Permanent delete
    if (window.confirm(`Are you sure you want to permanently delete the staff member "${member.firstName} ${member.lastName}"? This action cannot be undone!`)) {
      setLoading(true);
      setError('');
      setSuccess('');

      try {
        await permanentDeleteStaff(member.id);
        setSuccess('Staff member permanently deleted');
        loadStaff();
        loadStats();
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSuccess('');
        }, 5000);
      } catch (err) {
        setError(err.message || 'Failed to permanently delete staff member');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRestore = async (member) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await restoreStaff(member.id);
      setSuccess('Staff member restored successfully');
      loadStaff();
      loadStats();
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccess('');
      }, 5000);
    } catch (err) {
      setError(err.message || 'Failed to restore staff member');
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

  const getRoleColor = (role) => {
    const colors = {
      'admin': 'error',
      'hr': 'info',
      'finance': 'success',
      'marketing': 'warning',
      'sales': 'primary',
      'developer': 'secondary',
      'manager': 'error',
    };
    return colors[role] || 'default';
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
  const totalPages = Math.ceil(filteredStaff.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedStaff = filteredStaff.slice(startIndex, endIndex);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <PageContainer title="Staff Management" description="Manage staff members and employees">
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" gutterBottom>
                Staff Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage staff members, employees, and organizational structure
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/user-manage/staff/create')}
            >
              Add New Staff
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
                      Total Staff
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
                  <Avatar sx={{ bgcolor: 'info.main' }}>
                    <BusinessIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{stats.departments}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Departments
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
                    <Typography variant="h6">{formatCurrency(stats.totalSalary)}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Salary
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
                    <WorkIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{formatCurrency(stats.averageSalary)}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Avg Salary
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
                  placeholder="Search staff..."
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
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={departmentFilter}
                    label="Department"
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Departments</MenuItem>
                    {departments.map((dept) => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={roleFilter}
                    label="Role"
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    {roleOptions.map((option) => (
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

        {/* Staff Table */}
        <Card>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Salary</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedStaff.map((member) => (
                    <TableRow key={member.id} hover>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar
                            sx={{
                              bgcolor: 'primary.main',
                              width: 40,
                              height: 40,
                              opacity: member.status === 'deleted' ? 0.5 : 1,
                            }}
                          >
                            {getInitials(member.firstName, member.lastName)}
                          </Avatar>
                          <Box>
                            <Typography 
                              variant="subtitle2"
                              sx={{ 
                                textDecoration: member.status === 'deleted' ? 'line-through' : 'none',
                                opacity: member.status === 'deleted' ? 0.6 : 1,
                              }}
                            >
                              {member.firstName} {member.lastName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {member.employeeId}
                            </Typography>
                            {member.status === 'deleted' && (
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
                            <Typography variant="body2">{member.email}</Typography>
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <PhoneIcon fontSize="small" color="action" />
                            <Typography variant="body2">{member.phone}</Typography>
                          </Stack>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={member.department}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {member.position}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={member.role}
                          size="small"
                          color={getRoleColor(member.role)}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="success.main" fontWeight="medium">
                          {formatCurrency(member.salary || 0)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={member.status}
                          size="small"
                          color={getStatusColor(member.status)}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleViewStaff(member)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          {member.status !== 'deleted' && (
                            <Tooltip title="Edit Staff">
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditStaff(member)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                          )}
                          {member.status === 'deleted' ? (
                            <>
                              <Tooltip title="Restore Staff">
                                <IconButton
                                  size="small"
                                  onClick={() => handleRestore(member)}
                                  color="success"
                                >
                                  <RestoreIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Forever">
                                <span>
                                  <IconButton
                                    size="small"
                                    onClick={() => handlePermanentDelete(member)}
                                    color="error"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </>
                          ) : (
                            <Tooltip title="Delete Staff">
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDelete(member)}
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
            {filteredStaff.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No staff members found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your search or filter criteria
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* View Staff Dialog */}
        <Dialog
          open={viewDialogOpen}
          onClose={handleCloseViewDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                {selectedStaff && getInitials(selectedStaff.firstName, selectedStaff.lastName)}
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {selectedStaff?.firstName} {selectedStaff?.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Staff Member Details
                </Typography>
              </Box>
            </Stack>
          </DialogTitle>
          <DialogContent>
            {selectedStaff && (
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
                      {selectedStaff.firstName} {selectedStaff.lastName}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Employee ID
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedStaff.employeeId}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Date of Birth
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedStaff.dateOfBirth ? new Date(selectedStaff.dateOfBirth).toLocaleDateString() : 'Not provided'}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Gender
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedStaff.gender || 'Not specified'}
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
                      {selectedStaff.email}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedStaff.phone}
                    </Typography>
                  </Grid>
                </Grid>

                {/* Work Information */}
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Work Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Department
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      <Chip
                        label={selectedStaff.department}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Position
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedStaff.position}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Role
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      <Chip
                        label={selectedStaff.role}
                        size="small"
                        color={getRoleColor(selectedStaff.role)}
                        variant="outlined"
                      />
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Salary
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }} color="success.main" fontWeight="medium">
                      {formatCurrency(selectedStaff.salary || 0)}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Work Schedule
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedStaff.workSchedule}
                    </Typography>
                  </Grid>
                </Grid>

                {/* Skills */}
                {selectedStaff.skills && selectedStaff.skills.length > 0 && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                      Skills
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {selectedStaff.skills.map((skill) => (
                        <Chip
                          key={skill}
                          label={skill}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  </>
                )}

                {/* Certifications */}
                {selectedStaff.certifications && selectedStaff.certifications.length > 0 && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                      Certifications
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {selectedStaff.certifications.map((cert) => (
                        <Chip
                          key={cert}
                          label={cert}
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  </>
                )}

                {/* Emergency Contact */}
                {selectedStaff.emergencyContact && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                      Emergency Contact
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Name
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {selectedStaff.emergencyContact.name}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Relationship
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {selectedStaff.emergencyContact.relationship}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Phone
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {selectedStaff.emergencyContact.phone}
                        </Typography>
                      </Grid>
                    </Grid>
                  </>
                )}

                {/* Notes */}
                {selectedStaff.notes && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                      Notes
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedStaff.notes}
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
                      Hire Date
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {new Date(selectedStaff.hireDate).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {new Date(selectedStaff.updatedAt).toLocaleString()}
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
            {selectedStaff && selectedStaff.status !== 'deleted' && (
              <Button
                onClick={() => {
                  handleCloseViewDialog();
                  handleEditStaff(selectedStaff);
                }}
                variant="contained"
                color="primary"
              >
                Edit Staff
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    </PageContainer>
  );
};

export default ListStaff;
