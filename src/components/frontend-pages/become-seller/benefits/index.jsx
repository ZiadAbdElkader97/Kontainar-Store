import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import {
  Storefront as StorefrontIcon,
  TrendingUp as TrendingUpIcon,
  Support as SupportIcon,
  Security as SecurityIcon,
  Payment as PaymentIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';

const benefits = [
  {
    icon: <StorefrontIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    title: 'Easy Store Setup',
    description: 'Create your online store in minutes with our intuitive dashboard and customizable templates.',
  },
  {
    icon: <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main' }} />,
    title: 'Grow Your Business',
    description: 'Access powerful analytics and marketing tools to expand your customer base and increase sales.',
  },
  {
    icon: <SupportIcon sx={{ fontSize: 40, color: 'info.main' }} />,
    title: '24/7 Support',
    description: 'Get dedicated support from our team to help you succeed in your selling journey.',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
    title: 'Secure Payments',
    description: 'Process payments safely with our secure payment gateway and fraud protection.',
  },
  {
    icon: <PaymentIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
    title: 'Flexible Payouts',
    description: 'Choose from multiple payout options and get paid on your preferred schedule.',
  },
  {
    icon: <AnalyticsIcon sx={{ fontSize: 40, color: 'error.main' }} />,
    title: 'Advanced Analytics',
    description: 'Track your performance with detailed reports and insights to optimize your strategy.',
  },
];

const Benefits = () => {
  return (
    <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
      <Box sx={{ maxWidth: 'lg', mx: 'auto', px: 3 }}>
        <Typography variant="h3" fontWeight={700} textAlign="center" sx={{ mb: 2 }}>
          Why Choose Our Platform?
        </Typography>
        <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}>
          Join thousands of successful sellers who trust our platform to grow their business
        </Typography>
        
        <Grid container spacing={4}>
          {benefits.map((benefit, index) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  textAlign: 'center', 
                  p: 3,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: (theme) => theme.palette.mode === 'dark' ? 4 : 2,
                    borderColor: 'primary.main',
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 3 }}>
                    {benefit.icon}
                  </Box>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    {benefit.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" lineHeight={1.6}>
                    {benefit.description}
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

export default Benefits;


