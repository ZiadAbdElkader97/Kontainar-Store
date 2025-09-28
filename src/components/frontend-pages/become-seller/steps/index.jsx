import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Avatar } from '@mui/material';

const steps = [
  {
    step: 1,
    title: 'Sign Up',
    description: 'Create your seller account and complete the registration process.',
  },
  {
    step: 2,
    title: 'Verify Documents',
    description: 'Upload required documents for account verification and approval.',
  },
  {
    step: 3,
    title: 'Setup Store',
    description: 'Customize your store, add products, and configure payment methods.',
  },
  {
    step: 4,
    title: 'Start Selling',
    description: 'Launch your store and start receiving orders from customers.',
  },
];

const Steps = () => {
  return (
    <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
      <Box sx={{ maxWidth: 'lg', mx: 'auto', px: 3 }}>
        <Typography variant="h3" fontWeight={700} textAlign="center" sx={{ mb: 2 }}>
          How to Get Started
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
        >
          Follow these simple steps to start your selling journey with us
        </Typography>

        <Grid container spacing={4}>
          {steps.map((step, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 3,
                  height: '100%',
                  position: 'relative',
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: (theme) => (theme.palette.mode === 'dark' ? 4 : 2),
                    borderColor: 'primary.main',
                  },
                }}
              >
                <CardContent>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: 'primary.main',
                      mx: 'auto',
                      mb: 3,
                      fontSize: '2rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {step.step}
                  </Avatar>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    {step.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" lineHeight={1.6}>
                    {step.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Steps;


