// Tags API Service
// This service handles all tag-related operations using localStorage

class TagsService {
  constructor() {
    this.storageKey = 'tags';
    this.initializeDefaultTags();
  }

  // Initialize default tags if none exist
  initializeDefaultTags() {
    try {
      const existingTags = localStorage.getItem(this.storageKey);
      if (!existingTags || JSON.parse(existingTags).length === 0) {
        const defaultTags = [
          {
            id: 'tag-1',
            name: 'Electronics',
            description: 'Electronic devices and gadgets',
            color: '#1976d2',
            status: 'active',
            slug: 'electronics',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'tag-2',
            name: 'Fashion',
            description: 'Clothing and accessories',
            color: '#dc004e',
            status: 'active',
            slug: 'fashion',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'tag-3',
            name: 'Home & Garden',
            description: 'Home improvement and garden supplies',
            color: '#4caf50',
            status: 'active',
            slug: 'home-garden',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
        localStorage.setItem(this.storageKey, JSON.stringify(defaultTags));
      }
    } catch (error) {
      console.error('Error initializing default tags:', error);
    }
  }

  // Get all tags
  getAllTags() {
    try {
      const tags = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      return Promise.resolve(tags);
    } catch (error) {
      console.error('Error getting tags:', error);
      return Promise.reject(error);
    }
  }

  // Get tag by ID
  getTagById(id) {
    try {
      const tags = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      const tag = tags.find((tag) => tag.id === id);
      return Promise.resolve(tag || null);
    } catch (error) {
      console.error('Error getting tag by ID:', error);
      return Promise.reject(error);
    }
  }

  // Create new tag
  createTag(tagData) {
    try {
      const tags = JSON.parse(localStorage.getItem(this.storageKey) || '[]');

      // Check if tag name already exists
      const nameExists = tags.some((tag) => tag.name.toLowerCase() === tagData.name.toLowerCase());

      if (nameExists) {
        return Promise.reject(new Error('Tag name already exists'));
      }

      // Generate ID and slug
      const id = Date.now().toString();
      const slug = tagData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const newTag = {
        id,
        name: tagData.name.trim(),
        description: tagData.description?.trim() || '',
        color: tagData.color || '#1976d2',
        status: tagData.status || 'active',
        slug,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedTags = [...tags, newTag];
      localStorage.setItem(this.storageKey, JSON.stringify(updatedTags));

      return Promise.resolve(newTag);
    } catch (error) {
      console.error('Error creating tag:', error);
      return Promise.reject(error);
    }
  }

  // Update tag
  updateTag(id, tagData) {
    try {
      const tags = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      const tagIndex = tags.findIndex((tag) => tag.id === id);

      if (tagIndex === -1) {
        return Promise.reject(new Error('Tag not found'));
      }

      // Check if new name already exists (excluding current tag)
      const nameExists = tags.some(
        (tag) => tag.id !== id && tag.name.toLowerCase() === tagData.name.toLowerCase(),
      );

      if (nameExists) {
        return Promise.reject(new Error('Tag name already exists'));
      }

      // Generate new slug
      const slug = tagData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const updatedTag = {
        ...tags[tagIndex],
        name: tagData.name.trim(),
        description: tagData.description?.trim() || '',
        color: tagData.color || tags[tagIndex].color,
        status: tagData.status || tags[tagIndex].status,
        slug,
        updatedAt: new Date().toISOString(),
      };

      tags[tagIndex] = updatedTag;
      localStorage.setItem(this.storageKey, JSON.stringify(tags));

      return Promise.resolve(updatedTag);
    } catch (error) {
      console.error('Error updating tag:', error);
      return Promise.reject(error);
    }
  }

  // Delete tag
  deleteTag(id) {
    try {
      const tags = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      const updatedTags = tags.filter((tag) => tag.id !== id);

      if (updatedTags.length === tags.length) {
        return Promise.reject(new Error('Tag not found'));
      }

      localStorage.setItem(this.storageKey, JSON.stringify(updatedTags));
      return Promise.resolve({ id, deleted: true });
    } catch (error) {
      console.error('Error deleting tag:', error);
      return Promise.reject(error);
    }
  }

  // Search tags
  searchTags(query) {
    try {
      const tags = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      const filteredTags = tags.filter(
        (tag) =>
          tag.name.toLowerCase().includes(query.toLowerCase()) ||
          tag.description.toLowerCase().includes(query.toLowerCase()),
      );

      return Promise.resolve(filteredTags);
    } catch (error) {
      console.error('Error searching tags:', error);
      return Promise.reject(error);
    }
  }

  // Get tags by status
  getTagsByStatus(status) {
    try {
      const tags = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      const filteredTags = tags.filter((tag) => tag.status === status);

      return Promise.resolve(filteredTags);
    } catch (error) {
      console.error('Error getting tags by status:', error);
      return Promise.reject(error);
    }
  }

  // Get tags count
  getTagsCount() {
    try {
      const tags = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      return Promise.resolve(tags.length);
    } catch (error) {
      console.error('Error getting tags count:', error);
      return Promise.reject(error);
    }
  }

  // Get active tags count
  getActiveTagsCount() {
    try {
      const tags = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      const activeTags = tags.filter((tag) => tag.status === 'active');
      return Promise.resolve(activeTags.length);
    } catch (error) {
      console.error('Error getting active tags count:', error);
      return Promise.reject(error);
    }
  }

  // Bulk delete tags
  bulkDeleteTags(ids) {
    try {
      const tags = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      const updatedTags = tags.filter((tag) => !ids.includes(tag.id));

      localStorage.setItem(this.storageKey, JSON.stringify(updatedTags));
      return Promise.resolve({ deletedCount: ids.length });
    } catch (error) {
      console.error('Error bulk deleting tags:', error);
      return Promise.reject(error);
    }
  }

  // Bulk update tags status
  bulkUpdateTagsStatus(ids, status) {
    try {
      const tags = JSON.parse(localStorage.getItem(this.storageKey) || '[]');

      tags.forEach((tag) => {
        if (ids.includes(tag.id)) {
          tag.status = status;
          tag.updatedAt = new Date().toISOString();
        }
      });

      localStorage.setItem(this.storageKey, JSON.stringify(tags));
      return Promise.resolve({ updatedCount: ids.length });
    } catch (error) {
      console.error('Error bulk updating tags status:', error);
      return Promise.reject(error);
    }
  }
}

// Create and export a singleton instance
const tagsService = new TagsService();

// Export individual methods for convenience
export const getAllTags = () => tagsService.getAllTags();
export const getTagById = (id) => tagsService.getTagById(id);
export const createTag = (tagData) => tagsService.createTag(tagData);
export const updateTag = (id, tagData) => tagsService.updateTag(id, tagData);
export const deleteTag = (id) => tagsService.deleteTag(id);
export const searchTags = (searchTerm) => tagsService.searchTags(searchTerm);
export const getTagsByStatus = (status) => tagsService.getTagsByStatus(status);
export const getTagsCount = () => tagsService.getTagsCount();
export const getActiveTagsCount = () => tagsService.getActiveTagsCount();
export const bulkDeleteTags = (ids) => tagsService.bulkDeleteTags(ids);
export const bulkUpdateTagsStatus = (ids, status) => tagsService.bulkUpdateTagsStatus(ids, status);

export default tagsService;
