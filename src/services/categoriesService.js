import { v4 as uuidv4 } from 'uuid';

// Get all categories from localStorage
export const getAllCategories = () => {
  try {
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    return categories;
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
};

// Get active categories only
export const getActiveCategories = () => {
  const categories = getAllCategories();
  return categories.filter(category => category.status === 'active');
};

// Get category by ID
export const getCategoryById = (id) => {
  const categories = getAllCategories();
  return categories.find(category => category.id === id);
};

// Get category by slug
export const getCategoryBySlug = (slug) => {
  const categories = getAllCategories();
  return categories.find(category => category.slug === slug);
};

// Add new category
export const addCategory = (categoryData) => {
  try {
    const categories = getAllCategories();
    
    // Check if category name already exists
    const nameExists = categories.some(
      cat => cat.name.toLowerCase() === categoryData.name.toLowerCase()
    );
    
    if (nameExists) {
      throw new Error('Category name already exists');
    }

    // Generate slug from name
    const slug = categoryData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newCategory = {
      id: uuidv4(),
      name: categoryData.name,
      description: categoryData.description || '',
      icon: categoryData.icon || '📁',
      color: categoryData.color || '#1976d2',
      status: categoryData.status || 'active',
      slug: slug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedCategories = [...categories, newCategory];
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
    
    return newCategory;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

// Update category
export const updateCategory = (id, categoryData) => {
  try {
    const categories = getAllCategories();
    
    // Check if category name already exists (excluding current category)
    const nameExists = categories.some(
      cat => cat.id !== id && cat.name.toLowerCase() === categoryData.name.toLowerCase()
    );
    
    if (nameExists) {
      throw new Error('Category name already exists');
    }

    // Generate slug from name
    const slug = categoryData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const updatedCategories = categories.map(category => {
      if (category.id === id) {
        return {
          ...category,
          ...categoryData,
          slug: slug,
          updatedAt: new Date().toISOString(),
        };
      }
      return category;
    });

    localStorage.setItem('categories', JSON.stringify(updatedCategories));
    
    return updatedCategories.find(cat => cat.id === id);
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

// Delete category
export const deleteCategory = (id) => {
  try {
    const categories = getAllCategories();
    const updatedCategories = categories.filter(category => category.id !== id);
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

// Search categories
export const searchCategories = (searchTerm) => {
  const categories = getAllCategories();
  return categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

// Filter categories by status
export const filterCategoriesByStatus = (status) => {
  const categories = getAllCategories();
  if (status === 'all') return categories;
  return categories.filter(category => category.status === status);
};

// Sort categories
export const sortCategories = (categories, sortBy) => {
  const sortedCategories = [...categories];
  
  switch (sortBy) {
    case 'newest':
      return sortedCategories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case 'oldest':
      return sortedCategories.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case 'name-asc':
      return sortedCategories.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sortedCategories.sort((a, b) => b.name.localeCompare(a.name));
    case 'updated':
      return sortedCategories.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    default:
      return sortedCategories;
  }
};

// Get categories with pagination
export const getCategoriesWithPagination = (page = 1, itemsPerPage = 10, filters = {}) => {
  let categories = getAllCategories();
  
  // Apply filters
  if (filters.searchTerm) {
    categories = searchCategories(filters.searchTerm);
  }
  
  if (filters.status && filters.status !== 'all') {
    categories = filterCategoriesByStatus(filters.status);
  }
  
  // Apply sorting
  if (filters.sortBy) {
    categories = sortCategories(categories, filters.sortBy);
  }
  
  // Calculate pagination
  const totalItems = categories.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCategories = categories.slice(startIndex, endIndex);
  
  return {
    categories: paginatedCategories,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    }
  };
};

// Get category statistics
export const getCategoryStats = () => {
  const categories = getAllCategories();
  const activeCategories = categories.filter(cat => cat.status === 'active');
  const inactiveCategories = categories.filter(cat => cat.status === 'inactive');
  
  return {
    total: categories.length,
    active: activeCategories.length,
    inactive: inactiveCategories.length,
  };
};

// Initialize default categories if none exist
export const initializeDefaultCategories = () => {
  const categories = getAllCategories();
  
  if (categories.length === 0) {
    const defaultCategories = [
      {
        id: uuidv4(),
        name: 'Electronics',
        description: 'Electronic devices and gadgets',
        icon: '📱',
        color: '#1976d2',
        status: 'active',
        slug: 'electronics',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: 'Clothing',
        description: 'Fashion and apparel',
        icon: '👕',
        color: '#dc004e',
        status: 'active',
        slug: 'clothing',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: 'Home & Garden',
        description: 'Home improvement and garden supplies',
        icon: '🏠',
        color: '#4caf50',
        status: 'active',
        slug: 'home-garden',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    
    localStorage.setItem('categories', JSON.stringify(defaultCategories));
    return defaultCategories;
  }
  
  return categories;
};
