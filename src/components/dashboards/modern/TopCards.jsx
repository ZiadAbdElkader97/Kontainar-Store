import React from 'react';
import { Box, CardContent, Typography } from '@mui/material';
import { Grid } from '@mui/material';

import icon1 from '../../../assets/images/svgs/tickets.svg';
import icon2 from '../../../assets/images/svgs/users.svg';
import icon3 from '../../../assets/images/svgs/customers.svg';
import icon4 from '../../../assets/images/svgs/products.svg';
import icon5 from '../../../assets/images/svgs/orders.svg';
import icon6 from '../../../assets/images/svgs/emails.svg';

const topcards = [
  {
    icon: icon2,
    title: 'Users',
    digits: '96',
    bgcolor: 'primary',
  },
  {
    icon: icon3,
    title: 'Customers',
    digits: '3,650',
    bgcolor: 'warning',
  },
  {
    icon: icon4,
    title: 'Products',
    digits: '356',
    bgcolor: 'secondary',
  },
  {
    icon: icon5,
    title: 'Orders',
    digits: '696',
    bgcolor: 'error',
  },
  {
    icon: icon6,
    title: 'Emails',
    digits: '44',
    bgcolor: 'success',
  },
  {
    icon: icon1,
    title: 'Tickets',
    digits: '59',
    bgcolor: 'info',
  },
];

const TopCards = () => {
  return (
    <Grid container spacing={3}>
      {topcards.map((topcard, i) => (
        <Grid size={{ xs: 12, sm: 4, lg: 2 }} key={i}>
          <Box bgcolor={topcard.bgcolor + '.light'} textAlign="center">
            <CardContent>
              <img src={topcard.icon} alt={topcard.icon} width="50" />
              <Typography
                color={topcard.bgcolor + '.main'}
                mt={1}
                variant="subtitle1"
                fontWeight={600}
              >
                {topcard.title}
              </Typography>
              <Typography color={topcard.bgcolor + '.main'} variant="h4" fontWeight={600}>
                {topcard.digits}
              </Typography>
            </CardContent>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default TopCards;


