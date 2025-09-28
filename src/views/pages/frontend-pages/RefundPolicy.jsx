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
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import HeaderAlert from '../../../components/frontend-pages/shared/header/HeaderAlert';
import HpHeader from '../../../components/frontend-pages/shared/header/HpHeader.jsx';
import Footer from '../../../components/frontend-pages/shared/footer';
import ScrollToTop from '../../../components/frontend-pages/shared/scroll-to-top';

export default function RefundPolicy() {
  return (
    <PageContainer title="Refund Policy" description="Our refund policy and processing information">
      <HeaderAlert />
      <HpHeader />

      <Container maxWidth="lg" sx={{ mt: 5, mb: 8 }}>
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" fontWeight={700} textAlign="center" sx={{ mb: 2 }}>
            Refund Policy
          </Typography>
          <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
            Last updated: {new Date().toLocaleDateString()}
          </Typography>
        </Box>

        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body2">
            We strive to process all refunds quickly and efficiently. This policy outlines our
            refund procedures and timelines.
          </Typography>
        </Alert>

        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            1. Refund Eligibility
          </Typography>
          <Typography variant="body1" paragraph>
            Refunds are available for the following situations:
          </Typography>

          <List>
            <ListItem>
              <ListItemText
                primary="Standard Returns"
                secondary="Items returned within the specified return period in original condition"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Defective Products"
                secondary="Items that arrive damaged, defective, or not as described"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Wrong Items"
                secondary="Items that differ from what was ordered"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Cancelled Orders"
                secondary="Orders cancelled before shipment"
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="Duplicate Orders" secondary="Accidental duplicate purchases" />
            </ListItem>
          </List>
        </Paper>

        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            2. Refund Processing Timeline
          </Typography>
          <Typography variant="body1" paragraph>
            Here's what happens after you initiate a refund:
          </Typography>

          <Stepper orientation="vertical" sx={{ mt: 3 }}>
            <Step active={true}>
              <StepLabel>
                <Typography variant="h6">Day 1: Return Initiated</Typography>
              </StepLabel>
              <StepContent>
                <Typography variant="body2">
                  You initiate the return through your account or by contacting customer service
                </Typography>
              </StepContent>
            </Step>

            <Step active={true}>
              <StepLabel>
                <Typography variant="h6">Day 2-3: Return Shipped</Typography>
              </StepLabel>
              <StepContent>
                <Typography variant="body2">
                  You ship the item back using the provided return label
                </Typography>
              </StepContent>
            </Step>

            <Step active={true}>
              <StepLabel>
                <Typography variant="h6">Day 5-7: Item Received</Typography>
              </StepLabel>
              <StepContent>
                <Typography variant="body2">
                  We receive and inspect the returned item at our warehouse
                </Typography>
              </StepContent>
            </Step>

            <Step active={true}>
              <StepLabel>
                <Typography variant="h6">Day 8-10: Refund Processed</Typography>
              </StepLabel>
              <StepContent>
                <Typography variant="body2">
                  Refund is processed and sent to your original payment method
                </Typography>
              </StepContent>
            </Step>

            <Step active={true}>
              <StepLabel>
                <Typography variant="h6">Day 10-14: Refund Received</Typography>
              </StepLabel>
              <StepContent>
                <Typography variant="body2">
                  Refund appears in your account (timing depends on your bank)
                </Typography>
              </StepContent>
            </Step>
          </Stepper>
        </Paper>

        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            3. Refund Methods
          </Typography>
          <Typography variant="body1" paragraph>
            Refunds are processed using the same payment method used for the original purchase:
          </Typography>

          <List>
            <ListItem>
              <ListItemText
                primary="Credit/Debit Cards"
                secondary="Refunds appear on your statement within 3-5 business days"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="PayPal"
                secondary="Refunds are processed immediately to your PayPal account"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Bank Transfer"
                secondary="Refunds may take 5-10 business days to appear in your account"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Store Credit"
                secondary="Available immediately and can be used for future purchases"
              />
            </ListItem>
          </List>
        </Paper>

        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            4. Partial Refunds
          </Typography>
          <Typography variant="body1" paragraph>
            In certain circumstances, we may issue partial refunds:
          </Typography>

          <List>
            <ListItem>
              <ListItemText
                primary="Restocking Fees"
                secondary="Some items may incur a restocking fee of up to 15%"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Shipping Costs"
                secondary="Original shipping costs are typically non-refundable"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Used Items"
                secondary="Items showing signs of use may receive reduced refunds"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Missing Accessories"
                secondary="Items returned without original accessories may be partially refunded"
              />
            </ListItem>
          </List>
        </Paper>

        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            5. Non-Refundable Items
          </Typography>
          <Typography variant="body1" paragraph>
            The following items are generally not eligible for refunds:
          </Typography>

          <List>
            <ListItem>
              <ListItemText primary="Digital downloads and software licenses" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Gift cards and store credits" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Personalized or custom-made items" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Perishable goods and food items" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Items damaged by misuse or normal wear" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Items returned after the return period" />
            </ListItem>
          </List>
        </Paper>

        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            6. Refund Exceptions
          </Typography>
          <Typography variant="body1" paragraph>
            We may make exceptions to our standard refund policy in the following cases:
          </Typography>

          <List>
            <ListItem>
              <ListItemText
                primary="Our Error"
                secondary="If we made a mistake, we'll provide a full refund including shipping"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Quality Issues"
                secondary="Items that don't meet quality standards will be fully refunded"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Late Delivery"
                secondary="Significantly delayed orders may be eligible for refunds"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Customer Service Discretion"
                secondary="We may offer refunds on a case-by-case basis for exceptional circumstances"
              />
            </ListItem>
          </List>
        </Paper>

        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            7. International Refunds
          </Typography>
          <Typography variant="body1" paragraph>
            For international orders, please note the following:
          </Typography>

          <List>
            <ListItem>
              <ListItemText primary="Refunds are processed in the original currency" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Exchange rates may affect the final refund amount" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Customs duties and taxes are non-refundable" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Processing time may be longer for international refunds" />
            </ListItem>
          </List>
        </Paper>

        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            8. Dispute Resolution
          </Typography>
          <Typography variant="body1" paragraph>
            If you're not satisfied with a refund decision:
          </Typography>

          <List>
            <ListItem>
              <ListItemText
                primary="Contact Customer Service"
                secondary="Our team will review your case and provide a resolution"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Escalation Process"
                secondary="Complex cases may be escalated to our management team"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Documentation"
                secondary="Please provide any relevant documentation to support your case"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Final Resolution"
                secondary="We will work with you to reach a fair resolution"
              />
            </ListItem>
          </List>
        </Paper>

        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            9. Contact Information
          </Typography>
          <Typography variant="body1" paragraph>
            For refund-related questions or assistance:
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">
              <strong>Email:</strong> refunds@Kontainar-store.com
            </Typography>
            <Typography variant="body1">
              <strong>Phone:</strong> +1 (555) 123-4567
            </Typography>
            <Typography variant="body1">
              <strong>Live Chat:</strong> Available 24/7 on our website
            </Typography>
            <Typography variant="body1">
              <strong>Business Hours:</strong> Monday - Friday, 9 AM - 6 PM EST
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


