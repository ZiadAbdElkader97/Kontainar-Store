class RolesService {
  constructor() {
    this.storageKey = 'roles-data';
    this.initializeDefaultRoles();
  }

  initializeDefaultRoles() {
    const existingData = localStorage.getItem(this.storageKey);
    if (!existingData) {
      const defaultRoles = [
        {
          id: '1',
          name: 'Administrator',
          key: 'admin',
          description: 'Full system access with all permissions',
          permissions: [
            'users.read',
            'users.create',
            'users.update',
            'users.delete',
            'roles.read',
            'roles.create',
            'roles.update',
            'roles.delete',
            'products.read',
            'products.create',
            'products.update',
            'products.delete',
            'orders.read',
            'orders.create',
            'orders.update',
            'orders.delete',
            'reports.read',
            'settings.read',
            'settings.update',
            'system.admin',
          ],
          color: '#f44336',
          isSystem: true,
          userCount: 0,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Manager',
          key: 'manager',
          description: 'Management access with limited administrative permissions',
          permissions: [
            'users.read',
            'users.create',
            'users.update',
            'products.read',
            'products.create',
            'products.update',
            'orders.read',
            'orders.create',
            'orders.update',
            'reports.read',
            'settings.read',
          ],
          color: '#ff9800',
          isSystem: true,
          userCount: 0,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'User',
          key: 'user',
          description: 'Basic user access with read permissions',
          permissions: ['products.read', 'orders.read', 'profile.read', 'profile.update'],
          color: '#4caf50',
          isSystem: true,
          userCount: 0,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '4',
          name: 'Sales Representative',
          key: 'sales_rep',
          description: 'Sales team member with order and customer management access',
          permissions: [
            'users.read',
            'products.read',
            'orders.read',
            'orders.create',
            'orders.update',
            'customers.read',
            'customers.create',
            'customers.update',
            'reports.read',
          ],
          color: '#2196f3',
          isSystem: false,
          userCount: 0,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '5',
          name: 'Customer Support',
          key: 'support',
          description: 'Customer support team with limited access to orders and customers',
          permissions: [
            'orders.read',
            'orders.update',
            'customers.read',
            'customers.update',
            'tickets.read',
            'tickets.create',
            'tickets.update',
          ],
          color: '#9c27b0',
          isSystem: false,
          userCount: 0,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      localStorage.setItem(this.storageKey, JSON.stringify(defaultRoles));
    }
  }

  // Get all roles
  getAllRoles() {
    try {
      const roles = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      return roles;
    } catch (error) {
      console.error('Error getting roles:', error);
      return [];
    }
  }

  // Get active roles only
  getActiveRoles() {
    try {
      const roles = this.getAllRoles();
      return roles.filter((role) => role.status !== 'deleted');
    } catch (error) {
      console.error('Error getting active roles:', error);
      return [];
    }
  }

  // Get deleted roles only
  getDeletedRoles() {
    try {
      const roles = this.getAllRoles();
      return roles.filter((role) => role.status === 'deleted');
    } catch (error) {
      console.error('Error getting deleted roles:', error);
      return [];
    }
  }

  // Get role by ID
  getRoleById(id) {
    try {
      const roles = this.getAllRoles();
      return roles.find((role) => role.id === id);
    } catch (error) {
      console.error('Error getting role by ID:', error);
      return null;
    }
  }

  // Get role by key
  getRoleByKey(key) {
    try {
      const roles = this.getAllRoles();
      return roles.find((role) => role.key === key);
    } catch (error) {
      console.error('Error getting role by key:', error);
      return null;
    }
  }

  // Create new role
  createRole(roleData) {
    try {
      const roles = this.getAllRoles();

      // Check if role key already exists
      const existingRole = roles.find((role) => role.key === roleData.key);
      if (existingRole) {
        throw new Error('Role key already exists');
      }

      const newRole = {
        id: Date.now().toString(),
        ...roleData,
        isSystem: false,
        userCount: 0,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      roles.push(newRole);
      localStorage.setItem(this.storageKey, JSON.stringify(roles));
      return newRole;
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  }

  // Update role
  updateRole(id, roleData) {
    try {
      const roles = this.getAllRoles();
      const roleIndex = roles.findIndex((role) => role.id === id);

      if (roleIndex === -1) {
        throw new Error('Role not found');
      }

      // Prevent updating system roles
      if (roles[roleIndex].isSystem) {
        throw new Error('Cannot modify system roles');
      }

      // Check if role key already exists (excluding current role)
      if (roleData.key && roleData.key !== roles[roleIndex].key) {
        const existingRole = roles.find((role) => role.key === roleData.key && role.id !== id);
        if (existingRole) {
          throw new Error('Role key already exists');
        }
      }

      roles[roleIndex] = {
        ...roles[roleIndex],
        ...roleData,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(roles));
      return roles[roleIndex];
    } catch (error) {
      console.error('Error updating role:', error);
      throw error;
    }
  }

  // Soft delete role
  deleteRole(id) {
    try {
      const roles = this.getAllRoles();
      const roleIndex = roles.findIndex((role) => role.id === id);

      if (roleIndex === -1) {
        throw new Error('Role not found');
      }

      // Prevent deleting system roles
      if (roles[roleIndex].isSystem) {
        throw new Error('Cannot delete system roles');
      }

      // Check if role is being used by users
      if (roles[roleIndex].userCount > 0) {
        throw new Error('Cannot delete role that is assigned to users');
      }

      roles[roleIndex] = {
        ...roles[roleIndex],
        status: 'deleted',
        deletedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(roles));
      return roles[roleIndex];
    } catch (error) {
      console.error('Error deleting role:', error);
      throw error;
    }
  }

  // Restore role
  restoreRole(id) {
    try {
      const roles = this.getAllRoles();
      const roleIndex = roles.findIndex((role) => role.id === id);

      if (roleIndex === -1) {
        throw new Error('Role not found');
      }

      roles[roleIndex] = {
        ...roles[roleIndex],
        status: 'active',
        deletedAt: null,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(roles));
      return roles[roleIndex];
    } catch (error) {
      console.error('Error restoring role:', error);
      throw error;
    }
  }

  // Permanently delete role
  permanentDeleteRole(id) {
    try {
      const roles = this.getAllRoles();
      const roleIndex = roles.findIndex((role) => role.id === id);

      if (roleIndex === -1) {
        throw new Error('Role not found');
      }

      // Prevent deleting system roles
      if (roles[roleIndex].isSystem) {
        throw new Error('Cannot delete system roles');
      }

      const filteredRoles = roles.filter((role) => role.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(filteredRoles));
      return true;
    } catch (error) {
      console.error('Error permanently deleting role:', error);
      throw error;
    }
  }

  // Search roles
  searchRoles(query) {
    try {
      const roles = this.getAllRoles();
      const lowercaseQuery = query.toLowerCase();

      return roles.filter((role) => {
        return (
          role.name.toLowerCase().includes(lowercaseQuery) ||
          role.key.toLowerCase().includes(lowercaseQuery) ||
          role.description.toLowerCase().includes(lowercaseQuery)
        );
      });
    } catch (error) {
      console.error('Error searching roles:', error);
      return [];
    }
  }

  // Get role statistics
  getRoleStats() {
    try {
      const roles = this.getAllRoles();
      const systemRoles = roles.filter((role) => role.isSystem);
      const customRoles = roles.filter((role) => !role.isSystem);
      const totalUsers = roles.reduce((sum, role) => sum + role.userCount, 0);

      return {
        total: roles.length,
        system: systemRoles.length,
        custom: customRoles.length,
        totalUsers,
      };
    } catch (error) {
      console.error('Error getting role stats:', error);
      return {
        total: 0,
        system: 0,
        custom: 0,
        totalUsers: 0,
      };
    }
  }

  // Update role user count
  updateRoleUserCount(roleKey, increment = true) {
    try {
      const roles = this.getAllRoles();
      const roleIndex = roles.findIndex((role) => role.key === roleKey);

      if (roleIndex === -1) {
        throw new Error('Role not found');
      }

      roles[roleIndex] = {
        ...roles[roleIndex],
        userCount: increment
          ? roles[roleIndex].userCount + 1
          : Math.max(0, roles[roleIndex].userCount - 1),
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(roles));
      return roles[roleIndex];
    } catch (error) {
      console.error('Error updating role user count:', error);
      throw error;
    }
  }

  // Get all available permissions
  getAllPermissions() {
    return [
      // User Management
      {
        category: 'User Management',
        permissions: [
          { key: 'users.read', name: 'View Users', description: 'View user list and details' },
          { key: 'users.create', name: 'Create Users', description: 'Create new users' },
          { key: 'users.update', name: 'Update Users', description: 'Edit user information' },
          { key: 'users.delete', name: 'Delete Users', description: 'Delete users' },
        ],
      },
      // Role Management
      {
        category: 'Role Management',
        permissions: [
          { key: 'roles.read', name: 'View Roles', description: 'View role list and details' },
          { key: 'roles.create', name: 'Create Roles', description: 'Create new roles' },
          { key: 'roles.update', name: 'Update Roles', description: 'Edit role information' },
          { key: 'roles.delete', name: 'Delete Roles', description: 'Delete roles' },
        ],
      },
      // Product Management
      {
        category: 'Product Management',
        permissions: [
          {
            key: 'products.read',
            name: 'View Products',
            description: 'View product list and details',
          },
          { key: 'products.create', name: 'Create Products', description: 'Create new products' },
          {
            key: 'products.update',
            name: 'Update Products',
            description: 'Edit product information',
          },
          { key: 'products.delete', name: 'Delete Products', description: 'Delete products' },
        ],
      },
      // Order Management
      {
        category: 'Order Management',
        permissions: [
          { key: 'orders.read', name: 'View Orders', description: 'View order list and details' },
          { key: 'orders.create', name: 'Create Orders', description: 'Create new orders' },
          { key: 'orders.update', name: 'Update Orders', description: 'Edit order information' },
          { key: 'orders.delete', name: 'Delete Orders', description: 'Delete orders' },
        ],
      },
      // Customer Management
      {
        category: 'Customer Management',
        permissions: [
          {
            key: 'customers.read',
            name: 'View Customers',
            description: 'View customer list and details',
          },
          {
            key: 'customers.create',
            name: 'Create Customers',
            description: 'Create new customers',
          },
          {
            key: 'customers.update',
            name: 'Update Customers',
            description: 'Edit customer information',
          },
          { key: 'customers.delete', name: 'Delete Customers', description: 'Delete customers' },
        ],
      },
      // Reports
      {
        category: 'Reports',
        permissions: [
          { key: 'reports.read', name: 'View Reports', description: 'View system reports' },
          { key: 'reports.export', name: 'Export Reports', description: 'Export reports to files' },
        ],
      },
      // Settings
      {
        category: 'Settings',
        permissions: [
          { key: 'settings.read', name: 'View Settings', description: 'View system settings' },
          {
            key: 'settings.update',
            name: 'Update Settings',
            description: 'Modify system settings',
          },
        ],
      },
      // Profile
      {
        category: 'Profile',
        permissions: [
          { key: 'profile.read', name: 'View Profile', description: 'View own profile' },
          { key: 'profile.update', name: 'Update Profile', description: 'Edit own profile' },
        ],
      },
      // Tickets
      {
        category: 'Support Tickets',
        permissions: [
          { key: 'tickets.read', name: 'View Tickets', description: 'View support tickets' },
          { key: 'tickets.create', name: 'Create Tickets', description: 'Create support tickets' },
          { key: 'tickets.update', name: 'Update Tickets', description: 'Update support tickets' },
          { key: 'tickets.delete', name: 'Delete Tickets', description: 'Delete support tickets' },
        ],
      },
      // System Administration
      {
        category: 'System Administration',
        permissions: [
          {
            key: 'system.admin',
            name: 'System Admin',
            description: 'Full system administration access',
          },
          {
            key: 'system.backup',
            name: 'System Backup',
            description: 'Create and manage system backups',
          },
          { key: 'system.logs', name: 'System Logs', description: 'View system logs' },
        ],
      },
    ];
  }
}

// Create service instance
const rolesService = new RolesService();

// Export individual methods
export const getAllRoles = () => rolesService.getAllRoles();
export const getActiveRoles = () => rolesService.getActiveRoles();
export const getDeletedRoles = () => rolesService.getDeletedRoles();
export const getRoleById = (id) => rolesService.getRoleById(id);
export const getRoleByKey = (key) => rolesService.getRoleByKey(key);
export const createRole = (roleData) => rolesService.createRole(roleData);
export const updateRole = (id, roleData) => rolesService.updateRole(id, roleData);
export const deleteRole = (id) => rolesService.deleteRole(id);
export const restoreRole = (id) => rolesService.restoreRole(id);
export const permanentDeleteRole = (id) => rolesService.permanentDeleteRole(id);
export const searchRoles = (query) => rolesService.searchRoles(query);
export const getRoleStats = () => rolesService.getRoleStats();
export const updateRoleUserCount = (roleKey, increment) =>
  rolesService.updateRoleUserCount(roleKey, increment);
export const getAllPermissions = () => rolesService.getAllPermissions();

// MSW Handlers for API compatibility
export const RolesHandlers = [];
