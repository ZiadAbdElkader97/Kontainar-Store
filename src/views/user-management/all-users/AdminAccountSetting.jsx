import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  TextField,
  Typography,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Avatar,
  IconButton,
  InputAdornment,
  FormControlLabel,
  FormGroup,
  Switch,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from '@mui/material';
import {
  Save as SaveIcon,
  AdminPanelSettings as AdminIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Lock as LockIcon,
  VpnKey as VpnKeyIcon,
  Shield as ShieldIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer.jsx';
import {
  getUserById,
  updateUser,
  updateUserPermissions,
  verifyUserEmail,
  verifyUserPhone,
  toggleTwoFactorAuth,
} from '../../../api/user-management/AllUsersData.js';

const AdminAccountSetting = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changePasswordDialog, setChangePasswordDialog] = useState(false);

  // Mock admin user data - in real app, this would come from authentication context
  const [adminUser, setAdminUser] = useState({
    id: '1',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    phone: '+1234567890',
    role: 'admin',
    status: 'active',
    avatar: null,
    department: 'IT',
    position: 'System Administrator',
    joinDate: new Date().toISOString(),
    lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    permissions: ['read', 'write', 'delete', 'admin'],
    isEmailVerified: true,
    isPhoneVerified: true,
    twoFactorEnabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    securityAlerts: true,
    systemUpdates: true,
    maintenanceAlerts: true,
    language: 'en',
    theme: 'light',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordExpiry: 90,
    requireStrongPassword: true,
    loginNotifications: true,
    deviceTracking: true,
  });

  const permissionOptions = [
    { value: 'read', label: 'Read Access', description: 'View data and reports' },
    { value: 'write', label: 'Write Access', description: 'Create and modify data' },
    { value: 'delete', label: 'Delete Access', description: 'Remove data and records' },
    { value: 'admin', label: 'Admin Access', description: 'Full system administration' },
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'ar', label: 'العربية' },
    { value: 'fr', label: 'Français' },
    { value: 'es', label: 'Español' },
  ];

  const timezoneOptions = [
    { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
    { value: 'EST', label: 'EST (Eastern Standard Time)' },
    { value: 'PST', label: 'PST (Pacific Standard Time)' },
    { value: 'GMT', label: 'GMT (Greenwich Mean Time)' },
  ];

  useEffect(() => {
    // Load admin user data
    loadAdminUser();
  }, []);

  const loadAdminUser = () => {
    try {
      // In real app, get current admin user from auth context
      const user = getUserById('1'); // Mock admin user ID
      if (user) {
        setAdminUser(user);
        setFormData({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          department: user.department,
          position: user.position,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (err) {
      setError('Failed to load admin user data');
    }
  };

  const handleInputChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSettingsChange = (field) => (event) => {
    setSettings((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSecuritySettingsChange = (field) => (event) => {
    setSecuritySettings((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSwitchChange = (field) => (event) => {
    setSettings((prev) => ({
      ...prev,
      [field]: event.target.checked,
    }));
  };

  const handleSecuritySwitchChange = (field) => (event) => {
    setSecuritySettings((prev) => ({
      ...prev,
      [field]: event.target.checked,
    }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { currentPassword, newPassword, confirmPassword, ...profileData } = formData;
      await updateUser(adminUser.id, profileData);
      setSuccess('Profile updated successfully!');

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error('New passwords do not match');
      }

      if (formData.newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters long');
      }

      // In real app, verify current password and update
      await updateUser(adminUser.id, { password: formData.newPassword });
      setSuccess('Password changed successfully!');
      setChangePasswordDialog(false);

      // Reset password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // In real app, save settings to backend
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      setSuccess('Settings saved successfully!');

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSecuritySettings = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // In real app, save security settings to backend
      localStorage.setItem('adminSecuritySettings', JSON.stringify(securitySettings));
      setSuccess('Security settings saved successfully!');

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to save security settings');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const TabPanel = ({ children, value, index, ...other }) => {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`admin-tabpanel-${index}`}
        aria-labelledby={`admin-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  };

  return (
    <PageContainer
      title="Admin Account Settings"
      description="Manage admin account settings and preferences"
    >
      <Box>
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgb(27, 27, 48) 0%, #16213e 100%)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                Admin Account Settings
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Manage your admin account settings and preferences
              </Typography>
            </Box>
            <Avatar sx={{ width: 80, height: 80, bgcolor: 'rgba(255,255,255,0.2)' }}>
              <AdminIcon sx={{ fontSize: 40 }} />
            </Avatar>
          </Box>
        </Paper>

        {/* Back Button */}
        <Box mb={3}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/user-manage/users/list')}
            variant="outlined"
          >
            Back to Users List
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

        {/* Tabs */}
        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="admin settings tabs">
              <Tab icon={<PersonIcon />} label="Profile" />
              <Tab icon={<SecurityIcon />} label="Security" />
              <Tab icon={<NotificationsIcon />} label="Notifications" />
              <Tab icon={<LanguageIcon />} label="Preferences" />
            </Tabs>
          </Box>

          {/* Profile Tab */}
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card>
                  <CardContent>
                    <Box textAlign="center">
                      <Avatar
                        sx={{
                          width: 100,
                          height: 100,
                          bgcolor: 'primary.main',
                          mx: 'auto',
                          mb: 2,
                        }}
                      >
                        {adminUser.avatar ? (
                          <img
                            src={adminUser.avatar}
                            alt={`${adminUser.firstName} ${adminUser.lastName}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          `${adminUser.firstName.charAt(0)}${adminUser.lastName.charAt(0)}`
                        )}
                      </Avatar>
                      <Typography variant="h6" gutterBottom>
                        {adminUser.firstName} {adminUser.lastName}
                      </Typography>
                      <Chip
                        label="Administrator"
                        color="error"
                        icon={<AdminIcon />}
                        sx={{ mb: 2 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {adminUser.email}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {adminUser.department} • {adminUser.position}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 8 }}>
                <Card>
                  <CardHeader title="Profile Information" />
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="First Name"
                          value={formData.firstName}
                          onChange={handleInputChange('firstName')}
                          variant="outlined"
                        />
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          value={formData.lastName}
                          onChange={handleInputChange('lastName')}
                          variant="outlined"
                        />
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange('email')}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailIcon />
                              </InputAdornment>
                            ),
                          }}
                          variant="outlined"
                        />
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          value={formData.phone}
                          onChange={handleInputChange('phone')}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PhoneIcon />
                              </InputAdornment>
                            ),
                          }}
                          variant="outlined"
                        />
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Department"
                          value={formData.department}
                          onChange={handleInputChange('department')}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <BusinessIcon />
                              </InputAdornment>
                            ),
                          }}
                          variant="outlined"
                        />
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Position"
                          value={formData.position}
                          onChange={handleInputChange('position')}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <WorkIcon />
                              </InputAdornment>
                            ),
                          }}
                          variant="outlined"
                        />
                      </Grid>

                      <Grid size={{ xs: 12 }}>
                        <Box display="flex" justifyContent="flex-end" gap={2}>
                          <Button
                            variant="outlined"
                            onClick={() => setChangePasswordDialog(true)}
                            startIcon={<LockIcon />}
                          >
                            Change Password
                          </Button>
                          <Button
                            variant="contained"
                            onClick={handleSaveProfile}
                            startIcon={loading ? <LinearProgress size={16} /> : <SaveIcon />}
                            disabled={loading}
                          >
                            {loading ? 'Saving...' : 'Save Profile'}
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Security Tab */}
          <TabPanel value={activeTab} index={1}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardHeader title="Security Settings" />
                  <CardContent>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={securitySettings.twoFactorEnabled}
                            onChange={handleSecuritySwitchChange('twoFactorEnabled')}
                          />
                        }
                        label="Two-Factor Authentication"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={securitySettings.requireStrongPassword}
                            onChange={handleSecuritySwitchChange('requireStrongPassword')}
                          />
                        }
                        label="Require Strong Password"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={securitySettings.loginNotifications}
                            onChange={handleSecuritySwitchChange('loginNotifications')}
                          />
                        }
                        label="Login Notifications"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={securitySettings.deviceTracking}
                            onChange={handleSecuritySwitchChange('deviceTracking')}
                          />
                        }
                        label="Device Tracking"
                      />
                    </FormGroup>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12 }}>
                        <FormControl fullWidth>
                          <InputLabel>Session Timeout (minutes)</InputLabel>
                          <Select
                            value={securitySettings.sessionTimeout}
                            onChange={handleSecuritySettingsChange('sessionTimeout')}
                            label="Session Timeout (minutes)"
                          >
                            <MenuItem value={15}>15 minutes</MenuItem>
                            <MenuItem value={30}>30 minutes</MenuItem>
                            <MenuItem value={60}>1 hour</MenuItem>
                            <MenuItem value={120}>2 hours</MenuItem>
                            <MenuItem value={480}>8 hours</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid size={{ xs: 12 }}>
                        <FormControl fullWidth>
                          <InputLabel>Max Login Attempts</InputLabel>
                          <Select
                            value={securitySettings.maxLoginAttempts}
                            onChange={handleSecuritySettingsChange('maxLoginAttempts')}
                            label="Max Login Attempts"
                          >
                            <MenuItem value={3}>3 attempts</MenuItem>
                            <MenuItem value={5}>5 attempts</MenuItem>
                            <MenuItem value={10}>10 attempts</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid size={{ xs: 12 }}>
                        <FormControl fullWidth>
                          <InputLabel>Password Expiry (days)</InputLabel>
                          <Select
                            value={securitySettings.passwordExpiry}
                            onChange={handleSecuritySettingsChange('passwordExpiry')}
                            label="Password Expiry (days)"
                          >
                            <MenuItem value={30}>30 days</MenuItem>
                            <MenuItem value={60}>60 days</MenuItem>
                            <MenuItem value={90}>90 days</MenuItem>
                            <MenuItem value={180}>180 days</MenuItem>
                            <MenuItem value={365}>1 year</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>

                    <Box display="flex" justifyContent="flex-end" mt={3}>
                      <Button
                        variant="contained"
                        onClick={handleSaveSecuritySettings}
                        startIcon={loading ? <LinearProgress size={16} /> : <SaveIcon />}
                        disabled={loading}
                      >
                        {loading ? 'Saving...' : 'Save Security Settings'}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardHeader title="Current Permissions" />
                  <CardContent>
                    <List>
                      {permissionOptions.map((permission) => (
                        <ListItem key={permission.value}>
                          <ListItemIcon>
                            {adminUser.permissions.includes(permission.value) ? (
                              <CheckIcon color="success" />
                            ) : (
                              <CancelIcon color="error" />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={permission.label}
                            secondary={permission.description}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Notifications Tab */}
          <TabPanel value={activeTab} index={2}>
            <Card>
              <CardHeader title="Notification Preferences" />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h6" gutterBottom>
                      Email Notifications
                    </Typography>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.emailNotifications}
                            onChange={handleSwitchChange('emailNotifications')}
                          />
                        }
                        label="Email Notifications"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.securityAlerts}
                            onChange={handleSwitchChange('securityAlerts')}
                          />
                        }
                        label="Security Alerts"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.systemUpdates}
                            onChange={handleSwitchChange('systemUpdates')}
                          />
                        }
                        label="System Updates"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.maintenanceAlerts}
                            onChange={handleSwitchChange('maintenanceAlerts')}
                          />
                        }
                        label="Maintenance Alerts"
                      />
                    </FormGroup>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h6" gutterBottom>
                      Other Notifications
                    </Typography>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.smsNotifications}
                            onChange={handleSwitchChange('smsNotifications')}
                          />
                        }
                        label="SMS Notifications"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.pushNotifications}
                            onChange={handleSwitchChange('pushNotifications')}
                          />
                        }
                        label="Push Notifications"
                      />
                    </FormGroup>
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Box display="flex" justifyContent="flex-end">
                      <Button
                        variant="contained"
                        onClick={handleSaveSettings}
                        startIcon={loading ? <LinearProgress size={16} /> : <SaveIcon />}
                        disabled={loading}
                      >
                        {loading ? 'Saving...' : 'Save Notification Settings'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </TabPanel>

          {/* Preferences Tab */}
          <TabPanel value={activeTab} index={3}>
            <Card>
              <CardHeader title="System Preferences" />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Language</InputLabel>
                      <Select
                        value={settings.language}
                        onChange={handleSettingsChange('language')}
                        label="Language"
                      >
                        {languageOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Timezone</InputLabel>
                      <Select
                        value={settings.timezone}
                        onChange={handleSettingsChange('timezone')}
                        label="Timezone"
                      >
                        {timezoneOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Date Format</InputLabel>
                      <Select
                        value={settings.dateFormat}
                        onChange={handleSettingsChange('dateFormat')}
                        label="Date Format"
                      >
                        <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                        <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                        <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl fullWidth>
                      <InputLabel>Time Format</InputLabel>
                      <Select
                        value={settings.timeFormat}
                        onChange={handleSettingsChange('timeFormat')}
                        label="Time Format"
                      >
                        <MenuItem value="12h">12-hour (AM/PM)</MenuItem>
                        <MenuItem value="24h">24-hour</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h6" gutterBottom>
                      Theme Preferences
                    </Typography>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.theme === 'dark'}
                            onChange={(e) =>
                              setSettings((prev) => ({
                                ...prev,
                                theme: e.target.checked ? 'dark' : 'light',
                              }))
                            }
                          />
                        }
                        label="Dark Mode"
                      />
                    </FormGroup>
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Box display="flex" justifyContent="flex-end">
                      <Button
                        variant="contained"
                        onClick={handleSaveSettings}
                        startIcon={loading ? <LinearProgress size={16} /> : <SaveIcon />}
                        disabled={loading}
                      >
                        {loading ? 'Saving...' : 'Save Preferences'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </TabPanel>
        </Card>

        {/* Change Password Dialog */}
        <Dialog
          open={changePasswordDialog}
          onClose={() => setChangePasswordDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.currentPassword}
                  onChange={handleInputChange('currentPassword')}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="New Password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={handleInputChange('newPassword')}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                          {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setChangePasswordDialog(false)}>Cancel</Button>
            <Button
              onClick={handleChangePassword}
              variant="contained"
              startIcon={loading ? <LinearProgress size={16} /> : <SaveIcon />}
              disabled={loading}
            >
              {loading ? 'Changing...' : 'Change Password'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PageContainer>
  );
};

export default AdminAccountSetting;
