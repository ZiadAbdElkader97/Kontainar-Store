import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Chip,
  Stack,
  Alert,
  Divider,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import PageContainer from 'src/components/container/PageContainer.jsx';
import { createAttribute } from '../../../api/attributes/AttributesData.js';

const AddAttribute = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'text',
    description: '',
    isRequired: false,
    isActive: true,
    options: [],
    unit: ''
  });

  const [newOption, setNewOption] = useState('');

  const attributeTypes = [
    { value: 'text', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'select', label: 'Select' },
    { value: 'multiselect', label: 'Multi Select' },
    { value: 'boolean', label: 'Boolean' },
    { value: 'date', label: 'Date' },
    { value: 'url', label: 'URL' },
    { value: 'email', label: 'Email' }
  ];

  const handleInputChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddOption = () => {
    if (newOption.trim() && !formData.options.includes(newOption.trim())) {
      setFormData(prev => ({
        ...prev,
        options: [...prev.options, newOption.trim()]
      }));
      setNewOption('');
    }
  };

  const handleRemoveOption = (optionToRemove) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter(option => option !== optionToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validation
      if (!formData.name.trim()) {
        throw new Error('Attribute name is required');
      }

      if ((formData.type === 'select' || formData.type === 'multiselect') && formData.options.length === 0) {
        throw new Error('Options are required for select/multiselect attributes');
      }

      const attributeData = {
        name: formData.name.trim(),
        type: formData.type,
        description: formData.description.trim(),
        isRequired: formData.isRequired,
        isActive: formData.isActive,
        options: formData.options,
        unit: formData.unit.trim()
      };

      await createAttribute(attributeData);
      setSuccess('Attribute created successfully!');
      
      // Reset form
      setFormData({
        name: '',
        type: 'text',
        description: '',
        isRequired: false,
        isActive: true,
        options: [],
        unit: ''
      });
      setNewOption('');

      // Navigate back after 2 seconds
      setTimeout(() => {
        navigate('/main-store/attributes/list');
      }, 2000);

    } catch (err) {
      setError(err.message || 'Failed to create attribute');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/main-store/attributes/list');
  };

  return (
    <PageContainer title="Add New Attribute">
      <Box>
        {/* Header */}
        <Box display="flex" alignItems="center" mb={3}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1">
            Add New Attribute
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

        {/* Form */}
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom>
                    Basic Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Attribute Name"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    required
                    placeholder="e.g., Color, Size, Material"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth required>
                    <InputLabel>Attribute Type</InputLabel>
                    <Select
                      value={formData.type}
                      onChange={handleInputChange('type')}
                      label="Attribute Type"
                    >
                      {attributeTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={formData.description}
                    onChange={handleInputChange('description')}
                    multiline
                    rows={3}
                    placeholder="Describe what this attribute is used for..."
                  />
                </Grid>

                {/* Options for Select/MultiSelect */}
                {(formData.type === 'select' || formData.type === 'multiselect') && (
                  <>
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="h6" gutterBottom>
                        Options
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                    </Grid>

                    <Grid size={{ xs: 12, md: 8 }}>
                      <TextField
                        fullWidth
                        label="Add Option"
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                        placeholder="Enter option value"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddOption();
                          }
                        }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={handleAddOption}
                        disabled={!newOption.trim()}
                        sx={{ height: '56px' }}
                      >
                        Add Option
                      </Button>
                    </Grid>

                    {formData.options.length > 0 && (
                      <Grid size={{ xs: 12 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Current Options:
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {formData.options.map((option, index) => (
                            <Chip
                              key={index}
                              label={option}
                              onDelete={() => handleRemoveOption(option)}
                              deleteIcon={<DeleteIcon />}
                              color="primary"
                              variant="outlined"
                            />
                          ))}
                        </Stack>
                      </Grid>
                    )}
                  </>
                )}

                {/* Unit for Number type */}
                {formData.type === 'number' && (
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Unit"
                      value={formData.unit}
                      onChange={handleInputChange('unit')}
                      placeholder="e.g., grams, cm, kg"
                    />
                  </Grid>
                )}

                {/* Settings */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="h6" gutterBottom>
                    Settings
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isRequired}
                        onChange={handleInputChange('isRequired')}
                        color="primary"
                      />
                    }
                    label="Required Attribute"
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isActive}
                        onChange={handleInputChange('isActive')}
                        color="primary"
                      />
                    }
                    label="Active"
                  />
                </Grid>

                {/* Submit Button */}
                <Grid size={{ xs: 12 }}>
                  <Box display="flex" gap={2} justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      onClick={handleBack}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<SaveIcon />}
                      disabled={loading}
                    >
                      {loading ? 'Creating...' : 'Create Attribute'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Box>
    </PageContainer>
  );
};

export default AddAttribute;
