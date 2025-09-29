// Reviews API Service
class ReviewsService {
  constructor() {
    this.storageKey = 'reviews';
    this.initializeDefaultReviews();
  }

  // Initialize default reviews if none exist
  initializeDefaultReviews() {
    const existingReviews = this.getAllReviews();
    if (existingReviews.length === 0) {
      const defaultReviews = [
        {
          id: '1',
          customerName: 'Ahmed Mohamed',
          customerEmail: 'ahmed@example.com',
          productId: '1',
          productName: 'iPhone 15 Pro',
          rating: 5,
          title: 'Excellent Product!',
          comment: 'This is an amazing product. Highly recommended!',
          status: 'approved',
          verified: true,
          helpful: 12,
          notHelpful: 2,
          images: [],
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          customerName: 'Sara Ali',
          customerEmail: 'sara@example.com',
          productId: '2',
          productName: 'Samsung Galaxy S24',
          rating: 4,
          title: 'Good but could be better',
          comment: 'The product is good overall, but the battery life could be improved.',
          status: 'approved',
          verified: true,
          helpful: 8,
          notHelpful: 1,
          images: [],
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          customerName: 'Mohamed Hassan',
          customerEmail: 'mohamed@example.com',
          productId: '3',
          productName: 'MacBook Pro M3',
          rating: 5,
          title: 'Perfect for work!',
          comment: 'Amazing performance and build quality. Worth every penny.',
          status: 'pending',
          verified: false,
          helpful: 0,
          notHelpful: 0,
          images: [],
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '4',
          customerName: 'Fatma Ibrahim',
          customerEmail: 'fatma@example.com',
          productId: '4',
          productName: 'iPad Air',
          rating: 3,
          title: 'Average product',
          comment: 'It works fine but nothing special. Expected more for the price.',
          status: 'approved',
          verified: true,
          helpful: 5,
          notHelpful: 3,
          images: [],
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
          updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '5',
          customerName: 'Omar Khaled',
          customerEmail: 'omar@example.com',
          productId: '5',
          productName: 'AirPods Pro',
          rating: 2,
          title: 'Not worth the money',
          comment: 'Sound quality is poor and the battery drains quickly. Very disappointed.',
          status: 'rejected',
          verified: false,
          helpful: 2,
          notHelpful: 8,
          images: [],
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
          updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '6',
          customerName: 'Nour El-Din',
          customerEmail: 'nour@example.com',
          productId: '1',
          productName: 'iPhone 15 Pro',
          rating: 5,
          title: 'Best phone ever!',
          comment: 'Love everything about this phone. Camera is incredible!',
          status: 'approved',
          verified: true,
          helpful: 15,
          notHelpful: 0,
          images: [],
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];

      localStorage.setItem(this.storageKey, JSON.stringify(defaultReviews));
    }
  }

  // Get all reviews
  getAllReviews() {
    try {
      const reviews = localStorage.getItem(this.storageKey);
      return reviews ? JSON.parse(reviews) : [];
    } catch (error) {
      console.error('Error getting reviews:', error);
      return [];
    }
  }

  // Get review by ID
  getReviewById(id) {
    try {
      const reviews = this.getAllReviews();
      return reviews.find((review) => review.id === id);
    } catch (error) {
      console.error('Error getting review by ID:', error);
      return null;
    }
  }

  // Get reviews by product ID
  getReviewsByProductId(productId) {
    try {
      const reviews = this.getAllReviews();
      return reviews.filter((review) => review.productId === productId);
    } catch (error) {
      console.error('Error getting reviews by product ID:', error);
      return [];
    }
  }

  // Get reviews by status
  getReviewsByStatus(status) {
    try {
      const reviews = this.getAllReviews();
      return reviews.filter((review) => review.status === status);
    } catch (error) {
      console.error('Error getting reviews by status:', error);
      return [];
    }
  }

  // Create new review
  createReview(reviewData) {
    try {
      const reviews = this.getAllReviews();

      const newReview = {
        id: Date.now().toString(),
        ...reviewData,
        status: reviewData.status || 'pending',
        verified: reviewData.verified || false,
        helpful: 0,
        notHelpful: 0,
        images: reviewData.images || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      reviews.push(newReview);
      localStorage.setItem(this.storageKey, JSON.stringify(reviews));
      return newReview;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  // Update review
  updateReview(id, reviewData) {
    try {
      const reviews = this.getAllReviews();
      const reviewIndex = reviews.findIndex((review) => review.id === id);

      if (reviewIndex === -1) {
        throw new Error('Review not found');
      }

      const updatedReview = {
        ...reviews[reviewIndex],
        ...reviewData,
        updatedAt: new Date().toISOString(),
      };

      reviews[reviewIndex] = updatedReview;
      localStorage.setItem(this.storageKey, JSON.stringify(updatedReview));
      return reviews[reviewIndex];
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  }

  // Delete review (soft delete)
  deleteReview(id) {
    try {
      const reviews = this.getAllReviews();
      const reviewIndex = reviews.findIndex((review) => review.id === id);

      if (reviewIndex === -1) {
        throw new Error('Review not found');
      }

      reviews[reviewIndex] = {
        ...reviews[reviewIndex],
        status: 'deleted',
        deletedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(reviews));
      return true;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }

  // Permanently delete review
  permanentDeleteReview(id) {
    try {
      const reviews = this.getAllReviews();
      const filteredReviews = reviews.filter((review) => review.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(filteredReviews));
      return true;
    } catch (error) {
      console.error('Error permanently deleting review:', error);
      throw error;
    }
  }

  // Restore deleted review
  restoreReview(id) {
    try {
      const reviews = this.getAllReviews();
      const reviewIndex = reviews.findIndex((review) => review.id === id);

      if (reviewIndex === -1) {
        throw new Error('Review not found');
      }

      const restoredReview = {
        ...reviews[reviewIndex],
        status: 'pending',
        deletedAt: null,
        updatedAt: new Date().toISOString(),
      };

      reviews[reviewIndex] = restoredReview;
      localStorage.setItem(this.storageKey, JSON.stringify(reviews));
      return reviews[reviewIndex];
    } catch (error) {
      console.error('Error restoring review:', error);
      throw error;
    }
  }

  // Update review status
  updateReviewStatus(id, status) {
    try {
      const reviews = this.getAllReviews();
      const reviewIndex = reviews.findIndex((review) => review.id === id);

      if (reviewIndex === -1) {
        throw new Error('Review not found');
      }

      const updatedReview = {
        ...reviews[reviewIndex],
        status: status,
        updatedAt: new Date().toISOString(),
      };

      reviews[reviewIndex] = updatedReview;
      localStorage.setItem(this.storageKey, JSON.stringify(reviews));
      return reviews[reviewIndex];
    } catch (error) {
      console.error('Error updating review status:', error);
      throw error;
    }
  }

  // Toggle review verification
  toggleReviewVerification(id) {
    try {
      const reviews = this.getAllReviews();
      const reviewIndex = reviews.findIndex((review) => review.id === id);

      if (reviewIndex === -1) {
        throw new Error('Review not found');
      }

      const updatedReview = {
        ...reviews[reviewIndex],
        verified: !reviews[reviewIndex].verified,
        updatedAt: new Date().toISOString(),
      };

      reviews[reviewIndex] = updatedReview;
      localStorage.setItem(this.storageKey, JSON.stringify(reviews));
      return reviews[reviewIndex];
    } catch (error) {
      console.error('Error toggling review verification:', error);
      throw error;
    }
  }

  // Update helpful votes
  updateHelpfulVotes(id, isHelpful) {
    try {
      const reviews = this.getAllReviews();
      const reviewIndex = reviews.findIndex((review) => review.id === id);

      if (reviewIndex === -1) {
        throw new Error('Review not found');
      }

      const updatedReview = {
        ...reviews[reviewIndex],
        helpful: isHelpful ? reviews[reviewIndex].helpful + 1 : reviews[reviewIndex].helpful,
        notHelpful: !isHelpful ? reviews[reviewIndex].notHelpful + 1 : reviews[reviewIndex].notHelpful,
        updatedAt: new Date().toISOString(),
      };

      reviews[reviewIndex] = updatedReview;
      localStorage.setItem(this.storageKey, JSON.stringify(reviews));
      return reviews[reviewIndex];
    } catch (error) {
      console.error('Error updating helpful votes:', error);
      throw error;
    }
  }

  // Search reviews
  searchReviews(query) {
    try {
      const reviews = this.getAllReviews();
      const activeReviews = reviews.filter((review) => review.status !== 'deleted');
      
      if (!query) return activeReviews;

      const lowercaseQuery = query.toLowerCase();
      return activeReviews.filter(
        (review) =>
          review.customerName.toLowerCase().includes(lowercaseQuery) ||
          review.customerEmail.toLowerCase().includes(lowercaseQuery) ||
          review.productName.toLowerCase().includes(lowercaseQuery) ||
          review.title.toLowerCase().includes(lowercaseQuery) ||
          review.comment.toLowerCase().includes(lowercaseQuery)
      );
    } catch (error) {
      console.error('Error searching reviews:', error);
      return [];
    }
  }

  // Get deleted reviews
  getDeletedReviews() {
    return this.getReviewsByStatus('deleted');
  }

  // Get reviews statistics
  getReviewsStats() {
    try {
      const reviews = this.getAllReviews();
      const approvedReviews = reviews.filter((review) => review.status === 'approved');
      const pendingReviews = reviews.filter((review) => review.status === 'pending');
      const rejectedReviews = reviews.filter((review) => review.status === 'rejected');
      const deletedReviews = reviews.filter((review) => review.status === 'deleted');

      // Calculate average rating
      const approvedRatings = approvedReviews.map((review) => review.rating);
      const averageRating = approvedRatings.length > 0 
        ? (approvedRatings.reduce((sum, rating) => sum + rating, 0) / approvedRatings.length).toFixed(1)
        : 0;

      // Rating distribution
      const ratingDistribution = {
        5: approvedReviews.filter((review) => review.rating === 5).length,
        4: approvedReviews.filter((review) => review.rating === 4).length,
        3: approvedReviews.filter((review) => review.rating === 3).length,
        2: approvedReviews.filter((review) => review.rating === 2).length,
        1: approvedReviews.filter((review) => review.rating === 1).length,
      };

      return {
        total: reviews.length,
        approved: approvedReviews.length,
        pending: pendingReviews.length,
        rejected: rejectedReviews.length,
        deleted: deletedReviews.length,
        averageRating: parseFloat(averageRating),
        ratingDistribution,
        verified: approvedReviews.filter((review) => review.verified).length,
      };
    } catch (error) {
      console.error('Error getting reviews stats:', error);
      return {
        total: 0,
        approved: 0,
        pending: 0,
        rejected: 0,
        deleted: 0,
        averageRating: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        verified: 0,
      };
    }
  }
}

// Create service instance
const reviewsService = new ReviewsService();

// Export individual methods
export const getAllReviews = () => reviewsService.getAllReviews();
export const getReviewById = (id) => reviewsService.getReviewById(id);
export const getReviewsByProductId = (productId) => reviewsService.getReviewsByProductId(productId);
export const getReviewsByStatus = (status) => reviewsService.getReviewsByStatus(status);
export const createReview = (reviewData) => reviewsService.createReview(reviewData);
export const updateReview = (id, reviewData) => reviewsService.updateReview(id, reviewData);
export const deleteReview = (id) => reviewsService.deleteReview(id);
export const permanentDeleteReview = (id) => reviewsService.permanentDeleteReview(id);
export const restoreReview = (id) => reviewsService.restoreReview(id);
export const updateReviewStatus = (id, status) => reviewsService.updateReviewStatus(id, status);
export const toggleReviewVerification = (id) => reviewsService.toggleReviewVerification(id);
export const updateHelpfulVotes = (id, isHelpful) => reviewsService.updateHelpfulVotes(id, isHelpful);
export const searchReviews = (query) => reviewsService.searchReviews(query);
export const getDeletedReviews = () => reviewsService.getDeletedReviews();
export const getReviewsStats = () => reviewsService.getReviewsStats();

// MSW Handlers for API compatibility
export const ReviewHandlers = [];
