import React from 'react';
import { Box, Stack, Typography, Container, Button } from '@mui/material';
import { Grid } from '@mui/material';
import { Link } from 'react-router';

const Banner = () => {
  return (
    <Box
      bgcolor="primary.light"
      sx={{
        paddingTop: {
          xs: '40px',
          lg: '100px',
        },
        paddingBottom: {
          xs: '40px',
          lg: '100px',
        },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3} justifyContent="space-between">
          <Grid size={{ xs: 12, lg: 6 }} alignItems="center">
            <Typography
              variant="h1"
              mb={3}
              lineHeight={1.4}
              fontWeight={700}
              sx={{
                fontSize: {
                  xs: '34px',
                  sm: '48px',
                },
              }}
            >
              Become a Seller and Start Your Business Journey
            </Typography>
            <Typography variant="h6" color="text.secondary" mb={4} lineHeight={1.6}>
              Join thousands of successful sellers on our marketplace. Start selling today and grow your business with our powerful tools and support.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button 
                variant="contained" 
                size="large" 
                onClick={() => document.getElementById('application-form').scrollIntoView({ behavior: 'smooth' })}
              >
                Start Selling Today
              </Button>
              <Button variant="outlined" size="large" component={Link} to="/frontend-pages/upcoming-offers">
                View Upcoming Offers
              </Button>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, lg: 5 }} display="flex" alignItems="center">
            <Typography lineHeight={1.9}>
              Our platform provides everything you need to start and grow your online business. 
              From easy store setup to advanced analytics, we've got you covered. Join our community 
              of successful sellers and start your journey to financial freedom.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Banner;


