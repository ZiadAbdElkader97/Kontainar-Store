class AttributesService {
  constructor() {
    this.storageKey = 'attributes';
    this.initializeDefaultAttributes();
  }

  // Initialize default attributes if none exist
  initializeDefaultAttributes() {
    const existingAttributes = this.getAllAttributes();
    if (existingAttributes.length === 0) {
      const defaultAttributes = [
        {
          id: 1,
          name: 'Color',
          type: 'text',
          description: 'Product color attribute',
          isRequired: true,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Size',
          type: 'select',
          description: 'Product size attribute',
          isRequired: true,
          isActive: true,
          options: ['Small', 'Medium', 'Large', 'XL'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 3,
          name: 'Material',
          type: 'text',
          description: 'Product material attribute',
          isRequired: false,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 4,
          name: 'Weight',
          type: 'number',
          description: 'Product weight in grams',
          isRequired: false,
          isActive: true,
          unit: 'grams',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      localStorage.setItem(this.storageKey, JSON.stringify(defaultAttributes));
    }
  }

  // Get all attributes
  getAllAttributes() {
    try {
      const attributes = localStorage.getItem(this.storageKey);
      return attributes ? JSON.parse(attributes) : [];
    } catch (error) {
      console.error('Error getting attributes:', error);
      return [];
    }
  }

  // Get attribute by ID
  getAttributeById(id) {
    try {
      const attributes = this.getAllAttributes();
      return attributes.find(attr => attr.id === parseInt(id));
    } catch (error) {
      console.error('Error getting attribute by ID:', error);
      return null;
    }
  }

  // Create new attribute
  createAttribute(attributeData) {
    try {
      const attributes = this.getAllAttributes();
      const newAttribute = {
        id: Date.now(),
        name: attributeData.name,
        type: attributeData.type,
        description: attributeData.description || '',
        isRequired: attributeData.isRequired || false,
        isActive: attributeData.isActive !== undefined ? attributeData.isActive : true,
        options: attributeData.options || [],
        unit: attributeData.unit || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      attributes.push(newAttribute);
      localStorage.setItem(this.storageKey, JSON.stringify(attributes));
      return newAttribute;
    } catch (error) {
      console.error('Error creating attribute:', error);
      throw error;
    }
  }

  // Update attribute
  updateAttribute(id, attributeData) {
    try {
      const attributes = this.getAllAttributes();
      const index = attributes.findIndex(attr => attr.id === parseInt(id));
      
      if (index === -1) {
        throw new Error('Attribute not found');
      }

      attributes[index] = {
        ...attributes[index],
        ...attributeData,
        id: parseInt(id),
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem(this.storageKey, JSON.stringify(attributes));
      return attributes[index];
    } catch (error) {
      console.error('Error updating attribute:', error);
      throw error;
    }
  }

  // Delete attribute
  deleteAttribute(id) {
    try {
      const attributes = this.getAllAttributes();
      const filteredAttributes = attributes.filter(attr => attr.id !== parseInt(id));
      localStorage.setItem(this.storageKey, JSON.stringify(filteredAttributes));
      return true;
    } catch (error) {
      console.error('Error deleting attribute:', error);
      throw error;
    }
  }

  // Search attributes
  searchAttributes(query) {
    try {
      const attributes = this.getAllAttributes();
      const lowercaseQuery = query.toLowerCase();
      
      return attributes.filter(attr => 
        attr.name.toLowerCase().includes(lowercaseQuery) ||
        attr.description.toLowerCase().includes(lowercaseQuery) ||
        attr.type.toLowerCase().includes(lowercaseQuery)
      );
    } catch (error) {
      console.error('Error searching attributes:', error);
      return [];
    }
  }

  // Get attributes by status
  getAttributesByStatus(isActive) {
    try {
      const attributes = this.getAllAttributes();
      return attributes.filter(attr => attr.isActive === isActive);
    } catch (error) {
      console.error('Error getting attributes by status:', error);
      return [];
    }
  }

  // Get attributes by type
  getAttributesByType(type) {
    try {
      const attributes = this.getAllAttributes();
      return attributes.filter(attr => attr.type === type);
    } catch (error) {
      console.error('Error getting attributes by type:', error);
      return [];
    }
  }

  // Toggle attribute status
  toggleAttributeStatus(id) {
    try {
      const attributes = this.getAllAttributes();
      const index = attributes.findIndex(attr => attr.id === parseInt(id));
      
      if (index === -1) {
        throw new Error('Attribute not found');
      }

      attributes[index].isActive = !attributes[index].isActive;
      attributes[index].updatedAt = new Date().toISOString();

      localStorage.setItem(this.storageKey, JSON.stringify(attributes));
      return attributes[index];
    } catch (error) {
      console.error('Error toggling attribute status:', error);
      throw error;
    }
  }
}

// Create instance and export methods
const attributesService = new AttributesService();

export const getAllAttributes = () => attributesService.getAllAttributes();
export const getAttributeById = (id) => attributesService.getAttributeById(id);
export const createAttribute = (attributeData) => attributesService.createAttribute(attributeData);
export const updateAttribute = (id, attributeData) => attributesService.updateAttribute(id, attributeData);
export const deleteAttribute = (id) => attributesService.deleteAttribute(id);
export const searchAttributes = (query) => attributesService.searchAttributes(query);
export const getAttributesByStatus = (isActive) => attributesService.getAttributesByStatus(isActive);
export const getAttributesByType = (type) => attributesService.getAttributesByType(type);
export const toggleAttributeStatus = (id) => attributesService.toggleAttributeStatus(id);
