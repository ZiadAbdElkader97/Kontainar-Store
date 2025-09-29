// Brands API Service
class BrandsService {
  constructor() {
    this.storageKey = 'brands';
    this.initializeDefaultBrands();
  }

  // Initialize default brands if none exist
  initializeDefaultBrands() {
    const existingBrands = this.getAllBrands();
    if (existingBrands.length === 0) {
      const defaultBrands = [
        {
          id: '1',
          name: 'Apple',
          description: 'Technology and consumer electronics company',
          logo: '',
          website: 'https://www.apple.com',
          country: 'United States',
          foundedYear: 1976,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Samsung',
          description: 'South Korean multinational conglomerate',
          logo: '',
          website: 'https://www.samsung.com',
          country: 'South Korea',
          foundedYear: 1938,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Nike',
          description: 'American multinational corporation for athletic footwear and apparel',
          logo: '',
          website: 'https://www.nike.com',
          country: 'United States',
          foundedYear: 1964,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      localStorage.setItem(this.storageKey, JSON.stringify(defaultBrands));
    }
  }

  // Get all brands
  getAllBrands() {
    try {
      const brands = localStorage.getItem(this.storageKey);
      return brands ? JSON.parse(brands) : [];
    } catch (error) {
      console.error('Error getting brands:', error);
      return [];
    }
  }

  // Get brand by ID
  getBrandById(id) {
    try {
      const brands = this.getAllBrands();
      return brands.find((brand) => brand.id === id);
    } catch (error) {
      console.error('Error getting brand by ID:', error);
      return null;
    }
  }

  // Create new brand
  createBrand(brandData) {
    try {
      const brands = this.getAllBrands();
      const newBrand = {
        id: Date.now().toString(),
        ...brandData,
        status: brandData.status || 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      brands.push(newBrand);
      localStorage.setItem(this.storageKey, JSON.stringify(brands));
      return newBrand;
    } catch (error) {
      console.error('Error creating brand:', error);
      throw error;
    }
  }

  // Update brand
  updateBrand(id, brandData) {
    try {
      const brands = this.getAllBrands();
      const brandIndex = brands.findIndex((brand) => brand.id === id);

      if (brandIndex === -1) {
        throw new Error('Brand not found');
      }

      brands[brandIndex] = {
        ...brands[brandIndex],
        ...brandData,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(brands));
      return brands[brandIndex];
    } catch (error) {
      console.error('Error updating brand:', error);
      throw error;
    }
  }

  // Delete brand (soft delete)
  deleteBrand(id) {
    try {
      const brands = this.getAllBrands();
      const brandIndex = brands.findIndex((brand) => brand.id === id);

      if (brandIndex === -1) {
        throw new Error('Brand not found');
      }

      brands[brandIndex] = {
        ...brands[brandIndex],
        status: 'deleted',
        deletedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(brands));
      return true;
    } catch (error) {
      console.error('Error deleting brand:', error);
      throw error;
    }
  }

  // Permanently delete brand
  permanentDeleteBrand(id) {
    try {
      const brands = this.getAllBrands();
      const filteredBrands = brands.filter((brand) => brand.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(filteredBrands));
      return true;
    } catch (error) {
      console.error('Error permanently deleting brand:', error);
      throw error;
    }
  }

  // Restore deleted brand
  restoreBrand(id) {
    try {
      const brands = this.getAllBrands();
      const brandIndex = brands.findIndex((brand) => brand.id === id);

      if (brandIndex === -1) {
        throw new Error('Brand not found');
      }

      brands[brandIndex] = {
        ...brands[brandIndex],
        status: 'active',
        deletedAt: null,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(brands));
      return brands[brandIndex];
    } catch (error) {
      console.error('Error restoring brand:', error);
      throw error;
    }
  }

  // Search brands
  searchBrands(query) {
    try {
      const brands = this.getAllBrands();
      const activeBrands = brands.filter((brand) => brand.status !== 'deleted');

      if (!query) return activeBrands;

      const lowercaseQuery = query.toLowerCase();
      return activeBrands.filter(
        (brand) =>
          brand.name.toLowerCase().includes(lowercaseQuery) ||
          brand.description.toLowerCase().includes(lowercaseQuery) ||
          brand.country.toLowerCase().includes(lowercaseQuery),
      );
    } catch (error) {
      console.error('Error searching brands:', error);
      return [];
    }
  }

  // Get brands by status
  getBrandsByStatus(status) {
    try {
      const brands = this.getAllBrands();
      return brands.filter((brand) => brand.status === status);
    } catch (error) {
      console.error('Error getting brands by status:', error);
      return [];
    }
  }

  // Get deleted brands
  getDeletedBrands() {
    return this.getBrandsByStatus('deleted');
  }

  // Toggle brand status
  toggleBrandStatus(id) {
    try {
      const brand = this.getBrandById(id);
      if (!brand) {
        throw new Error('Brand not found');
      }

      const newStatus = brand.status === 'active' ? 'inactive' : 'active';
      return this.updateBrand(id, { status: newStatus });
    } catch (error) {
      console.error('Error toggling brand status:', error);
      throw error;
    }
  }

  // Get brands statistics
  getBrandsStats() {
    try {
      const brands = this.getAllBrands();
      const activeBrands = brands.filter((brand) => brand.status === 'active');
      const inactiveBrands = brands.filter((brand) => brand.status === 'inactive');
      const deletedBrands = brands.filter((brand) => brand.status === 'deleted');

      return {
        total: brands.length,
        active: activeBrands.length,
        inactive: inactiveBrands.length,
        deleted: deletedBrands.length,
      };
    } catch (error) {
      console.error('Error getting brands stats:', error);
      return {
        total: 0,
        active: 0,
        inactive: 0,
        deleted: 0,
      };
    }
  }
}

// Create service instance
const brandsService = new BrandsService();

// Export individual methods
export const getAllBrands = () => brandsService.getAllBrands();
export const getBrandById = (id) => brandsService.getBrandById(id);
export const createBrand = (brandData) => brandsService.createBrand(brandData);
export const updateBrand = (id, brandData) => brandsService.updateBrand(id, brandData);
export const deleteBrand = (id) => brandsService.deleteBrand(id);
export const permanentDeleteBrand = (id) => brandsService.permanentDeleteBrand(id);
export const restoreBrand = (id) => brandsService.restoreBrand(id);
export const searchBrands = (query) => brandsService.searchBrands(query);
export const getBrandsByStatus = (status) => brandsService.getBrandsByStatus(status);
export const getDeletedBrands = () => brandsService.getDeletedBrands();
export const toggleBrandStatus = (id) => brandsService.toggleBrandStatus(id);
export const getBrandsStats = () => brandsService.getBrandsStats();

// MSW Handlers for API compatibility
export const BrandHandlers = [];
