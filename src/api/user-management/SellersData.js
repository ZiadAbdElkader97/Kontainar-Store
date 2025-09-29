class SellersService {
  constructor() {
    this.storageKey = 'sellers';
    this.initializeDefaultSellers();
  }

  // Initialize default sellers
  initializeDefaultSellers() {
    const existingSellers = localStorage.getItem(this.storageKey);
    if (!existingSellers) {
      const defaultSellers = [
        {
          id: '1',
          firstName: 'Ahmed',
          lastName: 'Hassan',
          email: 'ahmed.hassan@seller.com',
          phone: '+201234567890',
          dateOfBirth: '1985-03-15',
          gender: 'male',
          address: {
            street: '123 Main Street',
            city: 'Cairo',
            state: 'Cairo',
            country: 'Egypt',
            zipCode: '11511',
          },
          sellerId: 'SELL001',
          businessName: 'Hassan Electronics',
          businessType: 'electronics',
          businessLicense: 'BL123456',
          taxId: 'TAX123456789',
          commissionRate: 15,
          status: 'active',
          verificationStatus: 'verified',
          joinDate: '2020-01-15',
          lastLogin: '2024-01-10',
          totalSales: 150000,
          totalOrders: 250,
          rating: 4.8,
          totalReviews: 120,
          bankAccount: {
            bankName: 'National Bank of Egypt',
            accountNumber: '1234567890',
            accountHolderName: 'Ahmed Hassan',
          },
          paymentMethod: 'bank_transfer',
          storeSettings: {
            storeName: 'Hassan Electronics Store',
            storeDescription: 'Best electronics and gadgets in Cairo',
            storeLogo: null,
            storeBanner: null,
            storeCategories: ['Electronics', 'Gadgets', 'Accessories'],
          },
          socialMedia: {
            website: 'https://hassanelectronics.com',
            facebook: 'https://facebook.com/hassanelectronics',
            instagram: 'https://instagram.com/hassanelectronics',
            twitter: 'https://twitter.com/hassanelectronics',
          },
          documents: [
            {
              type: 'business_license',
              name: 'Business License',
              url: '/documents/business_license.pdf',
              uploadedAt: '2020-01-10',
            },
            {
              type: 'tax_certificate',
              name: 'Tax Certificate',
              url: '/documents/tax_certificate.pdf',
              uploadedAt: '2020-01-12',
            },
          ],
          notes: 'Reliable seller with excellent customer service',
          tags: ['Electronics', 'Verified', 'Top Seller'],
          isSystem: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          firstName: 'Fatma',
          lastName: 'Ali',
          email: 'fatma.ali@seller.com',
          phone: '+201234567891',
          dateOfBirth: '1990-07-22',
          gender: 'female',
          address: {
            street: '456 Oak Avenue',
            city: 'Alexandria',
            state: 'Alexandria',
            country: 'Egypt',
            zipCode: '21500',
          },
          sellerId: 'SELL002',
          businessName: 'Fatma Fashion',
          businessType: 'fashion',
          businessLicense: 'BL123457',
          taxId: 'TAX123456790',
          commissionRate: 12,
          status: 'active',
          verificationStatus: 'verified',
          joinDate: '2019-06-10',
          lastLogin: '2024-01-08',
          totalSales: 95000,
          totalOrders: 180,
          rating: 4.6,
          totalReviews: 95,
          bankAccount: {
            bankName: 'Commercial International Bank',
            accountNumber: '0987654321',
            accountHolderName: 'Fatma Ali',
          },
          paymentMethod: 'bank_transfer',
          storeSettings: {
            storeName: 'Fatma Fashion Boutique',
            storeDescription: 'Trendy fashion for women',
            storeLogo: null,
            storeBanner: null,
            storeCategories: ['Women Fashion', 'Accessories', 'Shoes'],
          },
          socialMedia: {
            website: 'https://fatmafashion.com',
            facebook: 'https://facebook.com/fatmafashion',
            instagram: 'https://instagram.com/fatmafashion',
            twitter: null,
          },
          documents: [
            {
              type: 'business_license',
              name: 'Business License',
              url: '/documents/business_license_fatma.pdf',
              uploadedAt: '2019-06-05',
            },
          ],
          notes: 'Fashion expert with great taste',
          tags: ['Fashion', 'Women', 'Verified'],
          isSystem: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          firstName: 'Mohamed',
          lastName: 'Ibrahim',
          email: 'mohamed.ibrahim@seller.com',
          phone: '+201234567892',
          dateOfBirth: '1988-12-03',
          gender: 'male',
          address: {
            street: '789 Pine Road',
            city: 'Giza',
            state: 'Giza',
            country: 'Egypt',
            zipCode: '12511',
          },
          sellerId: 'SELL003',
          businessName: 'Ibrahim Home & Garden',
          businessType: 'home_garden',
          businessLicense: 'BL123458',
          taxId: 'TAX123456791',
          commissionRate: 10,
          status: 'pending',
          verificationStatus: 'pending',
          joinDate: '2023-06-20',
          lastLogin: '2023-11-15',
          totalSales: 25000,
          totalOrders: 45,
          rating: 4.2,
          totalReviews: 25,
          bankAccount: {
            bankName: 'Banque Misr',
            accountNumber: '1122334455',
            accountHolderName: 'Mohamed Ibrahim',
          },
          paymentMethod: 'bank_transfer',
          storeSettings: {
            storeName: 'Ibrahim Home & Garden',
            storeDescription: 'Everything for your home and garden',
            storeLogo: null,
            storeBanner: null,
            storeCategories: ['Home Decor', 'Garden Tools', 'Furniture'],
          },
          socialMedia: {
            website: null,
            facebook: 'https://facebook.com/ibrahimhome',
            instagram: null,
            twitter: null,
          },
          documents: [
            {
              type: 'business_license',
              name: 'Business License',
              url: '/documents/business_license_ibrahim.pdf',
              uploadedAt: '2023-06-15',
            },
          ],
          notes: 'New seller, still under review',
          tags: ['Home & Garden', 'New Seller'],
          isSystem: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '4',
          firstName: 'Nour',
          lastName: 'Mahmoud',
          email: 'nour.mahmoud@seller.com',
          phone: '+201234567893',
          dateOfBirth: '1992-04-18',
          gender: 'female',
          address: {
            street: '321 Elm Street',
            city: 'Sharm El Sheikh',
            state: 'South Sinai',
            country: 'Egypt',
            zipCode: '46619',
          },
          sellerId: 'SELL004',
          businessName: 'Nour Beauty',
          businessType: 'beauty',
          businessLicense: 'BL123459',
          taxId: 'TAX123456792',
          commissionRate: 18,
          status: 'active',
          verificationStatus: 'verified',
          joinDate: '2022-08-05',
          lastLogin: '2024-01-12',
          totalSales: 120000,
          totalOrders: 200,
          rating: 4.9,
          totalReviews: 150,
          bankAccount: {
            bankName: 'Arab African International Bank',
            accountNumber: '5566778899',
            accountHolderName: 'Nour Mahmoud',
          },
          paymentMethod: 'bank_transfer',
          storeSettings: {
            storeName: 'Nour Beauty Store',
            storeDescription: 'Premium beauty and cosmetics',
            storeLogo: null,
            storeBanner: null,
            storeCategories: ['Beauty', 'Cosmetics', 'Skincare'],
          },
          socialMedia: {
            website: 'https://nourbeauty.com',
            facebook: 'https://facebook.com/nourbeauty',
            instagram: 'https://instagram.com/nourbeauty',
            twitter: 'https://twitter.com/nourbeauty',
          },
          documents: [
            {
              type: 'business_license',
              name: 'Business License',
              url: '/documents/business_license_nour.pdf',
              uploadedAt: '2022-08-01',
            },
            {
              type: 'tax_certificate',
              name: 'Tax Certificate',
              url: '/documents/tax_certificate_nour.pdf',
              uploadedAt: '2022-08-03',
            },
          ],
          notes: 'Top-rated beauty seller with premium products',
          tags: ['Beauty', 'Premium', 'Top Seller', 'Verified'],
          isSystem: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '5',
          firstName: 'Omar',
          lastName: 'Sayed',
          email: 'omar.sayed@seller.com',
          phone: '+201234567894',
          dateOfBirth: '1995-09-30',
          gender: 'male',
          address: {
            street: '654 Maple Drive',
            city: 'Luxor',
            state: 'Luxor',
            country: 'Egypt',
            zipCode: '85951',
          },
          sellerId: 'SELL005',
          businessName: 'Sayed Sports',
          businessType: 'sports',
          businessLicense: 'BL123460',
          taxId: 'TAX123456793',
          commissionRate: 14,
          status: 'suspended',
          verificationStatus: 'verified',
          joinDate: '2023-01-01',
          lastLogin: '2023-10-15',
          totalSales: 45000,
          totalOrders: 80,
          rating: 3.8,
          totalReviews: 40,
          bankAccount: {
            bankName: 'Bank of Alexandria',
            accountNumber: '9988776655',
            accountHolderName: 'Omar Sayed',
          },
          paymentMethod: 'bank_transfer',
          storeSettings: {
            storeName: 'Sayed Sports Store',
            storeDescription: 'Sports equipment and accessories',
            storeLogo: null,
            storeBanner: null,
            storeCategories: ['Sports Equipment', 'Fitness', 'Outdoor'],
          },
          socialMedia: {
            website: null,
            facebook: 'https://facebook.com/sayedsports',
            instagram: 'https://instagram.com/sayedsports',
            twitter: null,
          },
          documents: [
            {
              type: 'business_license',
              name: 'Business License',
              url: '/documents/business_license_omar.pdf',
              uploadedAt: '2022-12-28',
            },
          ],
          notes: 'Suspended due to policy violations',
          tags: ['Sports', 'Suspended'],
          isSystem: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      localStorage.setItem(this.storageKey, JSON.stringify(defaultSellers));
    }
  }

  // Get all sellers
  getAllSellers() {
    try {
      const sellers = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      return sellers;
    } catch (error) {
      console.error('Error getting sellers:', error);
      return [];
    }
  }

  // Get active sellers only
  getActiveSellers() {
    try {
      const sellers = this.getAllSellers();
      return sellers.filter((seller) => seller.status === 'active');
    } catch (error) {
      console.error('Error getting active sellers:', error);
      return [];
    }
  }

  // Get pending sellers only
  getPendingSellers() {
    try {
      const sellers = this.getAllSellers();
      return sellers.filter((seller) => seller.status === 'pending');
    } catch (error) {
      console.error('Error getting pending sellers:', error);
      return [];
    }
  }

  // Get suspended sellers only
  getSuspendedSellers() {
    try {
      const sellers = this.getAllSellers();
      return sellers.filter((seller) => seller.status === 'suspended');
    } catch (error) {
      console.error('Error getting suspended sellers:', error);
      return [];
    }
  }

  // Get seller by ID
  getSellerById(id) {
    try {
      const sellers = this.getAllSellers();
      return sellers.find((seller) => seller.id === id);
    } catch (error) {
      console.error('Error getting seller by ID:', error);
      return null;
    }
  }

  // Get seller by email
  getSellerByEmail(email) {
    try {
      const sellers = this.getAllSellers();
      return sellers.find((seller) => seller.email === email);
    } catch (error) {
      console.error('Error getting seller by email:', error);
      return null;
    }
  }

  // Get seller by seller ID
  getSellerBySellerId(sellerId) {
    try {
      const sellers = this.getAllSellers();
      return sellers.find((seller) => seller.sellerId === sellerId);
    } catch (error) {
      console.error('Error getting seller by seller ID:', error);
      return null;
    }
  }

  // Create new seller
  createSeller(sellerData) {
    try {
      const sellers = this.getAllSellers();

      // Check if email already exists
      const existingSeller = sellers.find((seller) => seller.email === sellerData.email);
      if (existingSeller) {
        throw new Error('Seller with this email already exists');
      }

      // Check if seller ID already exists
      const existingSellerId = sellers.find((seller) => seller.sellerId === sellerData.sellerId);
      if (existingSellerId) {
        throw new Error('Seller with this seller ID already exists');
      }

      const newSeller = {
        id: Date.now().toString(),
        ...sellerData,
        status: sellerData.status || 'pending',
        verificationStatus: sellerData.verificationStatus || 'pending',
        commissionRate: sellerData.commissionRate || 10,
        totalSales: 0,
        totalOrders: 0,
        rating: 0,
        totalReviews: 0,
        lastLogin: null,
        joinDate: new Date().toISOString().split('T')[0],
        documents: sellerData.documents || [],
        tags: sellerData.tags || [],
        notes: sellerData.notes || '',
        isSystem: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      sellers.push(newSeller);
      localStorage.setItem(this.storageKey, JSON.stringify(sellers));
      return newSeller;
    } catch (error) {
      console.error('Error creating seller:', error);
      throw error;
    }
  }

  // Update seller
  updateSeller(id, sellerData) {
    try {
      const sellers = this.getAllSellers();
      const sellerIndex = sellers.findIndex((seller) => seller.id === id);

      if (sellerIndex === -1) {
        throw new Error('Seller not found');
      }

      // Check if email already exists (excluding current seller)
      if (sellerData.email && sellerData.email !== sellers[sellerIndex].email) {
        const existingSeller = sellers.find(
          (seller) => seller.email === sellerData.email && seller.id !== id,
        );
        if (existingSeller) {
          throw new Error('Seller with this email already exists');
        }
      }

      // Check if seller ID already exists (excluding current seller)
      if (sellerData.sellerId && sellerData.sellerId !== sellers[sellerIndex].sellerId) {
        const existingSellerId = sellers.find(
          (seller) => seller.sellerId === sellerData.sellerId && seller.id !== id,
        );
        if (existingSellerId) {
          throw new Error('Seller with this seller ID already exists');
        }
      }

      sellers[sellerIndex] = {
        ...sellers[sellerIndex],
        ...sellerData,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(sellers));
      return sellers[sellerIndex];
    } catch (error) {
      console.error('Error updating seller:', error);
      throw error;
    }
  }

  // Soft delete seller
  deleteSeller(id) {
    try {
      const sellers = this.getAllSellers();
      const sellerIndex = sellers.findIndex((seller) => seller.id === id);

      if (sellerIndex === -1) {
        throw new Error('Seller not found');
      }

      sellers[sellerIndex] = {
        ...sellers[sellerIndex],
        status: 'deleted',
        deletedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(sellers));
      return sellers[sellerIndex];
    } catch (error) {
      console.error('Error deleting seller:', error);
      throw error;
    }
  }

  // Restore seller
  restoreSeller(id) {
    try {
      const sellers = this.getAllSellers();
      const sellerIndex = sellers.findIndex((seller) => seller.id === id);

      if (sellerIndex === -1) {
        throw new Error('Seller not found');
      }

      sellers[sellerIndex] = {
        ...sellers[sellerIndex],
        status: 'active',
        deletedAt: null,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(sellers));
      return sellers[sellerIndex];
    } catch (error) {
      console.error('Error restoring seller:', error);
      throw error;
    }
  }

  // Permanently delete seller
  permanentDeleteSeller(id) {
    try {
      const sellers = this.getAllSellers();
      const sellerIndex = sellers.findIndex((seller) => seller.id === id);

      if (sellerIndex === -1) {
        throw new Error('Seller not found');
      }

      const filteredSellers = sellers.filter((seller) => seller.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(filteredSellers));
      return true;
    } catch (error) {
      console.error('Error permanently deleting seller:', error);
      throw error;
    }
  }

  // Search sellers
  searchSellers(query) {
    try {
      const sellers = this.getAllSellers();
      const lowercaseQuery = query.toLowerCase();

      return sellers.filter(
        (seller) =>
          seller.firstName.toLowerCase().includes(lowercaseQuery) ||
          seller.lastName.toLowerCase().includes(lowercaseQuery) ||
          seller.email.toLowerCase().includes(lowercaseQuery) ||
          seller.phone.includes(query) ||
          seller.sellerId.toLowerCase().includes(lowercaseQuery) ||
          seller.businessName.toLowerCase().includes(lowercaseQuery) ||
          seller.businessType.toLowerCase().includes(lowercaseQuery) ||
          seller.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
      );
    } catch (error) {
      console.error('Error searching sellers:', error);
      return [];
    }
  }

  // Get seller statistics
  getSellerStats() {
    try {
      const sellers = this.getAllSellers();
      const activeSellers = sellers.filter((s) => s.status === 'active');
      const pendingSellers = sellers.filter((s) => s.status === 'pending');
      const suspendedSellers = sellers.filter((s) => s.status === 'suspended');
      const deletedSellers = sellers.filter((s) => s.status === 'deleted');
      const verifiedSellers = sellers.filter((s) => s.verificationStatus === 'verified');

      // Group by business type
      const businessTypeStats = {};
      activeSellers.forEach((seller) => {
        const type = seller.businessType;
        businessTypeStats[type] = (businessTypeStats[type] || 0) + 1;
      });

      // Calculate total sales and orders
      const totalSales = activeSellers.reduce((sum, seller) => sum + (seller.totalSales || 0), 0);
      const totalOrders = activeSellers.reduce((sum, seller) => sum + (seller.totalOrders || 0), 0);
      const averageRating =
        activeSellers.length > 0
          ? activeSellers.reduce((sum, seller) => sum + (seller.rating || 0), 0) /
            activeSellers.length
          : 0;

      return {
        total: sellers.length,
        active: activeSellers.length,
        pending: pendingSellers.length,
        suspended: suspendedSellers.length,
        deleted: deletedSellers.length,
        verified: verifiedSellers.length,
        businessTypes: Object.keys(businessTypeStats).length,
        businessTypeStats,
        totalSales,
        totalOrders,
        averageRating,
      };
    } catch (error) {
      console.error('Error getting seller statistics:', error);
      return {
        total: 0,
        active: 0,
        pending: 0,
        suspended: 0,
        deleted: 0,
        verified: 0,
        businessTypes: 0,
        businessTypeStats: {},
        totalSales: 0,
        totalOrders: 0,
        averageRating: 0,
      };
    }
  }

  // Get all business types
  getAllBusinessTypes() {
    try {
      const sellers = this.getActiveSellers();
      const businessTypes = [...new Set(sellers.map((s) => s.businessType))];
      return businessTypes.sort();
    } catch (error) {
      console.error('Error getting business types:', error);
      return [];
    }
  }

  // Get all tags
  getAllTags() {
    try {
      const sellers = this.getActiveSellers();
      const tags = [...new Set(sellers.flatMap((s) => s.tags))];
      return tags.sort();
    } catch (error) {
      console.error('Error getting tags:', error);
      return [];
    }
  }

  // Get sellers by business type
  getSellersByBusinessType(businessType) {
    try {
      const sellers = this.getActiveSellers();
      return sellers.filter((seller) => seller.businessType === businessType);
    } catch (error) {
      console.error('Error getting sellers by business type:', error);
      return [];
    }
  }

  // Update seller sales stats
  updateSellerSalesStats(sellerId, orderAmount) {
    try {
      const sellers = this.getAllSellers();
      const sellerIndex = sellers.findIndex((seller) => seller.id === sellerId);

      if (sellerIndex === -1) {
        throw new Error('Seller not found');
      }

      sellers[sellerIndex] = {
        ...sellers[sellerIndex],
        totalOrders: (sellers[sellerIndex].totalOrders || 0) + 1,
        totalSales: (sellers[sellerIndex].totalSales || 0) + orderAmount,
        lastLogin: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(sellers));
      return sellers[sellerIndex];
    } catch (error) {
      console.error('Error updating seller sales stats:', error);
      throw error;
    }
  }
}

// Create service instance
const sellersService = new SellersService();

// Export individual methods
export const getAllSellers = () => sellersService.getAllSellers();
export const getActiveSellers = () => sellersService.getActiveSellers();
export const getPendingSellers = () => sellersService.getPendingSellers();
export const getSuspendedSellers = () => sellersService.getSuspendedSellers();
export const getSellerById = (id) => sellersService.getSellerById(id);
export const getSellerByEmail = (email) => sellersService.getSellerByEmail(email);
export const getSellerBySellerId = (sellerId) => sellersService.getSellerBySellerId(sellerId);
export const createSeller = (sellerData) => sellersService.createSeller(sellerData);
export const updateSeller = (id, sellerData) => sellersService.updateSeller(id, sellerData);
export const deleteSeller = (id) => sellersService.deleteSeller(id);
export const restoreSeller = (id) => sellersService.restoreSeller(id);
export const permanentDeleteSeller = (id) => sellersService.permanentDeleteSeller(id);
export const searchSellers = (query) => sellersService.searchSellers(query);
export const getSellerStats = () => sellersService.getSellerStats();
export const getAllBusinessTypes = () => sellersService.getAllBusinessTypes();
export const getAllTags = () => sellersService.getAllTags();
export const getSellersByBusinessType = (businessType) =>
  sellersService.getSellersByBusinessType(businessType);
export const updateSellerSalesStats = (sellerId, orderAmount) =>
  sellersService.updateSellerSalesStats(sellerId, orderAmount);

// MSW Handlers for API compatibility
export const SellersHandlers = [];

export default sellersService;
