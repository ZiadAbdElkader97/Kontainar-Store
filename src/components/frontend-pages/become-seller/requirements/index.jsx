import React from 'react';
import { Box, Typography, Grid, Paper, Stack } from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';

const requirements = [
  'Valid business license or tax ID',
  'Bank account for payouts',
  'High-quality product images',
  'Clear product descriptions',
  'Competitive pricing strategy',
  'Customer service commitment',
];

const Requirements = () => {
  return (
    <Box sx={{ py: 8 }}>
      <Box sx={{ maxWidth: 'lg', mx: 'auto', px: 3 }}>
        <Typography variant="h3" fontWeight={700} textAlign="center" sx={{ mb: 2 }}>
          Requirements to Get Started
        </Typography>
        <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}>
          Make sure you have everything ready before applying to become a seller
        </Typography>
        
        <Paper 
          sx={{ 
            p: 6, 
            bgcolor: 'background.paper',
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: (theme) => theme.palette.mode === 'dark' ? 2 : 1
          }}
        >
          <Grid container spacing={3}>
            {requirements.map((requirement, index) => (
              <Grid size={{ xs: 12, sm: 6 }} key={index}>
                <Stack 
                  direction="row" 
                  alignItems="center" 
                  spacing={2}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'background.default',
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      boxShadow: (theme) => theme.palette.mode === 'dark' ? 2 : 1,
                      transform: 'translateY(-2px)',
                      borderColor: 'primary.main',
                    }
                  }}
                >
                  <CheckCircleIcon 
                    color="success" 
                    sx={{ fontSize: 28 }}
                  />
                  <Typography variant="h6" fontWeight={500}>
                    {requirement}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default Requirements;


