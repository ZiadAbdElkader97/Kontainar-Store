class PermissionsService {
  constructor() {
    this.storageKey = 'permissions';
    this.initializeDefaultPermissions();
  }

  // Initialize default permissions
  initializeDefaultPermissions() {
    const existingPermissions = localStorage.getItem(this.storageKey);
    if (!existingPermissions) {
      const defaultPermissions = [
        {
          id: '1',
          name: 'Users Management',
          key: 'users',
          description: 'Manage user accounts and profiles',
          category: 'User Management',
          actions: ['read', 'create', 'update', 'delete'],
          isSystem: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'active',
        },
        {
          id: '2',
          name: 'Products Management',
          key: 'products',
          description: 'Manage product catalog and inventory',
          category: 'E-commerce',
          actions: ['read', 'create', 'update', 'delete'],
          isSystem: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'active',
        },
        {
          id: '3',
          name: 'Orders Management',
          key: 'orders',
          description: 'Manage customer orders and transactions',
          category: 'E-commerce',
          actions: ['read', 'create', 'update', 'delete'],
          isSystem: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'active',
        },
        {
          id: '4',
          name: 'Reports & Analytics',
          key: 'reports',
          description: 'Access to reports and analytics dashboard',
          category: 'Analytics',
          actions: ['read', 'create'],
          isSystem: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'active',
        },
        {
          id: '5',
          name: 'System Settings',
          key: 'settings',
          description: 'Configure system settings and preferences',
          category: 'System',
          actions: ['read', 'update'],
          isSystem: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'active',
        },
        {
          id: '6',
          name: 'Roles Management',
          key: 'roles',
          description: 'Manage user roles and permissions',
          category: 'User Management',
          actions: ['read', 'create', 'update', 'delete'],
          isSystem: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'active',
        },
        {
          id: '7',
          name: 'Customer Support',
          key: 'support',
          description: 'Access to customer support tools and tickets',
          category: 'Support',
          actions: ['read', 'create', 'update'],
          isSystem: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'active',
        },
        {
          id: '8',
          name: 'Content Management',
          key: 'content',
          description: 'Manage website content and blog posts',
          category: 'Content',
          actions: ['read', 'create', 'update', 'delete'],
          isSystem: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'active',
        },
      ];

      localStorage.setItem(this.storageKey, JSON.stringify(defaultPermissions));
    }
  }

  // Get all permissions
  getAllPermissions() {
    try {
      const permissions = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      return permissions;
    } catch (error) {
      console.error('Error getting permissions:', error);
      return [];
    }
  }

  // Get active permissions only
  getActivePermissions() {
    try {
      const permissions = this.getAllPermissions();
      return permissions.filter((permission) => permission.status !== 'deleted');
    } catch (error) {
      console.error('Error getting active permissions:', error);
      return [];
    }
  }

  // Get deleted permissions only
  getDeletedPermissions() {
    try {
      const permissions = this.getAllPermissions();
      return permissions.filter((permission) => permission.status === 'deleted');
    } catch (error) {
      console.error('Error getting deleted permissions:', error);
      return [];
    }
  }

  // Get permission by ID
  getPermissionById(id) {
    try {
      const permissions = this.getAllPermissions();
      return permissions.find((permission) => permission.id === id);
    } catch (error) {
      console.error('Error getting permission by ID:', error);
      return null;
    }
  }

  // Get permission by key
  getPermissionByKey(key) {
    try {
      const permissions = this.getAllPermissions();
      return permissions.find((permission) => permission.key === key);
    } catch (error) {
      console.error('Error getting permission by key:', error);
      return null;
    }
  }

  // Create new permission
  createPermission(permissionData) {
    try {
      const permissions = this.getAllPermissions();

      // Check if permission key already exists
      const existingPermission = permissions.find(
        (permission) => permission.key === permissionData.key,
      );
      if (existingPermission) {
        throw new Error('Permission key already exists');
      }

      const newPermission = {
        id: Date.now().toString(),
        ...permissionData,
        isSystem: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
      };

      permissions.push(newPermission);
      localStorage.setItem(this.storageKey, JSON.stringify(permissions));
      return newPermission;
    } catch (error) {
      console.error('Error creating permission:', error);
      throw error;
    }
  }

  // Update permission
  updatePermission(id, permissionData) {
    try {
      const permissions = this.getAllPermissions();
      const permissionIndex = permissions.findIndex((permission) => permission.id === id);

      if (permissionIndex === -1) {
        throw new Error('Permission not found');
      }

      // Prevent updating system permissions
      if (permissions[permissionIndex].isSystem) {
        throw new Error('Cannot modify system permissions');
      }

      // Check if permission key already exists (excluding current permission)
      if (permissionData.key && permissionData.key !== permissions[permissionIndex].key) {
        const existingPermission = permissions.find(
          (permission) => permission.key === permissionData.key && permission.id !== id,
        );
        if (existingPermission) {
          throw new Error('Permission key already exists');
        }
      }

      permissions[permissionIndex] = {
        ...permissions[permissionIndex],
        ...permissionData,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(permissions));
      return permissions[permissionIndex];
    } catch (error) {
      console.error('Error updating permission:', error);
      throw error;
    }
  }

  // Soft delete permission
  deletePermission(id) {
    try {
      const permissions = this.getAllPermissions();
      const permissionIndex = permissions.findIndex((permission) => permission.id === id);

      if (permissionIndex === -1) {
        throw new Error('Permission not found');
      }

      // Prevent deleting system permissions
      if (permissions[permissionIndex].isSystem) {
        throw new Error('Cannot delete system permissions');
      }

      permissions[permissionIndex] = {
        ...permissions[permissionIndex],
        status: 'deleted',
        deletedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(permissions));
      return permissions[permissionIndex];
    } catch (error) {
      console.error('Error deleting permission:', error);
      throw error;
    }
  }

  // Restore permission
  restorePermission(id) {
    try {
      const permissions = this.getAllPermissions();
      const permissionIndex = permissions.findIndex((permission) => permission.id === id);

      if (permissionIndex === -1) {
        throw new Error('Permission not found');
      }

      permissions[permissionIndex] = {
        ...permissions[permissionIndex],
        status: 'active',
        deletedAt: null,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(permissions));
      return permissions[permissionIndex];
    } catch (error) {
      console.error('Error restoring permission:', error);
      throw error;
    }
  }

  // Permanently delete permission
  permanentDeletePermission(id) {
    try {
      const permissions = this.getAllPermissions();
      const permissionIndex = permissions.findIndex((permission) => permission.id === id);

      if (permissionIndex === -1) {
        throw new Error('Permission not found');
      }

      // Prevent permanently deleting system permissions
      if (permissions[permissionIndex].isSystem) {
        throw new Error('Cannot permanently delete system permissions');
      }

      const filteredPermissions = permissions.filter((permission) => permission.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(filteredPermissions));
      return true;
    } catch (error) {
      console.error('Error permanently deleting permission:', error);
      throw error;
    }
  }

  // Search permissions
  searchPermissions(query) {
    try {
      const permissions = this.getAllPermissions();
      const lowercaseQuery = query.toLowerCase();

      return permissions.filter(
        (permission) =>
          permission.name.toLowerCase().includes(lowercaseQuery) ||
          permission.key.toLowerCase().includes(lowercaseQuery) ||
          permission.description.toLowerCase().includes(lowercaseQuery) ||
          permission.category.toLowerCase().includes(lowercaseQuery),
      );
    } catch (error) {
      console.error('Error searching permissions:', error);
      return [];
    }
  }

  // Get permission statistics
  getPermissionStats() {
    try {
      const permissions = this.getAllPermissions();
      const activePermissions = permissions.filter((p) => p.status === 'active');
      const deletedPermissions = permissions.filter((p) => p.status === 'deleted');
      const systemPermissions = permissions.filter((p) => p.isSystem);
      const customPermissions = permissions.filter((p) => !p.isSystem);

      // Group by category
      const categoryStats = {};
      activePermissions.forEach((permission) => {
        const category = permission.category;
        categoryStats[category] = (categoryStats[category] || 0) + 1;
      });

      return {
        total: permissions.length,
        active: activePermissions.length,
        deleted: deletedPermissions.length,
        system: systemPermissions.length,
        custom: customPermissions.length,
        categories: Object.keys(categoryStats).length,
        categoryStats,
      };
    } catch (error) {
      console.error('Error getting permission statistics:', error);
      return {
        total: 0,
        active: 0,
        deleted: 0,
        system: 0,
        custom: 0,
        categories: 0,
        categoryStats: {},
      };
    }
  }

  // Get all categories
  getAllCategories() {
    try {
      const permissions = this.getActivePermissions();
      const categories = [...new Set(permissions.map((p) => p.category))];
      return categories.sort();
    } catch (error) {
      console.error('Error getting categories:', error);
      return [];
    }
  }

  // Get all actions
  getAllActions() {
    try {
      const permissions = this.getActivePermissions();
      const actions = [...new Set(permissions.flatMap((p) => p.actions))];
      return actions.sort();
    } catch (error) {
      console.error('Error getting actions:', error);
      return [];
    }
  }
}

// Create service instance
const permissionsService = new PermissionsService();

// Export individual methods
export const getAllPermissions = () => permissionsService.getAllPermissions();
export const getActivePermissions = () => permissionsService.getActivePermissions();
export const getDeletedPermissions = () => permissionsService.getDeletedPermissions();
export const getPermissionById = (id) => permissionsService.getPermissionById(id);
export const getPermissionByKey = (key) => permissionsService.getPermissionByKey(key);
export const createPermission = (permissionData) =>
  permissionsService.createPermission(permissionData);
export const updatePermission = (id, permissionData) =>
  permissionsService.updatePermission(id, permissionData);
export const deletePermission = (id) => permissionsService.deletePermission(id);
export const restorePermission = (id) => permissionsService.restorePermission(id);
export const permanentDeletePermission = (id) => permissionsService.permanentDeletePermission(id);
export const searchPermissions = (query) => permissionsService.searchPermissions(query);
export const getPermissionStats = () => permissionsService.getPermissionStats();
export const getAllCategories = () => permissionsService.getAllCategories();
export const getAllActions = () => permissionsService.getAllActions();

// MSW Handlers for API compatibility
export const PermissionsHandlers = [];

export default permissionsService;
