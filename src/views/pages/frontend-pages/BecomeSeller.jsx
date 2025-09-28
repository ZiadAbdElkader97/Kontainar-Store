import React, { useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Box,
  Stack,
  Alert,
  Grid,
} from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import HeaderAlert from '../../../components/frontend-pages/shared/header/HeaderAlert';
import HpHeader from '../../../components/frontend-pages/shared/header/HpHeader';
import Footer from '../../../components/frontend-pages/shared/footer';
import ScrollToTop from '../../../components/frontend-pages/shared/scroll-to-top';
import Banner from '../../../components/frontend-pages/become-seller/banner';
import Benefits from '../../../components/frontend-pages/become-seller/benefits';
import Requirements from '../../../components/frontend-pages/become-seller/requirements';
import Steps from '../../../components/frontend-pages/become-seller/steps';

export default function BecomeSeller() {
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    phone: '',
    businessType: '',
    website: '',
    description: '',
  });

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you for your interest! We will contact you soon.');
  };

  return (
    <PageContainer title="Become a Seller" description="Join our marketplace and start selling">
      <HeaderAlert />
      <HpHeader />
      <Banner />
      <Benefits />
      <Requirements />
      <Steps />

      <Container maxWidth="lg" sx={{ mt: 5, mb: 8 }}>
        {/* Application Form */}
        <Box id="application-form">
          <Typography variant="h4" fontWeight={600} textAlign="center" sx={{ mb: 4 }}>
            Apply to Become a Seller
          </Typography>
          <Card sx={{ maxWidth: 600, mx: 'auto' }}>
            <CardContent sx={{ p: 4 }}>
              <Alert severity="info" sx={{ mb: 3 }}>
                Fill out the form below and our team will review your application within 2-3
                business days.
              </Alert>

              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    label="Business Name"
                    value={formData.businessName}
                    onChange={handleInputChange('businessName')}
                    fullWidth
                    required
                  />

                  <TextField
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    fullWidth
                    required
                  />

                  <TextField
                    label="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange('phone')}
                    fullWidth
                    required
                  />

                  <TextField
                    label="Business Type"
                    value={formData.businessType}
                    onChange={handleInputChange('businessType')}
                    fullWidth
                    required
                    placeholder="e.g., Electronics, Fashion, Home & Garden"
                  />

                  <TextField
                    label="Website (Optional)"
                    value={formData.website}
                    onChange={handleInputChange('website')}
                    fullWidth
                    placeholder="https://yourwebsite.com"
                  />

                  <TextField
                    label="Tell us about your business"
                    value={formData.description}
                    onChange={handleInputChange('description')}
                    fullWidth
                    multiline
                    rows={4}
                    required
                    placeholder="Describe your products, target audience, and why you want to sell on our platform..."
                  />

                  <Button type="submit" variant="contained" size="large" fullWidth sx={{ py: 1.5 }}>
                    Submit Application
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>

      <Footer />
      <ScrollToTop />
    </PageContainer>
  );
}


