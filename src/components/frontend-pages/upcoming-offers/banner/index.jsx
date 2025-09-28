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
              Upcoming Offers & Deals
            </Typography>
            <Typography variant="h6" color="text.secondary" mb={4} lineHeight={1.6}>
              Don't miss out on these amazing deals coming soon! Get notified when these offers go live and save big on your favorite products.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => document.getElementById('offers-grid').scrollIntoView({ behavior: 'smooth' })}
              >
                View All Offers
              </Button>
              <Button variant="outlined" size="large" component={Link} to="/frontend-pages/become-seller">
                Become a Seller
              </Button>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, lg: 5 }} display="flex" alignItems="center">
            <Typography lineHeight={1.9}>
              Stay ahead of the game with our upcoming offers. From Black Friday mega sales to seasonal 
              discounts, we bring you the best deals before they go live. Turn on notifications to never 
              miss a great deal again.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Banner;


