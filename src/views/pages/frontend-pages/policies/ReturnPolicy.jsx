import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import HeaderAlert from '../../../../components/frontend-pages/shared/header/HeaderAlert';
import HpHeader from '../../../../components/frontend-pages/shared/header/HpHeader';
import Footer from '../../../../components/frontend-pages/shared/footer';
import ScrollToTop from '../../../../components/frontend-pages/shared/scroll-to-top';

export default function ReturnPolicy() {
  const returnTimeframes = [
    { category: 'Electronics', timeframe: '30 days', condition: 'Unopened, original packaging' },
    { category: 'Clothing & Accessories', timeframe: '14 days', condition: 'Unworn, tags attached' },
    { category: 'Books & Media', timeframe: '30 days', condition: 'Unopened, original packaging' },
    { category: 'Home & Garden', timeframe: '30 days', condition: 'Unused, original packaging' },
    { category: 'Beauty & Health', timeframe: '14 days', condition: 'Unopened, original packaging' },
    { category: 'Food & Beverages', timeframe: '7 days', condition: 'Unopened, within expiry date' },
  ];

  return (
    <PageContainer title="Return Policy" description="Our return and exchange policy">
      <HeaderAlert />
      <HpHeader />
      
      <Container maxWidth="lg" sx={{ mt: 5, mb: 8 }}>
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" fontWeight={700} textAlign="center" sx={{ mb: 2 }}>
            Return & Exchange Policy
          </Typography>
          <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
            Last updated: {new Date().toLocaleDateString()}
          </Typography>
        </Box>

        <Alert severity="success" sx={{ mb: 4 }}>
          <Typography variant="body2">
            We want you to be completely satisfied with your purchase. Our flexible return policy makes it easy to return or exchange items.
          </Typography>
        </Alert>

        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            1. Return Timeframes by Category
          </Typography>
          <Typography variant="body1" paragraph>
            Different product categories have different return timeframes based on their nature and typical usage patterns:
          </Typography>
          
          <TableContainer sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Product Category</strong></TableCell>
                  <TableCell><strong>Return Period</strong></TableCell>
                  <TableCell><strong>Conditions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {returnTimeframes.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <Chip label={item.timeframe} color="primary" size="small" />
                    </TableCell>
                    <TableCell>{item.condition}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            2. How to Return an Item
          </Typography>
          <Typography variant="body1" paragraph>
            Follow these simple steps to return your item:
          </Typography>
          
          <List>
            <ListItem>
              <ListItemText 
                primary="Step 1: Log into your account"
                secondary="Go to 'My Orders' and select the item you want to return"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Step 2: Initiate the return"
                secondary="Click 'Return Item' and select your reason for return"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Step 3: Print return label"
                secondary="Download and print the prepaid return shipping label"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Step 4: Package the item"
                secondary="Pack the item securely in its original packaging with all accessories"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Step 5: Ship the return"
                secondary="Drop off the package at any authorized shipping location"
              />
            </ListItem>
          </List>
        </Paper>

        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            3. Return Conditions
          </Typography>
          <Typography variant="body1" paragraph>
            To be eligible for a return, items must meet the following conditions:
          </Typography>
          
          <List>
            <ListItem>
              <ListItemText primary="Item must be in original condition and packaging" />
            </ListItem>
            <ListItem>
              <ListItemText primary="All original tags, labels, and accessories must be included" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Item must not show signs of wear or use" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Return must be initiated within the specified timeframe" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Proof of purchase (order number or receipt) is required" />
            </ListItem>
          </List>
        </Paper>

        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            4. Items That Cannot Be Returned
          </Typography>
          <Typography variant="body1" paragraph>
            The following items are not eligible for return:
          </Typography>
          
          <List>
            <ListItem>
              <ListItemText primary="Personalized or custom-made items" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Digital downloads and software licenses" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Gift cards and store credits" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Items damaged by misuse or normal wear" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Items returned after the return period" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Items without proof of purchase" />
            </ListItem>
          </List>
        </Paper>

        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            5. Refund Processing
          </Typography>
          <Typography variant="body1" paragraph>
            Once we receive and inspect your returned item, we will process your refund:
          </Typography>
          
          <List>
            <ListItem>
              <ListItemText 
                primary="Processing Time"
                secondary="Refunds are typically processed within 3-5 business days after we receive your return"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Refund Method"
                secondary="Refunds will be issued to the original payment method used for the purchase"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Shipping Costs"
                secondary="Original shipping costs are non-refundable unless the return is due to our error"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Restocking Fee"
                secondary="Some items may be subject to a restocking fee of up to 15%"
              />
            </ListItem>
          </List>
        </Paper>

        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            6. Exchanges
          </Typography>
          <Typography variant="body1" paragraph>
            We offer exchanges for items in different sizes, colors, or styles:
          </Typography>
          
          <List>
            <ListItem>
              <ListItemText primary="Exchanges are subject to the same return conditions" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Price differences will be charged or refunded accordingly" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Exchanges are processed after we receive your return" />
            </ListItem>
            <ListItem>
              <ListItemText primary="New item will be shipped once exchange is approved" />
            </ListItem>
          </List>
        </Paper>

        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            7. Damaged or Defective Items
          </Typography>
          <Typography variant="body1" paragraph>
            If you receive a damaged or defective item, please contact us immediately:
          </Typography>
          
          <List>
            <ListItem>
              <ListItemText primary="Report the issue within 48 hours of delivery" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Provide photos of the damage or defect" />
            </ListItem>
            <ListItem>
              <ListItemText primary="We will arrange for a replacement or full refund" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Return shipping will be covered by us" />
            </ListItem>
          </List>
        </Paper>

        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            8. International Returns
          </Typography>
          <Typography variant="body1" paragraph>
            For international orders, please note:
          </Typography>
          
          <List>
            <ListItem>
              <ListItemText primary="Return shipping costs are the customer's responsibility" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Customs duties and taxes are non-refundable" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Processing time may be longer for international returns" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Please ensure proper customs documentation" />
            </ListItem>
          </List>
        </Paper>

        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            9. Contact Us
          </Typography>
          <Typography variant="body1" paragraph>
            If you have any questions about our return policy or need assistance with a return:
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">
              <strong>Email:</strong> returns@Kontainar-store.com
            </Typography>
            <Typography variant="body1">
              <strong>Phone:</strong> +1 (555) 123-4567
            </Typography>
            <Typography variant="body1">
              <strong>Live Chat:</strong> Available 24/7 on our website
            </Typography>
            <Typography variant="body1">
              <strong>Address:</strong> 123 Business Street, City, State 12345
            </Typography>
          </Box>
        </Paper>
      </Container>
      
      <Footer />
      <ScrollToTop />
    </PageContainer>
  );
}


