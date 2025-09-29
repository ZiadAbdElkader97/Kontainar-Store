// Coupons API Service
class CouponsService {
  constructor() {
    this.storageKey = 'coupons';
    this.initializeDefaultCoupons();
  }

  // Initialize default coupons if none exist
  initializeDefaultCoupons() {
    const existingCoupons = this.getAllCoupons();
    if (existingCoupons.length === 0) {
      const defaultCoupons = [
        {
          id: '1',
          code: 'WELCOME10',
          name: 'Welcome Discount',
          description: '10% off for new customers',
          type: 'percentage', // percentage or fixed
          value: 10,
          minimumAmount: 50,
          maximumDiscount: 100,
          usageLimit: 100,
          usedCount: 0,
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
          status: 'active',
          applicableProducts: [], // empty means all products
          applicableCategories: [], // empty means all categories
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          code: 'SAVE20',
          name: 'Summer Sale',
          description: '$20 off on orders above $100',
          type: 'fixed',
          value: 20,
          minimumAmount: 100,
          maximumDiscount: 20,
          usageLimit: 50,
          usedCount: 5,
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 15 days from now
          status: 'active',
          applicableProducts: [],
          applicableCategories: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          code: 'INACTIVE',
          name: 'Inactive Coupon',
          description: 'This coupon is currently inactive',
          type: 'percentage',
          value: 20,
          minimumAmount: 30,
          maximumDiscount: 60,
          usageLimit: 15,
          usedCount: 3,
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 20 days from now
          status: 'inactive',
          applicableProducts: [],
          applicableCategories: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '4',
          code: 'EXPIRED',
          name: 'Expired Coupon',
          description: 'This coupon has expired',
          type: 'percentage',
          value: 15,
          minimumAmount: 25,
          maximumDiscount: 50,
          usageLimit: 25,
          usedCount: 5,
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
          endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // yesterday
          status: 'expired',
          applicableProducts: [],
          applicableCategories: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      localStorage.setItem(this.storageKey, JSON.stringify(defaultCoupons));
    }
  }

  // Get all coupons
  getAllCoupons() {
    try {
      const coupons = localStorage.getItem(this.storageKey);
      return coupons ? JSON.parse(coupons) : [];
    } catch (error) {
      console.error('Error getting coupons:', error);
      return [];
    }
  }

  // Get coupon by ID
  getCouponById(id) {
    try {
      const coupons = this.getAllCoupons();
      return coupons.find((coupon) => coupon.id === id);
    } catch (error) {
      console.error('Error getting coupon by ID:', error);
      return null;
    }
  }

  // Get coupon by code
  getCouponByCode(code) {
    try {
      const coupons = this.getAllCoupons();
      return coupons.find((coupon) => coupon.code.toLowerCase() === code.toLowerCase());
    } catch (error) {
      console.error('Error getting coupon by code:', error);
      return null;
    }
  }

  // Create new coupon
  createCoupon(couponData) {
    try {
      const coupons = this.getAllCoupons();

      // Check if code already exists
      const existingCoupon = this.getCouponByCode(couponData.code);
      if (existingCoupon) {
        throw new Error('Coupon code already exists');
      }

      const newCoupon = {
        id: Date.now().toString(),
        ...couponData,
        usedCount: 0,
        status: couponData.status || 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Auto-set status based on dates
      this.updateCouponStatus(newCoupon);

      coupons.push(newCoupon);
      localStorage.setItem(this.storageKey, JSON.stringify(coupons));
      return newCoupon;
    } catch (error) {
      console.error('Error creating coupon:', error);
      throw error;
    }
  }

  // Update coupon
  updateCoupon(id, couponData) {
    try {
      const coupons = this.getAllCoupons();
      const couponIndex = coupons.findIndex((coupon) => coupon.id === id);

      if (couponIndex === -1) {
        throw new Error('Coupon not found');
      }

      // Check if code already exists (excluding current coupon)
      if (couponData.code) {
        const existingCoupon = this.getCouponByCode(couponData.code);
        if (existingCoupon && existingCoupon.id !== id) {
          throw new Error('Coupon code already exists');
        }
      }

      const updatedCoupon = {
        ...coupons[couponIndex],
        ...couponData,
        updatedAt: new Date().toISOString(),
      };

      // Auto-set status based on dates
      this.updateCouponStatus(updatedCoupon);

      coupons[couponIndex] = updatedCoupon;
      localStorage.setItem(this.storageKey, JSON.stringify(coupons));
      return coupons[couponIndex];
    } catch (error) {
      console.error('Error updating coupon:', error);
      throw error;
    }
  }

  // Delete coupon (soft delete)
  deleteCoupon(id) {
    try {
      const coupons = this.getAllCoupons();
      const couponIndex = coupons.findIndex((coupon) => coupon.id === id);

      if (couponIndex === -1) {
        throw new Error('Coupon not found');
      }

      coupons[couponIndex] = {
        ...coupons[couponIndex],
        status: 'deleted',
        deletedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(coupons));
      return true;
    } catch (error) {
      console.error('Error deleting coupon:', error);
      throw error;
    }
  }

  // Permanently delete coupon
  permanentDeleteCoupon(id) {
    try {
      const coupons = this.getAllCoupons();
      const filteredCoupons = coupons.filter((coupon) => coupon.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(filteredCoupons));
      return true;
    } catch (error) {
      console.error('Error permanently deleting coupon:', error);
      throw error;
    }
  }

  // Restore deleted coupon
  restoreCoupon(id) {
    try {
      const coupons = this.getAllCoupons();
      const couponIndex = coupons.findIndex((coupon) => coupon.id === id);

      if (couponIndex === -1) {
        throw new Error('Coupon not found');
      }

      const restoredCoupon = {
        ...coupons[couponIndex],
        status: 'active',
        deletedAt: null,
        updatedAt: new Date().toISOString(),
      };

      // Auto-set status based on dates
      this.updateCouponStatus(restoredCoupon);

      coupons[couponIndex] = restoredCoupon;
      localStorage.setItem(this.storageKey, JSON.stringify(coupons));
      return coupons[couponIndex];
    } catch (error) {
      console.error('Error restoring coupon:', error);
      throw error;
    }
  }

  // Update coupon status based on dates and usage
  updateCouponStatus(coupon) {
    const now = new Date();
    const startDate = new Date(coupon.startDate);
    const endDate = new Date(coupon.endDate);

    if (now < startDate) {
      coupon.status = 'scheduled';
    } else if (now > endDate) {
      coupon.status = 'expired';
    } else if (coupon.status === 'deleted') {
      // Keep deleted status
    } else if (coupon.status === 'inactive') {
      // Keep inactive status
    } else {
      coupon.status = 'active';
    }
  }

  // Use coupon (increment usage count)
  useCoupon(code) {
    try {
      const coupon = this.getCouponByCode(code);
      if (!coupon) {
        throw new Error('Coupon not found');
      }

      if (coupon.status !== 'active') {
        throw new Error('Coupon is not active');
      }

      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        throw new Error('Coupon usage limit exceeded');
      }

      const updatedCoupon = {
        ...coupon,
        usedCount: coupon.usedCount + 1,
        updatedAt: new Date().toISOString(),
      };

      return this.updateCoupon(coupon.id, updatedCoupon);
    } catch (error) {
      console.error('Error using coupon:', error);
      throw error;
    }
  }

  // Search coupons
  searchCoupons(query) {
    try {
      const coupons = this.getAllCoupons();
      const activeCoupons = coupons.filter((coupon) => coupon.status !== 'deleted');

      if (!query) return activeCoupons;

      const lowercaseQuery = query.toLowerCase();
      return activeCoupons.filter(
        (coupon) =>
          coupon.code.toLowerCase().includes(lowercaseQuery) ||
          coupon.name.toLowerCase().includes(lowercaseQuery) ||
          coupon.description.toLowerCase().includes(lowercaseQuery),
      );
    } catch (error) {
      console.error('Error searching coupons:', error);
      return [];
    }
  }

  // Get coupons by status
  getCouponsByStatus(status) {
    try {
      const coupons = this.getAllCoupons();
      return coupons.filter((coupon) => coupon.status === status);
    } catch (error) {
      console.error('Error getting coupons by status:', error);
      return [];
    }
  }

  // Get deleted coupons
  getDeletedCoupons() {
    return this.getCouponsByStatus('deleted');
  }

  // Toggle coupon status
  toggleCouponStatus(id) {
    try {
      const coupon = this.getCouponById(id);
      if (!coupon) {
        throw new Error('Coupon not found');
      }

      const newStatus = coupon.status === 'active' ? 'inactive' : 'active';
      return this.updateCoupon(id, { status: newStatus });
    } catch (error) {
      console.error('Error toggling coupon status:', error);
      throw error;
    }
  }

  // Get coupons statistics
  getCouponsStats() {
    try {
      const coupons = this.getAllCoupons();
      const activeCoupons = coupons.filter((coupon) => coupon.status === 'active');
      const inactiveCoupons = coupons.filter((coupon) => coupon.status === 'inactive');
      const scheduledCoupons = coupons.filter((coupon) => coupon.status === 'scheduled');
      const expiredCoupons = coupons.filter((coupon) => coupon.status === 'expired');
      const deletedCoupons = coupons.filter((coupon) => coupon.status === 'deleted');

      return {
        total: coupons.length,
        active: activeCoupons.length,
        inactive: inactiveCoupons.length,
        scheduled: scheduledCoupons.length,
        expired: expiredCoupons.length,
        deleted: deletedCoupons.length,
      };
    } catch (error) {
      console.error('Error getting coupons stats:', error);
      return {
        total: 0,
        active: 0,
        inactive: 0,
        scheduled: 0,
        expired: 0,
        deleted: 0,
      };
    }
  }

  // Generate unique coupon code
  generateCouponCode(prefix = 'COUPON', length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = prefix;

    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Check if code already exists
    if (this.getCouponByCode(result)) {
      return this.generateCouponCode(prefix, length);
    }

    return result;
  }
}

// Create service instance
const couponsService = new CouponsService();

// Export individual methods
export const getAllCoupons = () => couponsService.getAllCoupons();
export const getCouponById = (id) => couponsService.getCouponById(id);
export const getCouponByCode = (code) => couponsService.getCouponByCode(code);
export const createCoupon = (couponData) => couponsService.createCoupon(couponData);
export const updateCoupon = (id, couponData) => couponsService.updateCoupon(id, couponData);
export const deleteCoupon = (id) => couponsService.deleteCoupon(id);
export const permanentDeleteCoupon = (id) => couponsService.permanentDeleteCoupon(id);
export const restoreCoupon = (id) => couponsService.restoreCoupon(id);
export const useCoupon = (code) => couponsService.useCoupon(code);
export const searchCoupons = (query) => couponsService.searchCoupons(query);
export const getCouponsByStatus = (status) => couponsService.getCouponsByStatus(status);
export const getDeletedCoupons = () => couponsService.getDeletedCoupons();
export const toggleCouponStatus = (id) => couponsService.toggleCouponStatus(id);
export const getCouponsStats = () => couponsService.getCouponsStats();
export const generateCouponCode = (prefix, length) =>
  couponsService.generateCouponCode(prefix, length);

// MSW Handlers for API compatibility
export const CouponHandlers = [];
