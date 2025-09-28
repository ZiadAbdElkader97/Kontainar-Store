import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
} from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import HeaderAlert from '../../../components/frontend-pages/shared/header/HeaderAlert';
import HpHeader from '../../../components/frontend-pages/shared/header/HpHeader';
import Footer from '../../../components/frontend-pages/shared/footer';
import ScrollToTop from '../../../components/frontend-pages/shared/scroll-to-top';

export default function PrivacyPolicy() {
  return (
    <PageContainer title="Privacy Policy" description="Our privacy policy and data protection practices">
      <HeaderAlert />
      <HpHeader />
      
      <Container maxWidth="lg" sx={{ mt: 5, mb: 8 }}>
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" fontWeight={700} textAlign="center" sx={{ mb: 2 }}>
            Privacy Policy
          </Typography>
          <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
            Last updated: {new Date().toLocaleDateString()}
          </Typography>
        </Box>

        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body2">
            This Privacy Policy describes how we collect, use, and protect your personal information when you use our services.
          </Typography>
        </Alert>

        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            1. Information We Collect
          </Typography>
          <Typography variant="body1" paragraph>
            We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.
          </Typography>
          
          <Typography variant="h6" fontWeight={600} sx={{ mt: 3, mb: 2 }}>
            Personal Information:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Name and contact information (email, phone number, address)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Account credentials and profile information" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Payment and billing information" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Communication preferences" />
            </ListItem>
          </List>

          <Typography variant="h6" fontWeight={600} sx={{ mt: 3, mb: 2 }}>
            Automatically Collected Information:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Device information and IP address" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Browser type and version" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Usage patterns and preferences" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Cookies and similar tracking technologies" />
            </ListItem>
          </List>
        </Paper>

        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            2. How We Use Your Information
          </Typography>
          <Typography variant="body1" paragraph>
            We use the information we collect to provide, maintain, and improve our services:
          </Typography>
          
          <List>
            <ListItem>
              <ListItemText primary="Process transactions and provide customer support" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Send important updates and notifications" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Personalize your experience and recommendations" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Analyze usage patterns to improve our services" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Comply with legal obligations and protect our rights" />
            </ListItem>
          </List>
        </Paper>

        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            3. Information Sharing and Disclosure
          </Typography>
          <Typography variant="body1" paragraph>
            We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
          </Typography>
          
          <List>
            <ListItem>
              <ListItemText primary="With service providers who assist in our operations" />
            </ListItem>
            <ListItem>
              <ListItemText primary="When required by law or to protect our rights" />
            </ListItem>
            <ListItem>
              <ListItemText primary="In connection with a business transfer or merger" />
            </ListItem>
            <ListItem>
              <ListItemText primary="With your explicit consent" />
            </ListItem>
          </List>
        </Paper>

        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            4. Data Security
          </Typography>
          <Typography variant="body1" paragraph>
            We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
          </Typography>
          
          <List>
            <ListItem>
              <ListItemText primary="Encryption of sensitive data in transit and at rest" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Regular security assessments and updates" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Access controls and authentication mechanisms" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Employee training on data protection practices" />
            </ListItem>
          </List>
        </Paper>

        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            5. Your Rights and Choices
          </Typography>
          <Typography variant="body1" paragraph>
            You have certain rights regarding your personal information:
          </Typography>
          
          <List>
            <ListItem>
              <ListItemText primary="Access and update your personal information" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Request deletion of your account and data" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Opt-out of marketing communications" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Request data portability" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Object to certain processing activities" />
            </ListItem>
          </List>
        </Paper>

        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            6. Cookies and Tracking Technologies
          </Typography>
          <Typography variant="body1" paragraph>
            We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content. You can control cookie settings through your browser preferences.
          </Typography>
        </Paper>

        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            7. Children's Privacy
          </Typography>
          <Typography variant="body1" paragraph>
            Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it promptly.
          </Typography>
        </Paper>

        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            8. Changes to This Policy
          </Typography>
          <Typography variant="body1" paragraph>
            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of our services after such changes constitutes acceptance of the updated policy.
          </Typography>
        </Paper>

        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            9. Contact Us
          </Typography>
          <Typography variant="body1" paragraph>
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">
              <strong>Email:</strong> privacy@Kontainar-store.com
            </Typography>
            <Typography variant="body1">
              <strong>Phone:</strong> +1 (555) 123-4567
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


