import React, { useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Box,
  Stack,
  Chip,
  Avatar,
  Divider,
  Alert,
  Paper,
  IconButton,
  Badge,
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  LocalOffer as LocalOfferIcon,
  TrendingUp as TrendingUpIcon,
  Notifications as NotificationsIcon,
  NotificationsOff as NotificationsOffIcon,
  CalendarToday as CalendarIcon,
  ShoppingCart as ShoppingCartIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';
import PageContainer from 'src/components/container/PageContainer';
import HeaderAlert from 'src/components/frontend-pages/shared/header/HeaderAlert';
import HpHeader from 'src/components/frontend-pages/shared/header/HpHeader';
import Footer from 'src/components/frontend-pages/shared/footer';
import ScrollToTop from 'src/components/frontend-pages/shared/scroll-to-top';
import Banner from 'src/components/frontend-pages/upcoming-offers/banner';

// Mock data for upcoming offers
const upcomingOffers = [
  {
    id: 1,
    title: 'Black Friday Mega Sale',
    description:
      'Get up to 70% off on electronics, fashion, and home appliances. Limited time offer!',
    discount: '70%',
    category: 'Electronics',
    startDate: '2024-11-24',
    endDate: '2024-11-30',
    image: '/src/assets/images/offers/electronics-sale.svg',
    isWishlisted: false,
    isNotified: true,
    originalPrice: 999,
    salePrice: 299,
    brand: 'TechStore',
    rating: 4.8,
    reviews: 1250,
  },
  {
    id: 2,
    title: 'Cyber Monday Deals',
    description: "Exclusive deals on laptops, smartphones, and gaming accessories. Don't miss out!",
    discount: '50%',
    category: 'Gaming',
    startDate: '2024-11-25',
    endDate: '2024-11-26',
    image: '/src/assets/images/offers/electronics-sale.svg',
    isWishlisted: true,
    isNotified: false,
    originalPrice: 1599,
    salePrice: 799,
    brand: 'GameZone',
    rating: 4.9,
    reviews: 890,
  },
  {
    id: 3,
    title: 'Holiday Fashion Sale',
    description: 'Winter collection with amazing discounts on clothing, shoes, and accessories.',
    discount: '40%',
    category: 'Fashion',
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    image: '/src/assets/images/offers/fashion-sale.svg',
    isWishlisted: false,
    isNotified: true,
    originalPrice: 299,
    salePrice: 179,
    brand: 'FashionHub',
    rating: 4.6,
    reviews: 2100,
  },
  {
    id: 4,
    title: 'New Year Home Sale',
    description:
      'Transform your home with our furniture and decor collection at unbeatable prices.',
    discount: '60%',
    category: 'Home & Garden',
    startDate: '2024-12-15',
    endDate: '2025-01-15',
    image: '/src/assets/images/offers/home-decor.svg',
    isWishlisted: true,
    isNotified: true,
    originalPrice: 799,
    salePrice: 319,
    brand: 'HomeDecor',
    rating: 4.7,
    reviews: 1560,
  },
  {
    id: 5,
    title: "Valentine's Day Special",
    description: "Romantic gifts and jewelry collection with special Valentine's Day discounts.",
    discount: '35%',
    category: 'Jewelry',
    startDate: '2025-02-01',
    endDate: '2025-02-14',
    image: '/src/assets/images/offers/beauty-sale.svg',
    isWishlisted: false,
    isNotified: false,
    originalPrice: 499,
    salePrice: 324,
    brand: 'LoveGems',
    rating: 4.9,
    reviews: 750,
  },
  {
    id: 6,
    title: 'Spring Clearance Sale',
    description: 'Clear out winter inventory with massive discounts on seasonal items.',
    discount: '55%',
    category: 'Seasonal',
    startDate: '2025-03-01',
    endDate: '2025-03-31',
    image: '/src/assets/images/offers/sports-sale.svg',
    isWishlisted: true,
    isNotified: true,
    originalPrice: 199,
    salePrice: 89,
    brand: 'SeasonStore',
    rating: 4.5,
    reviews: 980,
  },
  {
    id: 7,
    title: 'Books & Literature Sale',
    description: 'Huge collection of books at amazing prices for book lovers.',
    discount: '40%',
    category: 'Books',
    startDate: '2025-04-01',
    endDate: '2025-04-30',
    image: '/src/assets/images/offers/books-sale.svg',
    isWishlisted: false,
    isNotified: true,
    originalPrice: 49,
    salePrice: 29,
    brand: 'BookWorld',
    rating: 4.8,
    reviews: 1200,
  },
  {
    id: 8,
    title: 'Kitchen & Cooking Essentials',
    description: 'Professional kitchen tools and appliances for cooking enthusiasts.',
    discount: '45%',
    category: 'Kitchen',
    startDate: '2025-05-01',
    endDate: '2025-05-31',
    image: '/src/assets/images/offers/kitchen-sale.svg',
    isWishlisted: true,
    isNotified: false,
    originalPrice: 399,
    salePrice: 219,
    brand: 'ChefTools',
    rating: 4.7,
    reviews: 850,
  },
  {
    id: 9,
    title: 'Toys & Games Collection',
    description: 'Fun toys and games for all ages with special discounts.',
    discount: '60%',
    category: 'Toys',
    startDate: '2025-06-01',
    endDate: '2025-06-30',
    image: '/src/assets/images/offers/toys-sale.svg',
    isWishlisted: false,
    isNotified: true,
    originalPrice: 79,
    salePrice: 31,
    brand: 'ToyLand',
    rating: 4.6,
    reviews: 1100,
  },
];

const categories = [
  'All',
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Gaming',
  'Jewelry',
  'Seasonal',
];

export default function UpcomingOffers() {
  const [offers, setOffers] = useState(upcomingOffers);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('startDate');

  const handleWishlistToggle = (offerId) => {
    setOffers(
      offers.map((offer) =>
        offer.id === offerId ? { ...offer, isWishlisted: !offer.isWishlisted } : offer,
      ),
    );
  };

  const handleNotificationToggle = (offerId) => {
    setOffers(
      offers.map((offer) =>
        offer.id === offerId ? { ...offer, isNotified: !offer.isNotified } : offer,
      ),
    );
  };

  const filteredOffers = offers.filter(
    (offer) => selectedCategory === 'All' || offer.category === selectedCategory,
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDaysUntilStart = (startDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const diffTime = start - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <PageContainer title="Upcoming Offers" description="Discover amazing deals coming soon">
      <HeaderAlert />
      <HpHeader />
      <Banner />

      <Container maxWidth="lg" sx={{ mt: 5, mb: 8 }}>
        {/* Info Alert */}
        <Box textAlign="center" sx={{ mb: 6 }}>
          <Alert severity="info" sx={{ maxWidth: 600, mx: 'auto' }}>
            <Typography variant="body2">
              <strong>Pro Tip:</strong> Turn on notifications to get alerts when these offers go
              live!
            </Typography>
          </Alert>
        </Box>

        {/* Category Filter */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Filter by Category
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() => setSelectedCategory(category)}
                color={selectedCategory === category ? 'primary' : 'default'}
                variant={selectedCategory === category ? 'filled' : 'outlined'}
                sx={{ mb: 1 }}
              />
            ))}
          </Stack>
        </Box>

        {/* Offers Grid */}
        <Grid container spacing={4} id="offers-grid">
          {filteredOffers.map((offer) => {
            const daysUntilStart = getDaysUntilStart(offer.startDate);
            const isStartingSoon = daysUntilStart <= 7 && daysUntilStart > 0;

            return (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={offer.id}>
                <Card
                  sx={{
                    height: '100%',
                    position: 'relative',
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: (theme) => (theme.palette.mode === 'dark' ? 4 : 2),
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  {/* Discount Badge */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      zIndex: 1,
                    }}
                  >
                    <Chip
                      label={`${offer.discount} OFF`}
                      color="error"
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>

                  {/* Wishlist Button */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      zIndex: 1,
                    }}
                  >
                    <IconButton
                      onClick={() => handleWishlistToggle(offer.id)}
                      color={offer.isWishlisted ? 'error' : 'default'}
                    >
                      {offer.isWishlisted ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>
                  </Box>

                  {/* Notification Button */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 56,
                      right: 16,
                      zIndex: 1,
                    }}
                  >
                    <IconButton
                      onClick={() => handleNotificationToggle(offer.id)}
                      color={offer.isNotified ? 'primary' : 'default'}
                    >
                      <Badge color="error" variant="dot" invisible={!offer.isNotified}>
                        {offer.isNotified ? <NotificationsIcon /> : <NotificationsOffIcon />}
                      </Badge>
                    </IconButton>
                  </Box>

                  <CardContent sx={{ p: 0 }}>
                    {/* Product Image */}
                    <Box
                      sx={{
                        height: 200,
                        backgroundImage: `url(${offer.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                      }}
                    >
                      {/* Days Until Start Overlay */}
                      {isStartingSoon && (
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 8,
                            left: 8,
                            bgcolor: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            px: 2,
                            py: 1,
                            borderRadius: 1,
                          }}
                        >
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <AccessTimeIcon fontSize="small" />
                            <Typography variant="caption">
                              {daysUntilStart === 1
                                ? 'Starts Tomorrow'
                                : `Starts in ${daysUntilStart} days`}
                            </Typography>
                          </Stack>
                        </Box>
                      )}
                    </Box>

                    <Box sx={{ p: 3 }}>
                      {/* Category */}
                      <Chip label={offer.category} size="small" color="secondary" sx={{ mb: 2 }} />

                      {/* Title */}
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {offer.title}
                      </Typography>

                      {/* Description */}
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {offer.description}
                      </Typography>

                      {/* Brand and Rating */}
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 2 }}
                      >
                        <Typography variant="body2" fontWeight={600}>
                          {offer.brand}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <StarIcon fontSize="small" color="warning" />
                          <Typography variant="body2">
                            {offer.rating} ({offer.reviews})
                          </Typography>
                        </Stack>
                      </Stack>

                      {/* Price */}
                      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                        <Typography variant="h6" color="error" fontWeight={600}>
                          ${offer.salePrice}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textDecoration: 'line-through' }}
                        >
                          ${offer.originalPrice}
                        </Typography>
                      </Stack>

                      {/* Date Range */}
                      <Paper
                        sx={{
                          p: 2,
                          bgcolor: 'background.default',
                          border: '1px solid',
                          borderColor: 'divider',
                          mb: 2,
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                          <CalendarIcon fontSize="small" color="primary" />
                          <Typography variant="body2" fontWeight={600}>
                            Sale Period
                          </Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(offer.startDate)} - {formatDate(offer.endDate)}
                        </Typography>
                      </Paper>

                      {/* Action Buttons */}
                      <Stack direction="row" spacing={2}>
                        <Button
                          variant="contained"
                          fullWidth
                          startIcon={<ShoppingCartIcon />}
                          disabled={daysUntilStart > 0}
                        >
                          {daysUntilStart > 0 ? 'Coming Soon' : 'Shop Now'}
                        </Button>
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* No Results */}
        {filteredOffers.length === 0 && (
          <Box textAlign="center" sx={{ py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No offers found for the selected category.
            </Typography>
          </Box>
        )}

        {/* Newsletter Signup */}
        <Box sx={{ mt: 8 }}>
          <Paper
            sx={{
              p: 4,
              textAlign: 'center',
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Never Miss a Deal!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Subscribe to our newsletter and be the first to know about upcoming offers and
              exclusive deals.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<NotificationsIcon />}
              sx={{ px: 4 }}
            >
              Subscribe to Notifications
            </Button>
          </Paper>
        </Box>
      </Container>

      <Footer />
      <ScrollToTop />
    </PageContainer>
  );
}


