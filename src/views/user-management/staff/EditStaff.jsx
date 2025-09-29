import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  LinearProgress,
  Stack,
  Chip,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Divider,
  Autocomplete,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  ContactPhone as ContactPhoneIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer.jsx';
import {
  getStaffById,
  updateStaff,
  getStaffByEmail,
  getStaffByEmployeeId,
  getAllDepartments,
  getAllSkills,
} from '../../../api/user-management/StaffData.js';

const EditStaff = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [departments, setDepartments] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [staff, setStaff] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: 'Egypt',
      zipCode: '',
    },
    employeeId: '',
    department: '',
    position: '',
    role: '',
    salary: '',
    workSchedule: 'full-time',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
    },
    skills: [],
    certifications: [],
    notes: '',
  });

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  const departmentOptions = [
    'IT',
    'HR',
    'Finance',
    'Marketing',
    'Sales',
    'Operations',
    'Customer Service',
    'Administration',
  ];

  const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'hr', label: 'HR' },
    { value: 'finance', label: 'Finance' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'developer', label: 'Developer' },
    { value: 'manager', label: 'Manager' },
    { value: 'employee', label: 'Employee' },
  ];

  const workScheduleOptions = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'intern', label: 'Intern' },
  ];

  const relationshipOptions = ['Spouse', 'Parent', 'Child', 'Sibling', 'Friend', 'Other'];

  const predefinedSkills = [
    'JavaScript',
    'React',
    'Node.js',
    'Python',
    'Java',
    'C#',
    'SQL',
    'MongoDB',
    'AWS',
    'Docker',
    'Git',
    'Project Management',
    'Communication',
    'Leadership',
    'Problem Solving',
    'Customer Service',
    'Sales',
    'Marketing',
    'Accounting',
    'HR Management',
  ];

  const predefinedCertifications = [
    'AWS Certified',
    'Google Analytics',
    'PMP Certified',
    'PHR Certified',
    'CPA',
    'React Developer',
    'Microsoft Certified',
    'Salesforce Certified',
    'Facebook Marketing',
    'Digital Marketing',
  ];

  useEffect(() => {
    loadStaff();
    loadDepartments();
    loadSkills();
  }, [id]);

  const loadStaff = () => {
    try {
      const staffData = getStaffById(id);
      if (!staffData) {
        setError('Staff member not found');
        return;
      }

      setStaff(staffData);
      setFormData({
        firstName: staffData.firstName || '',
        lastName: staffData.lastName || '',
        email: staffData.email || '',
        phone: staffData.phone || '',
        dateOfBirth: staffData.dateOfBirth || '',
        gender: staffData.gender || '',
        address: {
          street: staffData.address?.street || '',
          city: staffData.address?.city || '',
          state: staffData.address?.state || '',
          country: staffData.address?.country || 'Egypt',
          zipCode: staffData.address?.zipCode || '',
        },
        employeeId: staffData.employeeId || '',
        department: staffData.department || '',
        position: staffData.position || '',
        role: staffData.role || '',
        salary: staffData.salary || '',
        workSchedule: staffData.workSchedule || 'full-time',
        emergencyContact: {
          name: staffData.emergencyContact?.name || '',
          relationship: staffData.emergencyContact?.relationship || '',
          phone: staffData.emergencyContact?.phone || '',
        },
        skills: staffData.skills || [],
        certifications: staffData.certifications || [],
        notes: staffData.notes || '',
      });
    } catch (err) {
      setError('Failed to load staff member');
    }
  };

  const loadDepartments = () => {
    try {
      const allDepartments = getAllDepartments();
      const allDepartmentsList = [...new Set([...departmentOptions, ...allDepartments])];
      setDepartments(allDepartmentsList.sort());
    } catch (err) {
      setError('Failed to load departments');
    }
  };

  const loadSkills = () => {
    try {
      const existingSkills = getAllSkills();
      const allSkills = [...new Set([...predefinedSkills, ...existingSkills])];
      setAvailableSkills(allSkills.sort());
    } catch (err) {
      setError('Failed to load skills');
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSkillsChange = (event, newSkills) => {
    setFormData((prev) => ({
      ...prev,
      skills: newSkills,
    }));
  };

  const handleCertificationsChange = (event, newCertifications) => {
    setFormData((prev) => ({
      ...prev,
      certifications: newCertifications,
    }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (!formData.employeeId.trim()) {
      setError('Employee ID is required');
      return false;
    }
    if (!formData.department.trim()) {
      setError('Department is required');
      return false;
    }
    if (!formData.position.trim()) {
      setError('Position is required');
      return false;
    }
    if (!formData.role.trim()) {
      setError('Role is required');
      return false;
    }
    if (!formData.salary || formData.salary <= 0) {
      setError('Valid salary is required');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Phone validation (basic)
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Please enter a valid phone number');
      return false;
    }

    // Check if email already exists (excluding current staff member)
    const existingStaff = getStaffByEmail(formData.email);
    if (existingStaff && existingStaff.id !== id) {
      setError('Staff member with this email already exists');
      return false;
    }

    // Check if employee ID already exists (excluding current staff member)
    const existingEmployeeId = getStaffByEmployeeId(formData.employeeId);
    if (existingEmployeeId && existingEmployeeId.id !== id) {
      setError('Staff member with this employee ID already exists');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Convert salary to number
      const staffData = {
        ...formData,
        salary: parseFloat(formData.salary),
      };

      await updateStaff(id, staffData);
      setSuccess('Staff member updated successfully');

      // Auto-hide success message after 3 seconds and navigate
      setTimeout(() => {
        setSuccess('');
        navigate('/user-manage/staff/list');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to update staff member');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/user-manage/staff/list');
  };

  if (!staff) {
    return (
      <PageContainer title="Edit Staff" description="Edit staff member information">
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <LinearProgress sx={{ mb: 2 }} />
          <Typography variant="h6">Loading staff member...</Typography>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Edit Staff" description="Edit staff member information">
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={handleCancel} variant="outlined">
              Back to Staff
            </Button>
          </Stack>
          <Typography variant="h4" gutterBottom>
            Edit Staff Member
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Modify staff member information and details
          </Typography>
        </Box>

        {/* Staff Info */}
        <Box sx={{ mb: 3, p: 2, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              {staff.firstName.charAt(0)}
              {staff.lastName.charAt(0)}
            </Box>
            <Box>
              <Typography variant="h6">
                {staff.firstName} {staff.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {staff.email} • {staff.employeeId}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Chip label={staff.department} size="small" color="primary" variant="outlined" />
                <Chip label={staff.position} size="small" color="secondary" variant="outlined" />
                <Chip
                  label={staff.status}
                  size="small"
                  color={staff.status === 'active' ? 'success' : 'warning'}
                  variant="outlined"
                />
              </Stack>
            </Box>
          </Stack>
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

        {/* Loading */}
        {loading && <LinearProgress sx={{ mb: 2 }} />}

        {/* Form */}
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Personal Information */}
                <Grid size={{ xs: 12 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <PersonIcon />
                    Personal Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter first name"
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter last name"
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="staff@company.com"
                    required
                    helperText="This will be used for login and notifications"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+201234567890"
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={formData.gender}
                      label="Gender"
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                    >
                      {genderOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Work Information */}
                <Grid size={{ xs: 12 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <WorkIcon />
                    Work Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Employee ID"
                    value={formData.employeeId}
                    onChange={(e) => handleInputChange('employeeId', e.target.value)}
                    placeholder="EMP001"
                    required
                    helperText="Unique employee identifier"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth required>
                    <InputLabel>Department</InputLabel>
                    <Select
                      value={formData.department}
                      label="Department"
                      onChange={(e) => handleInputChange('department', e.target.value)}
                    >
                      {departments.map((dept) => (
                        <MenuItem key={dept} value={dept}>
                          {dept}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Position"
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    placeholder="e.g., Senior Developer"
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth required>
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={formData.role}
                      label="Role"
                      onChange={(e) => handleInputChange('role', e.target.value)}
                    >
                      {roleOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Salary"
                    type="number"
                    value={formData.salary}
                    onChange={(e) => handleInputChange('salary', e.target.value)}
                    placeholder="10000"
                    required
                    helperText="Monthly salary in EGP"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Work Schedule</InputLabel>
                    <Select
                      value={formData.workSchedule}
                      label="Work Schedule"
                      onChange={(e) => handleInputChange('workSchedule', e.target.value)}
                    >
                      {workScheduleOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Emergency Contact */}
                <Grid size={{ xs: 12 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <ContactPhoneIcon />
                    Emergency Contact
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Contact Name"
                    value={formData.emergencyContact.name}
                    onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
                    placeholder="Emergency contact name"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel>Relationship</InputLabel>
                    <Select
                      value={formData.emergencyContact.relationship}
                      label="Relationship"
                      onChange={(e) =>
                        handleInputChange('emergencyContact.relationship', e.target.value)
                      }
                    >
                      {relationshipOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Contact Phone"
                    value={formData.emergencyContact.phone}
                    onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
                    placeholder="+201234567890"
                  />
                </Grid>

                {/* Skills and Certifications */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Skills and Certifications
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Autocomplete
                    multiple
                    options={availableSkills}
                    value={formData.skills}
                    onChange={handleSkillsChange}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          variant="outlined"
                          label={option}
                          {...getTagProps({ index })}
                          key={option}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Skills"
                        placeholder="Select or add skills"
                        helperText="Add relevant skills"
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Autocomplete
                    multiple
                    options={predefinedCertifications}
                    value={formData.certifications}
                    onChange={handleCertificationsChange}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          variant="outlined"
                          label={option}
                          {...getTagProps({ index })}
                          key={option}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Certifications"
                        placeholder="Select certifications"
                        helperText="Add professional certifications"
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Additional notes about the staff member"
                    multiline
                    rows={3}
                    helperText="Optional notes about the staff member"
                  />
                </Grid>

                {/* Form Actions */}
                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 2 }} />
                  <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button variant="outlined" onClick={handleCancel} disabled={loading}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<SaveIcon />}
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'Update Staff Member'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Box>
    </PageContainer>
  );
};

export default EditStaff;
